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
    isSelected: function (number,idKwestia,glosujacy) {
        if (!Meteor.userId())
            return "disabled";
        var user = Users.findOne({_id: Meteor.userId()});
        if (user) {
            if (user.profile.userType != USERTYPE.CZLONEK)
                return "disabled";
        }
        var kwestia=Kwestia.findOne({_id:idKwestia});
        if(kwestia.status==KWESTIA_STATUS.ZREALIZOWANA)
            return "disabled";
        var flag = false;
        if(kwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)//for GLobalPARAM->No KWESTIA OPCJE
            var kwestie = Kwestia.find({
                czyAktywny: true,
                'glosujacy.idUser': Meteor.userId()
            });
        else
            var kwestie = Kwestia.find({
                czyAktywny: true,
                'glosujacy.idUser': Meteor.userId(),
                idParent: idKwestia
            });
        console.log("te kwestie");
        console.log(kwestie.count());
        console.log(glosujacy);
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
            //for (var j = 0; j < tabGlosujacych.length; j++) {
            //    if (tabGlosujacych[j].idUser == Meteor.userId()) {
            //        if (tabGlosujacych[j].value == number) {
            //            flag = true;
            //        }
            //    }
            //}
            //var me= _.findWhere(kwestiaItem.glosujacy, {'idUser': Meteor.userId()});
            //if(me) {
            //    console.log("znalezione!");
            //    console.log(me);
            //}
        });
        return flag==true ? "disabled" : "";
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
        return czyAktywny==false || status==KWESTIA_STATUS.ZREALIZOWANA || status==KWESTIA_STATUS.ARCHIWALNA ? true: false;
    }
});

Template.managePriorities.events({
    'click #priorytetButton': function (e) {
        var aktualnaKwestiaId = Session.set("idK", this._id);
        var u = Meteor.userId();
        var ratingValue = parseInt(e.target.value);
        var ratingKwestiaId = e.target.name;
        var kwestia = Kwestia.findOne({_id: ratingKwestiaId});
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: parent});
        var glosujacy = [];
        var glosujacy = kwestia.glosujacy;
        var glosujacyTab = kwestia.glosujacy.slice();
        var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
        var object = {
            idUser: Meteor.userId(),
            value: ratingValue
        };
        var flag = false;
        if(kwestieOpcje.count()>0) {
            for (var i = 0; i < kwestieOpcje.length; i++) {//dla kwestii opcji- z trgo chyba juz nie korzystamy!!
                console.log("dla opcjii");
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
        //if(kwestia.glosujacy.length==0){
        //    console.log("pierwsz raz");
        //    wartoscPriorytetu += ratingValue;
        //    glosujacyTab.push(object);
        //}
        //else {
            for (var i = 0; i < kwestia.glosujacy.length; i++) {
                if (kwestia.glosujacy[i].idUser === Meteor.userId()) {
                    flag = false;
                    oldValue = glosujacyTab[i].value;
                    wartoscPriorytetu -= glosujacyTab[i].value;
                    glosujacyTab[i].value = ratingValue;
                    wartoscPriorytetu += glosujacyTab[i].value;
                }
            }
       // }

        var kwestiaUpdate = [{
            wartoscPriorytetu: wartoscPriorytetu,
            glosujacy: glosujacyTab
        }];
        console.log(kwestiaUpdate);
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
                    }else{
                        var komunikat= "Nadanie priorytetu "+ratingValue;
                        Notifications.success("",komunikat, {timeout:3000});
                    }
                });
            }
        });
    }
});