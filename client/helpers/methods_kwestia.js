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
    console.log("bedziemy przepisywac zespoly");
    console.log("id kwestii: "+idKwestia);
    console.log("powolany id zr: "+idAktualnyZR);
    var kwestia = Kwestia.findOne({_id: idKwestia});
    if (kwestia) {
        var zespolWybrany = ZespolRealizacyjny.findOne({_id: idAktualnyZR});
        console.log(zespolWybrany);
        if (zespolWybrany) {
            var myZR = ZespolRealizacyjnyDraft.findOne({_id: kwestia.idZespolRealizacyjny});
            if (myZR) {
                var myNewZR = {
                    nazwa: zespolWybrany.nazwa,
                    zespol: zespolWybrany.zespol,
                    idZR:idAktualnyZR
                };
                Meteor.call('updateZespolRealizacyjnyDraft', myZR._id, myNewZR, function (error, ret) {
                    if (error) {
                        //if (typeof Errors === "undefined")
                        //    Log.error('Error: ' + error.reason);
                        //else {
                        //    throwError(error.reason);
                        //}
                        console.log(error.reason);
                    }
                    else {
                        console.log("moje id zwrócone");
                        console.log(ret);
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
    if(kwestia){
        return kwestia.status==KWESTIA_STATUS.GLOSOWANA ? "disabled" :"";
    }
    return "";
};
setInQueueToVoteMethod=function(kwestie){
    var tab=[];
    var tabKwestie = [];
    kwestie.forEach(function (item) {
        tabKwestie.push(item);
    });
    //console.log("array with the same priority");
    var arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[0].wartoscPriorytetu});
    //console.log(arrayTheSameWartoscPrior.length);
    if (arrayTheSameWartoscPrior.length >= 3) {
        //console.log("the same priority as first:>=3");
        var tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
        tab.push(tabKwestieSort[0]._id);
        tab.push(tabKwestieSort[1]._id);
        tab.push(tabKwestieSort[2]._id);
    }
    else if (arrayTheSameWartoscPrior.length == 2) {
        //console.log("the same priority as first:2");
        var tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
        tab.push(tabKwestieSort[0]._id);
        tab.push(tabKwestieSort[1]._id);
        //znajdz kolejny nizszy priorytet:usun z tablicy o tamtym priorytecie i posortuj na nowo
        tabKwestie= _.reject(tabKwestie,function(el){console.log(el.wartoscPriorytetu);return el.wartoscPriorytetu==tabKwestieSort[0].wartoscPriorytetu});
        //console.log("past values");
        //console.log(tabKwestieSort[0].wartoscPriorytetu);
        //console.log(tabKwestie);
        tabKwestie =( _.sortBy(tabKwestie, "wartoscPriorytetu")).reverse();
        //console.log(tabKwestie);
        arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[0].wartoscPriorytetu});
        tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
        tab.push(tabKwestieSort[0]._id);
    }
    else {//nie powtarzaja sie
        //console.log("one priority");
        tab.push(tabKwestie[0]._id);
        //console.log(tabKwestie[1]);
        arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[1].wartoscPriorytetu});
        if (arrayTheSameWartoscPrior.length >= 2) {//jezeli 2 i 3 sie powtarzaja,to posortuj i wrzuæ
            tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
            tab.push(tabKwestieSort[0]._id);
            tab.push(tabKwestieSort[1]._id);
        }
        else{//2 i 3 sa inne
            //console.log("all are different");
            tab.push(tabKwestie[1]._id);
            tab.push(tabKwestie[2]._id);
        }
    }
    return tab;
};
rewriteZRMembersToListMethod=function(zespolRealizacyjny,newKwestia){
    var czlonkowieZespolu = [];
    _.each(zespolRealizacyjny.zespol, function (idUser) {
        var user = Users.findOne({_id: idUser});
        czlonkowieZespolu.push(user.profile.firstName + " " + user.profile.lastName);
    });
    var obj={
        nazwa:zespolRealizacyjny.nazwa,
        czlonkowie:czlonkowieZespolu
    };
    Meteor.call("addConstZR", newKwestia._id, obj, function (error) {
        if (error)
            console.log(error);
    });
};
manageZRMethod=function(newKwestia){
    var zespolRealizacyjny = ZespolRealizacyjny.findOne({_id: newKwestia.idZespolRealizacyjny});
    if (zespolRealizacyjny.kwestie.length > 0) {
        //wypisz mnie
        var kwestie = _.reject(zespolRealizacyjny.kwestie, function (kwestiaId) {
            return kwestiaId == newKwestia._id
        });
        console.log(kwestie);
        //jezeli bylem tylko ja,set false,o ile to nnie jestjest zr ds osób
        if(kwestie.length==0 && zespolRealizacyjny._id!=ZespolRealizacyjny.findOne()._id){
            Meteor.call("updateKwestieZRChangeActivity", zespolRealizacyjny._id, kwestie,false, function (error) {
                if (error)
                    console.log(error.reason);
                else
                    rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
            });
        }
        else {
            Meteor.call("updateKwestieZR", zespolRealizacyjny._id, kwestie, function (error) {
                if (error)
                    console.log(error.reason);
                else
                    rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
            });
        }
    }
    else {//jezeli nie ma zadnych kwestii,ustaw na false, o ile
        console.log("delete zespol");
        if(zespolRealizacyjny._id!=ZespolRealizacyjny.findOne()._id){
            Meteor.call('removeZespolRealizacyjny', zespolRealizacyjny._id, function (error) {
                if (error)
                    console.log(error.reason);
                else
                    rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
            });
        }
        else
            rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
    }
};



