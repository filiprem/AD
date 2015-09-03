getUpdateKwestiaRatingObject = function (ratingValue, object) {
    var glosujacyTab = object.glosujacy.slice();
    var wartoscPriorytetu = parseInt(object.wartoscPriorytetu);

    _.each(object.glosujacy, function (item) {
        if (item.idUser === Meteor.userId()) {
            wartoscPriorytetu -= item.value;
            glosujacyTab[object.glosujacy.indexOf(item)].value = ratingValue;
            wartoscPriorytetu += ratingValue;
        }
    });

    var kwestiaUpdate = [{
        wartoscPriorytetu: wartoscPriorytetu,
        glosujacy: glosujacyTab
    }];

    return kwestiaUpdate;
};

getOldValueOfUserVote = function (ratingValue, object) {
    var oldValue = 0;
    _.each(object.glosujacy, function (item) {
        if (item.idUser === Meteor.userId())
            oldValue = item.value;
    });
    return oldValue;
};
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
        var zespoly = ZespolRealizacyjny.find({
            $where: function () {
                return (this.nazwa.trim() != null && this.zespol.length >= 3)
            }
        });
        console.log(zespoly.count());
        var flag = false;
        var foundZespolId = false;

        zespoly.forEach(function (zespol) {//dla każdego zespołu z bazy
            console.log(zespol);
            var i = -1;
            _.each(zespolToUpdate, function (zespolListItem) {//dla kazdej aktualnego item z aktualnego zepsolu
                console.log("zespół to update");
                console.log(zespolListItem);

                if (_.contains(zespol.zespol, zespolListItem)) {//jezeli z bazy tablica zawiera ten z zespołu
                    i++;
                    console.log("Jest już nr: " + i);
                    console.log(zespol);
                }
            });
            if (i = zespol.zespol.length) {
                console.log("Mamy taki zespół!");
                console.log(zespol);
                foundZespolId = zespol._id;
                flag = true;
                //moze sie zdarzyc,ze bd kilka zespołów o tych samym składzie,więc dajmy je do tablicy!
            }
        });
        if (flag == true) {
            //zrób modala z istniejącą nazwą
            Session.setPersistent("zespolRealizacyjnyDouble", foundZespolId);
            $("#listZespolRealizacyjnyDouble").modal("show");
        }
        else {

            //to przenieść id gdy zamknę modala!
            var id = ZespolRealizacyjny.update(zespolId,
                {
                    $set: {
                        zespol: zespolToUpdate
                    }
                });
            var text = null;
            if (numberOfCzlonkowie == 2 || numberOfCzlonkowie == 0)
                text = ' członków';
            else
                text = ' członka';
            var komunikat = null;
            if (numberOfCzlonkowie == 0) {
                komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego.Mamy już komplet';
                $("#addNazwa").modal("show");
            }
            else
                komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego. Potrzeba jeszcze ' + numberOfCzlonkowie + text;

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
        if (numberOfCzlonkowie == 2 || numberOfCzlonkowie == 0)
            text = ' członków';
        else
            text = ' członka';
        var komunikat = null;
        if (numberOfCzlonkowie == 0) {
            komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego.Mamy już komplet';
            $("#addNazwa").modal("show");
        }
        else
            komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego. Potrzeba jeszcze ' + numberOfCzlonkowie + text;

        GlobalNotification.success({
            title: 'Sukces',
            content: komunikat,
            duration: 3 // duration the notification should stay in seconds
        });
        return true;
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