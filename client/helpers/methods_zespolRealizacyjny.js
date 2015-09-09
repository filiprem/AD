isUserInZespolRealizacyjnyNotification=function(id,zespolTab){
    console.log("tablica");
    console.log(zespolTab);

    //var tab= _.pluck(zespolTab,'idUser');
    //console.log(tab);
    if(_.contains(zespolTab,id)){
        //if(_.contains(tab,id)){
        GlobalNotification.error({
            title: 'Błąd',
            content: 'Jesteś już w ZR.',
            duration: 3 // duration the notification should stay in seconds
        });
        return true;
    }
    else
        return false;
};
isUserCountInZespolRealizacyjnyNotification=function(id,zespolTab,numberOfCzlonkowie){
    if(zespolTab.length==3) {
        var komunikat='Jest już '+numberOfCzlonkowie+' członków ZR';
        GlobalNotification.error({
            title: 'Błąd',
            content: komunikat,
            duration: 3 // duration the notification should stay in seconds
        });
        return true;
    }
    return false;
};
addCzlonekToZespolRealizacyjnyNotification=function(idUser,zespolToUpdate,numberOfCzlonkowie,zespolId){

    if(zespolToUpdate.length==2) {
        //sprawdzam czy mamy taki zespol z idącym kolejnym członkiem
        zespolToUpdate.push(idUser);
        ///////wszystkie kwestie glosowane,czyli ZR się nie zmieni.jezeli jest glosowana,to wiadome,że ZR będzie ==3, a mojej nie bedzie,bo nie jest głosowana!
        var kwestie = Kwestia.find({
            $where: function () {
                return (this.status==KWESTIA_STATUS.GLOSOWANA || this.status==KWESTIA_STATUS.ARCHIWALNA);
            }
        });
        console.log(kwestie.count());
        var flag=false;
        var arrayZespolyDouble=[];
        kwestie.forEach(function(kwestia){//odnajdujemy zespoly
            var zespol=ZespolRealizacyjny.findOne({_id:kwestia.idZespolRealizacyjny});
            if(zespol){
                var i=0;
                _.each(zespol.zespol, function (zespolItem) {//dla kazdej aktualnego item z aktualnego zepsolu
                    console.log("czlonek zespolu");
                    console.log(zespolItem);

                    if (_.contains(zespolToUpdate, zespolItem)) {//jezeli z bazy tablica zawiera ten z zespołu
                        i++;
                        console.log("Jest już nr: " + i);
                        console.log(zespol);
                    }
                });
                if (i == zespol.zespol.length) {
                    console.log("Mamy taki zespół!");
                    console.log(zespol.zespol.length);
                    arrayZespolyDouble.push(zespol._id);
                    flag = true;
                    //moze sie zdarzyc,ze bd kilka zespołów o tych samym składzie,więc dajmy je do tablicy!
                }
            }
        });
        if(flag==true){
            Session.setPersistent("zespolRealizacyjnyDouble", arrayZespolyDouble);
            $("#decyzjaModalId").modal("show");
        }

        else {//to znaczy,ze normalnie mnie dodają do bazy
            //komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego.Mamy już komplet';
            $("#addNazwa").modal("show");

            GlobalNotification.success({
                title: 'Sukces',
                content: komunikat,
                duration: 3 // duration the notification should stay in seconds
            });
            return true;
        }
    }
    else{
        var text = null;
        if (numberOfCzlonkowie == 0)
            text = ' członków';
        else
            text = ' członka';
        var komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego. Potrzeba jeszcze ' + numberOfCzlonkowie + text;

        zespolToUpdate.push(idUser);
        Meteor.call('updateCzlonkowieZR', zespolId, zespolToUpdate, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else{
                GlobalNotification.success({
                    title: 'Sukces',
                    content: komunikat,
                    duration: 3 // duration the notification should stay in seconds
                });
                return true;
            }
        });

    }


};
bladNotification=function(){
    GlobalNotification.error({
        title: 'Błąd',
        content: 'Wystąpił błąd.',
        duration: 3 // duration the notification should stay in seconds
    });
};

isUserInZRNotification=function(idZespolu){
    var zespol=ZespolRealizacyjny.findOne({_id:idZespolu});
    console.log(zespol._id);
    if(zespol) {
        if (!_.contains(zespol.zespol, Meteor.userId())) {
            GlobalNotification.error({
                title: 'Uwaga',
                content: 'Niestety, decyzję o realizowaniu tej Kwestii może podjąć jedynie członek zespołu. Poproś jednego z nich, aby przyjął realizację, wybierz inny Zespół, lub stwórz nowy. ',
                duration: 5 // duration the notification should stay in seconds
            });
            return true;
        }
        else return false;
    }
    return false;
};

addCzlonekToZespolRealizacyjnyNotificationNew=function(idUser,zespolToUpdate,numberOfCzlonkowie,zespolId){

    if(zespolToUpdate.length==2) {
        //sprawdzam czy mamy taki zespol z idącym kolejnym członkiem,szukamy w ZR
        zespolToUpdate.push(idUser);

        var flag=false;
        var arrayZespolyDouble=[];
        var zespoly=ZespolRealizacyjny.find({czyAktywny:true});
        if(zespoly){
            zespoly.forEach(function(zespol) {
                var i = 0;
                _.each(zespol.zespol, function (zespolItem) {//dla kazdej aktualnego item z aktualnego zepsolu
                    console.log("czlonek zespolu");
                    console.log(zespolItem);

                    if (_.contains(zespolToUpdate, zespolItem)) {//jezeli z bazy tablica zawiera ten z zespołu
                        i++;
                        console.log("Jest już nr: " + i);
                        console.log(zespol);
                    }
                });
                if (i == zespol.zespol.length) {
                    console.log("Mamy taki zespół!");
                    console.log(zespol.zespol.length);
                    arrayZespolyDouble.push(zespol._id);
                    flag = true;
                    //moze sie zdarzyc,ze bd kilka zespołów o tych samym składzie,więc dajmy je do tablicy!
                }
            });
        }

        if(flag==true){//są takowe, więc wyświtlamy
            Session.setPersistent("zespolRealizacyjnyDouble", arrayZespolyDouble);
            $("#decyzjaModalId").modal("show");
        }
        //nie ma tekiego w bazie,więc sobie uzupelniamy drafta.to finish
        else {
            //komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego.Mamy już komplet';
            $("#addNazwa").modal("show");

            GlobalNotification.success({
                title: 'Sukces',
                content: komunikat,
                duration: 3 // duration the notification should stay in seconds
            });
            return true;
        }
    }
    else{
        var text = null;
        if (numberOfCzlonkowie == 0 || numberOfCzlonkowie==2)
            text = ' członków';
        else
            text = ' członka';
        var komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego. Potrzeba jeszcze ' + numberOfCzlonkowie + text;

        zespolToUpdate.push(idUser);
        Meteor.call('updateCzlonkowieZRDraft', zespolId, zespolToUpdate, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else{
                GlobalNotification.success({
                    title: 'Sukces',
                    content: komunikat,
                    duration: 3 // duration the notification should stay in seconds
                });
                return true;
            }
        });

    }


};
