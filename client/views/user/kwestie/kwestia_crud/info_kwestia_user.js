Template.informacjeKwestia.rendered = function () {
    var self = Template.instance();
    var currentKwestiaId = Session.get("idKwestia");
    var tabOfUsersVoted = [];
    tabOfUsersVoted = getAllUsersWhoVoted(currentKwestiaId);
    if (_.contains(tabOfUsersVoted, Meteor.userId())) {
        self.ifUserVoted.set(true);
    }
    else {
        self.ifUserVoted.set(false);
    }
};
Template.informacjeKwestia.created = function () {
    this.ifUserVoted = new ReactiveVar();
};
Template.informacjeKwestia.events({
    'click #wyczyscPriorytety': function(){
        var me = Meteor.userId();
        console.log(me);

        var kwestie = Kwestia.find({'glosujacy.idUser': me}).fetch()
        console.log(kwestie);
    },
    'click #dyskusja': function (e) {
        var id = document.getElementById("dyskusja").name;
        Router.go('dyskusjaKwestia', {_id: id})
    },
    'click .btn-success': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click #backToList': function (e) {
        Router.go('listKwestia');
    },
    'click #addOptionButton': function () {
        console.log(Session.get("idKwestia"));
        Router.go("addKwestiaOpcja");
    },
    'click #doArchiwum': function (e) {
        e.preventDefault();
        var idKw = this._id;
        var z = Posts.findOne({idKwestia: idKw, postType: "archiwum"});
        if (z) {
            $('html, body').animate({
                scrollTop: $(".doArchiwumClass").offset().top
            }, 600);
        }
        else {
            $("#uzasadnijWyborArchiwum").modal("show");
        }
    },
    'click #doKosza': function (e) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $("#dyskusja").offset().top
        }, 600);

        var message = "Proponuję przenieść tę kwestię do Kosza? Dyskusja i siła priorytetu w tym wątku o tym zdecyduje.";
        var idKwestia = Session.get("idKwestia");
        var idUser = Meteor.userId();
        var addDate = new Date();
        var isParent = true;
        var idParent = null;
        var czyAktywny = true;
        var userFullName = Meteor.user().profile.fullName;
        var ratingValue = 0;
        var glosujacy = [];
        var postType = POSTS_TYPES.KOSZ;

        var post = [{
            idKwestia: idKwestia,
            wiadomosc: message,
            idUser: idUser,
            userFullName: userFullName,
            addDate: addDate,
            isParent: isParent,
            idParent: idParent,
            czyAktywny: czyAktywny,
            idParent: idParent,
            wartoscPriorytetu: ratingValue,
            glosujacy: glosujacy,
            postType: postType
        }]
        if (isNotEmpty(post[0].idKwestia, '') && isNotEmpty(post[0].wiadomosc, 'komentarz') && isNotEmpty(post[0].idUser, '') &&
            isNotEmpty(post[0].addDate.toString(), '') && isNotEmpty(post[0].czyAktywny.toString(), '') &&
            isNotEmpty(post[0].userFullName, '' && isNotEmpty(post[0].isParent.toString(), ''))) {

            Meteor.call('addPost', post, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                } else {
                    document.getElementById("message").value = "";
                }
            });
        }
        else {
            $("#uzasadnijWyborKosz").modal("show");
        }
    },
    'click #priorytetButton': function (e) {
        var aktualnaKwestiaId = Session.set("idK", this._id);
        var u = Meteor.userId();
        var ratingValue = parseInt(e.target.value);
        var ratingKwestiaId = this._id;
        console.log("AKTUALNA KWESTIA ID")
        console.log(ratingKwestiaId);
        var kwestia = Kwestia.findOne({_id: ratingKwestiaId});
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var glosujacy = [];
        var glosujacy = kwestia.glosujacy;
        var glosujacyTab = kwestia.glosujacy.slice();
        var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
        var object = {
            idUser: Meteor.userId(),
            value: ratingValue
        }
        var flag = false;
        for (var i = 0; i < kwestieOpcje.length; i++) {
            console.log("OPCJE")
            console.log(kwestieOpcje[i]);
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                console.log("GLOSUJACY[j]");
                console.log(kwestieOpcje[i].glosujacy[j]);
                var user = kwestieOpcje[i].glosujacy[j].idUser;
                console.log("USER idUser");
                console.log(user)
                var oddanyGlos = kwestieOpcje[i].glosujacy[j].value;
                if (user == Meteor.userId()) {
                    if (oddanyGlos == ratingValue) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i].idUser === Meteor.userId()) {
                flag = false;
                if (kwestia.glosujacy[i].value === ratingValue) {
                    throwError("Nadałeś już priorytet o tej wadze w tym poście!");
                    return false;
                } else {
                    wartoscPriorytetu -= glosujacyTab[i].value;
                    glosujacyTab[i].value = ratingValue;
                    wartoscPriorytetu += glosujacyTab[i].value;
                }
            }
            else {
                glosujacyTab.push(object);
                wartoscPriorytetu += ratingValue;
            }
        }
        if (glosujacy.length == 0) {
            glosujacyTab.push(object);
            wartoscPriorytetu += ratingValue;
        }
        var kwestiaUpdate = [{
            wartoscPriorytetu: wartoscPriorytetu,
            glosujacy: glosujacyTab
        }];
        var self = Template.instance();
        Meteor.call('updateKwestiaRating', ratingKwestiaId, kwestiaUpdate, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            }
            else {
                if (self.ifUserVoted.get() == false) {
                    var newValue = 0;
                    var pktAddPriorytet = Parametr.findOne({});
                    newValue = Number(pktAddPriorytet.pktNadaniePriorytetu) + getUserRadkingValue(Meteor.userId());
                    var kw = Kwestia.findOne({_id: Session.get("idK")});
                    var kwestiaOwner = kw.idUser;
                    if (kwestiaOwner == Meteor.userId()) {//jezeli nadajacy priorytet jest tym,który utworzył kwestię
                        newValue += ratingValue;
                    }
                    else {
                        var newValueOwner = 0;
                        newValueOwner = Number(ratingValue) + getUserRadkingValue(kwestiaOwner);

                        Meteor.call('updateUserRanking', kwestiaOwner, newValueOwner, function (error) {
                            if (error) {
                                if (typeof Errors === "undefined")
                                    Log.error('Error: ' + error.reason);
                                else {
                                    throwError(error.reason);
                                }
                            }
                        });
                    }
                    Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                        if (error) {
                            if (typeof Errors === "undefined")
                                Log.error('Error: ' + error.reason);
                            else {
                                throwError(error.reason);
                            }
                        }
                        else {
                            self.ifUserVoted.set(true);
                        }
                    });
                }
                else {
                    console.log("Użytkownik nadał już priorytet -> nie doliczamy mu rankingu");
                }
            }
        });
    }
    //'click #priorytetButton': function (e) {
    //    var u = Meteor.userId();
    //    // button, ktory zostal klikniety
    //    var ratingValue = parseInt(e.target.value);
    //    // id kwestii, na ktora chcemy zaglosowac
    //    var ratingKwestiaId = this._id;
    //    // kwestia, na ktora chcemy zaglosowac
    //    var kwestia = Kwestia.findOne({_id: ratingKwestiaId});
    //    var parent = this.idParent;
    //    // wszystkie kwestie opcje
    //    var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
    //    var glosujacy = kwestia.glosujacy;
    //    var glosujacyTab = kwestia.glosujacy.slice();
    //    var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
    //    var object = {
    //        idUser: Meteor.userId(),
    //        value: ratingValue
    //    }
    //    var flag = false;
    //    for (var i = 0; i < kwestieOpcje.length; i++) {
    //        for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
    //            var user = kwestieOpcje[i].glosujacy[j].idUser;
    //            var oddanyGlos = kwestieOpcje[i].glosujacy[j].value;
    //            if (user == Meteor.userId()) {
    //                if (oddanyGlos == ratingValue) {
    //                    throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
    //                    return false;
    //                }
    //            }
    //        }
    //    }
    //    for (var i = 0; i < kwestia.glosujacy.length; i++) {
    //        var usr = kwestia.glosujacy[i].idUser;
    //        if (usr == Meteor.userId()) {
    //            console.log("@@@ WCHODZE TU JAK JUZ ODDALAM GLOS NA TA KWESTIE")
    //            flag = false;
    //            if (kwestia.glosujacy[i].value === ratingValue) {
    //                console.log("### WCHODZE TU JAK ODDALAM TAKI SAM GLOS NA TA KWESTIE")
    //                throwError("Nadałeś już priorytet o tej wadze w tym poście!");
    //                return false;
    //            } else {
    //                console.log("$$$ WCHODZE TU JAK ODDALAM JUZ GLOS NA TA KWESTIE, CHCĘ DAC INNY PRIORYTET")
    //                wartoscPriorytetu -= glosujacyTab[i].value;
    //                glosujacyTab[i].value = ratingValue;
    //                var roznica = ratingValue - glosujacyTab[i].value;
    //                if(roznica>0){
    //                    wartoscPriorytetu += roznica;
    //                }
    //                else{
    //                    wartoscPriorytetu -= roznica;
    //                }
    //            }
    //        }
    //        else {
    //            console.log("%%% WCHODZE TU JESLI NIE ODDALAM GLOSU NA TA KWESTIE")
    //            flag = true;
    //            console.log(glosujacyTab)
    //            console.log(object)
    //            glosujacyTab.push(object);
    //            wartoscPriorytetu += ratingValue;
    //        }
    //    }
    //    if (glosujacy.length == 0) {
    //        console.log("&&& WCHODZE TU JAK NIKT JESZCZE NIE ZAGLOSOWAL NA TA KWESTIE")
    //        glosujacyTab.push(object);
    //        wartoscPriorytetu += ratingValue;
    //    }
    //    var kwestiaUpdate = [{
    //        wartoscPriorytetu: wartoscPriorytetu,
    //        glosujacy: glosujacyTab
    //    }];
    //
    //    var self = Template.instance();
    //    Meteor.call('updateKwestiaRating', ratingKwestiaId, kwestiaUpdate, function (error, ret) {
    //        if (error) {
    //            if (typeof Errors === "undefined")
    //                Log.error('Error: ' + error.reason);
    //            else
    //                throwError(error.reason);
    //        }
    //        else {
    //            if (self.ifUserVoted.get() == false) {
    //                var newValue = 0;
    //                var pktAddPriorytet = Parametr.findOne({});
    //                newValue = Number(pktAddPriorytet.pktNadaniePriorytetu) + getUserRadkingValue(Meteor.userId());
    //
    //                var kwestiaOwner = Kwestia.findOne({_id: Session.get("idKwestia")}).idUser;
    //                if (kwestiaOwner == Meteor.userId()) {//jezeli nadajacy priorytet jest tym,który utworzył kwestię
    //                    newValue += ratingValue;
    //                }
    //                else {
    //                    var newValueOwner = 0;
    //                    newValueOwner = Number(ratingValue) + getUserRadkingValue(kwestiaOwner);
    //
    //                    Meteor.call('updateUserRanking', kwestiaOwner, newValueOwner, function (error) {
    //                        if (error) {
    //                            if (typeof Errors === "undefined")
    //                                Log.error('Error: ' + error.reason);
    //                            else {
    //                                throwError(error.reason);
    //                            }
    //                        }
    //                    });
    //                }
    //                Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
    //                    if (error) {
    //                        if (typeof Errors === "undefined")
    //                            Log.error('Error: ' + error.reason);
    //                        else {
    //                            throwError(error.reason);
    //                        }
    //                    }
    //                    else {
    //                        self.ifUserVoted.set(true);
    //                    }
    //                });
    //            }
    //            else {
    //                console.log("Użytkownik nadał już priorytet -> nie doliczamy mu rankingu");
    //            }
    //        }
    //    });
    //}
});
Template.informacjeKwestia.helpers({
    kwestiaOpcjaCount: function(){
        var ile = Kwestia.find({idParent: this.idParent}).count();
        if(ile == 10) return false;
        else return true;
    },
    ifHasOpcje: function () {
        var kwestiaGlownaId = this._id;
        var k = Kwestia.find({idParent: kwestiaGlownaId, isOption: true}).fetch();
        if (k) return true;
        else return false;
    },
    isAdmin: function () {
        if (Meteor.user().roles) {
            if (Meteor.user().roles == "admin")
                return true;
            else
                return false;
        }
        else return false;
    },
    //opcje: function () {
    //    var kwestiaGlownaId = Session.get("idKwestia");
    //    var op = Kwestia.find({idParent: kwestiaGlownaId}).fetch();
    //    if (op) return true;
    //    else return false;
    //},
    czyOpcja: function () {
        if (this.isOption) return true;
        else return false;
    },
    thisKwestia: function () {
        var kw = Kwestia.findOne({_id: this._id});
        if(kw.isOption){
            Session.set("idKwestia",kw.idParent);
        }
        else{
            Session.set("idKwestia", this._id)
        }
    },
    mojPiorytet: function () {
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        if (kwestia) {
            var g = kwestia.glosujacy;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser) {
                    return g[i].value;
                }
            }
        }
    },
    mojPriorytetZero: function () {
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        if (kwestia) {
            var g = kwestia.glosujacy;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser && g[i].value == 0)
                    return true;
                else return false;
            }
        }
    },
    glosujacyCount: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        if (tab) {
            var liczba = tab.glosujacy.length;
            return liczba;
        }
    },
    srednia: function () {
        var s = this.sredniaPriorytet;
        if (s) {
            var ss = s.toFixed(2);
            return ss;
        }
    },
    nazwa: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        if (tab) return tab;
    },
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    },
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format("DD-MM-YYYY, HH:mm");
    },
    dateG: function () {
        var d = this.dataGlosowania;
        if (d) return moment(d).format("DD-MM-YYYY, HH:mm");
    },
    dataGlosowaniaObliczana: function () {
        var dataG = this.dataGlosowania;
        var rodzajId = this.idRodzaj;
        var r = Rodzaj.findOne({_id: this.idRodzaj});
        if (r) {
            var czasGlRodzaj = r.czasGlosowania;
            var k = moment(dataG).subtract(czasGlRodzaj, 'h').format("DD-MM-YYYY, HH:mm");
            return k;
        }
    },
    'isIssueSuspended': function (id) {
        return KwestiaSuspended.find({idKwestia: id, czyAktywny: true}).count() <= 0 ? false : true;
    },
    'getIssueSuspended': function (id) {
        return KwestiaSuspended.findOne({idKwestia: id, czyAktywny: true});
    }
});
