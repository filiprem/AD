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
addCzlonekToZespolRealizacyjnyNotification=function(idUser,zespolToUpdate,numberOfCzlonkowie){
    //var czlonek = {
    //    idUser: idUser
    //};
    //zespolToUpdate.push(czlonek);
    zespolToUpdate.push(idUser);
    var id = ZespolRealizacyjny.update(zespolId,
        {
            $set: {
                zespol: zespolToUpdate
            }
        });
    if (id) {
        var text=null;
        if(numberOfCzlonkowie==2 || numberOfCzlonkowie==0)
            text=' członków';
        else
            text=' członka';
        var komunikat=null;
        if(numberOfCzlonkowie==0) {
            komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego.Mamy już komplet';
            $("#addNazwa").modal("show");
        }
        else
            komunikat='Zostałeś dodany do Zespołu Realizacyjnego. Potrzeba jeszcze '+numberOfCzlonkowie +text;

        GlobalNotification.success({
            title: 'Sukces',
            content: komunikat,
            duration: 3 // duration the notification should stay in seconds
        });
        return true;
    }
    else
        return false;
};
bladNotification=function(){
    GlobalNotification.error({
        title: 'Błąd',
        content: 'Wystąpił błąd.',
        duration: 3 // duration the notification should stay in seconds
    });
};