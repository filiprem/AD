Template.managePriorities.helpers({
    priority: function (priorytet) {
        if (priorytet) {
            if (priorytet > 0) {
                priorytet = "+" + priorytet;
                return priorytet;
            }
            else return priorytet;
        }
        else return 0;
    },
    isSelected: function (number,idParent,glosujacy,status,idKwestia) {
        if (!Meteor.userId())
            return "disabled";
        var user = Users.findOne({_id: Meteor.userId()});
        if (user) {
            if (user.profile.userType != USERTYPE.CZLONEK)
                return "disabled";
        }
        var kwestia=Kwestia.findOne({_id:idKwestia});
        //var kwestia=Kwestia.findOne({_id:idParent});
        //if(kwestia){
        //if(kwestia.status==KWESTIA_STATUS.ZREALIZOWANA)
            //return "disabled";

        var flag = false;
        if(kwestia) {
            if (kwestia.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {//for GLobalPARAM->No KWESTIA OPCJE
                var kwestie = Kwestia.find({
                    czyAktywny: true,
                    'glosujacy.idUser': Meteor.userId(),
                    typ: KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE
                });
            }
            else
                var kwestie = Kwestia.find({
                    czyAktywny: true,
                    'glosujacy.idUser': Meteor.userId(),
                    idParent: idParent
                });
        }
        if(status==KWESTIA_STATUS.REALIZOWANA){//nie ma odznaczania kwestii opcji
            var kwestia=Kwestia.findOne({_id:idKwestia});
            if(kwestia) {
                //var glosujacyId = _.pluck(kwestia.glosujacyWRealizacji, 'idUser');
                var glosujacyUser = _.findWhere(kwestia.glosujacyWRealizacji, {'idUser': Meteor.userId()});
                if (glosujacyUser) {
                    if (glosujacyUser.value == number) {
                        flag = true;
                    }
                    else flag = false;
                }
                else
                    flag = false;
            }
        }
        else {
            kwestie.forEach(function (kwestiaItem) {
                var array = [];
                var tabGlosujacych = glosujacy;
                for (var j = 0; j < kwestiaItem.glosujacy.length; j++) {
                    if (kwestiaItem.glosujacy[j].idUser == Meteor.userId()) {
                        if (kwestiaItem.glosujacy[j].value == number) {
                            flag = true;
                        }
                    }
                }
            });
        }
        return flag == true ? "disabled" : "";
    },
    isUserOrDoradcaLogged: function () {
        if (!Meteor.userId())
            return "disabled";
        var user = Users.findOne({_id: Meteor.userId()});
        if (user) {
            return user.profile.userType!= USERTYPE.CZLONEK ? "disabled" : "";
        }
        return "";
    },
    koszZrealizowanaArchiwum:function(czyAktywny,status){
        return czyAktywny==false || status==KWESTIA_STATUS.ZREALIZOWANA || status==KWESTIA_STATUS.ARCHIWALNA || status==KWESTIA_STATUS.OCZEKUJACA ? true: false;
    },
    isRealizowana:function(status){
        return status==KWESTIA_STATUS.REALIZOWANA ? true: false;
    }
});

Template.managePriorities.events({
    'click #priorytetButton': function (e) {
        var aktualnaKwestiaId = Session.set("idK", this._id);
        var u = Meteor.userId();
        var ratingValue = parseInt(e.target.value);
        var ratingKwestiaId = e.target.name;
        var kwestia = Kwestia.findOne({_id: ratingKwestiaId});

        var object = {
            idUser: Meteor.userId(),
            value: ratingValue
        };
        if(kwestia.status==KWESTIA_STATUS.REALIZOWANA){
            managePriorityKwestiaRealizowana(ratingKwestiaId,kwestia,object,ratingValue);

        }
        else {
            managePriorityKwestiaDelibGlosowana(ratingKwestiaId,kwestia,object,ratingValue);

        }
    }
});
managePriorityKwestiaRealizowana=function(ratingKwestiaId,kwestia,object,ratingValue){
    var wartoscPriorytetuWRealizacji=kwestia.wartoscPriorytetuWRealizacji;
    var glosujacyWRealizacji = kwestia.glosujacyWRealizacji;
    var myGlos= _.findWhere(glosujacyWRealizacji,{'idUser':Meteor.userId()});

    if(myGlos){
        wartoscPriorytetuWRealizacji-=myGlos.value;
        wartoscPriorytetuWRealizacji+=ratingValue;
        var newGlosujacyWRealiz=_.reject(glosujacyWRealizacji,function(el){return el.idUser==Meteor.userId()});
        object.value=ratingValue;
        glosujacyWRealizacji=newGlosujacyWRealiz;
        glosujacyWRealizacji.push(object);
    }
    else{
        wartoscPriorytetuWRealizacji+=ratingValue;
        glosujacyWRealizacji.push(object);
    }
    var kwestiaUpdate = [{
        wartoscPriorytetuWRealizacji: wartoscPriorytetuWRealizacji,
        glosujacyWRealizacji: glosujacyWRealizacji
    }];
    Meteor.call('updateKwestiaWRealizacjiRating', ratingKwestiaId, kwestiaUpdate, function (error, ret) {
        if (error) {
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else
                throwError(error.reason);
        }
    });
};
managePriorityKwestiaDelibGlosowana=function(ratingKwestiaId,kwestia,object,ratingValue){
    var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
    var parent = this.idParent;
    var kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: parent});
    var glosujacyTab = kwestia.glosujacy;

    var flag = false;
    if (kwestieOpcje.count() > 0) {
        for (var i = 0; i < kwestieOpcje.length; i++) {//dla kwestii opcji- z trgo chyba juz nie korzystamy!!
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {//przechodizmy po kazdych użytkownikach,ktory zagloswoali
                var user = kwestieOpcje[i].glosujacy[j].idUser;
                var oddanyGlos = kwestieOpcje[i].glosujacy[j].value;
                if (user == Meteor.userId()) {
                    if (oddanyGlos == ratingValue) {
                        return false;
                    }
                }
            }
        }
    }
    var oldValue = 0;
    for (var i = 0; i < kwestia.glosujacy.length; i++) {
        if (kwestia.glosujacy[i].idUser === Meteor.userId()) {
            flag = false;
            oldValue = glosujacyTab[i].value;
            wartoscPriorytetu -= glosujacyTab[i].value;
            glosujacyTab[i].value = ratingValue;
            wartoscPriorytetu += glosujacyTab[i].value;
        }
    }

    var kwestiaUpdate = [{
        wartoscPriorytetu: wartoscPriorytetu,
        glosujacy: glosujacyTab
    }];
    Meteor.call('updateKwestiaRating', ratingKwestiaId, kwestiaUpdate, function (error, ret) {
        if (error) {
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else
                throwError(error.reason);
        }
        else {
            var newValue = 0;
            var kwestiaOwner = kwestia.idUser;
            newValue = ratingValue + getUserRadkingValue(kwestiaOwner) - oldValue;
            Meteor.call('updateUserRanking', kwestiaOwner, newValue, function (error) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                } else {
                    var komunikat = "Nadanie priorytetu " + ratingValue;
                    Notifications.success("", komunikat, {timeout: 3000});
                }
            });
        }
    });
};