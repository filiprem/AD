isUserInZespolRealizacyjnyNotification=function(id,zespolTab){
    console.log("tablica");
    console.log(zespolTab);

    //var tab= _.pluck(zespolTab,'idUser');
    //console.log(tab);
    if(_.contains(zespolTab,id)){
        //if(_.contains(tab,id)){
        GlobalNotification.error({
            title: 'B��d',
            content: 'Jeste� ju� w ZR.',
            duration: 3 // duration the notification should stay in seconds
        });
        return true;
    }
    else
        return false;
};
isUserCountInZespolRealizacyjnyNotification=function(id,zespolTab,numberOfCzlonkowie){
    if(zespolTab.length==3) {
        var komunikat='Jest ju� '+numberOfCzlonkowie+' cz�onk�w ZR';
        GlobalNotification.error({
            title: 'B��d',
            content: komunikat,
            duration: 3 // duration the notification should stay in seconds
        });
        return true;
    }
    return false;
};
addCzlonekToZespolRealizacyjnyNotification=function(idUser,zespolToUpdate,numberOfCzlonkowie,zespolId){

    if(zespolToUpdate.length==2) {
        //sprawdzam czy mamy taki zespol z id�cym kolejnym cz�onkiem
        zespolToUpdate.push(idUser);
        ///////wszystkie kwestie glosowane,czyli ZR si� nie zmieni.jezeli jest glosowana,to wiadome,�e ZR b�dzie ==3, a mojej nie bedzie,bo nie jest g�osowana!
        var kwestie = Kwestia.find({
            $where: function () {
                return (this.status==KWESTIA_STATUS.GLOSOWANA || this.status==KWESTIA_STATUS.REALIZOWANA);
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

                    if (_.contains(zespolToUpdate, zespolItem)) {//jezeli z bazy tablica zawiera ten z zespo�u
                        i++;
                        console.log("Jest ju� nr: " + i);
                        console.log(zespol);
                    }
                });
                if (i == zespol.zespol.length) {
                    console.log("Mamy taki zesp�!");
                    console.log(zespol.zespol.length);
                    arrayZespolyDouble.push(zespol._id);
                    flag = true;
                    //moze sie zdarzyc,ze bd kilka zespo��w o tych samym sk�adzie,wi�c dajmy je do tablicy!
                }
            }
        });
        if(flag==true){
            Session.setPersistent("zespolRealizacyjnyDouble", arrayZespolyDouble);
            $("#decyzjaModalId").modal("show");
        }

        else {//to znaczy,ze normalnie mnie dodaj� do bazy
            //komunikat = 'Zosta�e� dodany do Zespo�u Realizacyjnego.Mamy ju� komplet';
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
            text = ' cz�onk�w';
        else
            text = ' cz�onka';
        var komunikat = 'Zosta�e� dodany do Zespo�u Realizacyjnego. Potrzeba jeszcze ' + numberOfCzlonkowie + text;

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
        title: 'B��d',
        content: 'Wyst�pi� b��d.',
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
                content: 'Niestety, decyzj� o realizowaniu tej Kwestii mo�e podj�� jedynie cz�onek zespo�u. Popro� jednego z nich, aby przyj�� realizacj�, wybierz inny Zesp�, lub stw�rz nowy. ',
                duration: 5 // duration the notification should stay in seconds
            });
            return true;
        }
        else return false;
    }
    return false;
};

