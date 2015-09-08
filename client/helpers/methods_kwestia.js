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
powolajZRFunction=function(idKwestia,idAktualnyZR) {
    var kwestia = Kwestia.findOne({_id: idKwestia});
    if (kwestia) {
        var zespolWybrany = ZespolRealizacyjny.findOne({_id: idAktualnyZR});
        if (zespolWybrany) {
            var myZR = ZespolRealizacyjny.findOne({_id: kwestia.idZespolRealizacyjny});
            if (myZR) {
                var myNewZR = {
                    nazwa: zespolWybrany.nazwa,
                    zespol: zespolWybrany.zespol
                };
                Meteor.call('updateZespolRealizacyjny', myZR._id, myNewZR, function (error, ret) {
                    if (error) {
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else {
                            throwError(error.reason);
                        }
                    }
                    else {
                        $("#listZespolRealizacyjny").modal("hide");
                        $("#listZespolRealizacyjnyDouble").modal("hide");
                    }
                });
            }

        }
    }
};
isKwestiaGlosowana=function(idKwestia){
    var kwestia= Kwestia.findOne({_id:idKwestia});
    console.log(kwestia);
    if(kwestia){
        return kwestia.status==KWESTIA_STATUS.GLOSOWANA ? "disabled" :"";
    }
    return "";
};

