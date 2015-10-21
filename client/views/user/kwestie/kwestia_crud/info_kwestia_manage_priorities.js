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
        var flag = false;
        var kwestie = Kwestia.find({czyAktywny: true, 'glosujacy.idUser': Meteor.userId(), idParent: idKwestia}).fetch();
        kwestie.forEach(function (kwestia) {
            var array = [];
            var tabGlosujacych = glosujacy;
            for (var j = 0; j < tabGlosujacych.length; j++) {
                if (tabGlosujacych[j].idUser == Meteor.userId()) {
                    if (tabGlosujacych[j].value == number) {
                        flag = true;
                    }
                }
            }
        });
        return flag ? "disabled" : "";
    },
    isUserOrDoradcaLogged: function () {
        if (!Meteor.userId())
            return "disabled";
        var user = Users.findOne({_id: Meteor.userId()});
        if (user) {
            return user.profile.userType!= USERTYPE.CZLONEK ? "disabled" : "";
        }
        return "";
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
        var kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: parent}).fetch();
        var glosujacy = [];
        var glosujacy = kwestia.glosujacy;
        var glosujacyTab = kwestia.glosujacy.slice();
        var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
        var object = {
            idUser: Meteor.userId(),
            value: ratingValue
        };
        var flag = false;
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