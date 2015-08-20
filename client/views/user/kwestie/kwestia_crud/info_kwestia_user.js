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
        var currentKwestiaId = Session.get("idKwestia");
        var kwestie = Kwestia.find({'glosujacy.idUser': me,idParent:currentKwestiaId }).fetch()
        console.log(Kwestia.find({'glosujacy.idUser': me,idParent:currentKwestiaId }).count());
        if(Kwestia.find({'glosujacy.idUser': me,idParent:currentKwestiaId }).count()==0){
            throwError("Nie nadałeś priorytetu tej kwestii, ani jej opcjom");
            //sprawdzić czy sa zzero->jak zero,to tez nie updatujemy na darmo!
        }
        else {
            bootbox.dialog({
                title:"Potwierdzenie",
                message:"Czy napewno chcesz zresetować nadane priorytety we wszystkich Opcjach tej Kwestii?",
                buttons:{
                    success: {
                        label: "Potwierdź",
                        className: "btn-success",
                        callback: function () {
                            kwestie.forEach(function (kwestia) {
                                console.log("id kwestii " + kwestia._id);
                                var array = [];
                                var tabGlosujacych = kwestia.glosujacy;
                                console.log("Liczba glosujacych :" + tabGlosujacych.length);
                                for (var j = 0; j < tabGlosujacych.length; j++) {
                                    var idUser = tabGlosujacych[j].idUser;
                                    var value = 0;
                                    if (tabGlosujacych[j].idUser == me) {
                                        value = 0;
                                    }
                                    else {
                                        value = tabGlosujacych[j].value;
                                    }
                                    var glosujacy = {
                                        idUser: idUser,
                                        value: value
                                    };
                                    array.push(glosujacy);
                                }
                                console.log("tablica");
                                console.log(array.length);
                                console.log(array);
                                Meteor.call('clearPriorytet', kwestia._id, array, function (error, ret) {
                                    if (error) {
                                        if (typeof Errors === "undefined")
                                            Log.error('Error: ' + error.reason);
                                        else
                                            throwError(error.reason);
                                    }
                                });
                            });
                        }
                    },
                    danger:{
                        label:"Anuluj",
                        className:"btn-danger"
                    }
                }
            });
        }
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
        console.log("Rating value"+ ratingValue);
        var ratingKwestiaId = this._id;
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
        for (var i = 0; i < kwestieOpcje.length; i++) {//dla kwestii opcji
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {//przechodizmy po kazdych użytkownikach,ktory zagloswoali
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
            }//bo tu whochodzilo tez jak był nowy
            else {
                console.log("Analizowany jest inny");
            }
        }//zmiana
        if (glosujacy.length == 0 || !_.contains(getAllUsersWhoVoted(ratingKwestiaId),Meteor.userId())) {
            console.log("Pierwszy użytkownik");
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
                    console.log("Użytkownik jeszcze nie głosował");
                    var newValue = 0;
                    var pktAddPriorytet = Parametr.findOne({});
                    newValue = Number(pktAddPriorytet.pktNadaniePriorytetu) + getUserRadkingValue(Meteor.userId());
                    console.log("Nadanie priorytetu: "+Number(pktAddPriorytet.pktNadaniePriorytetu));
                    console.log("Aktualnie ma pkt: "+getUserRadkingValue(Meteor.userId()));
                    var kw = Kwestia.findOne({_id: Session.get("idK")});
                    var kwestiaOwner = kw.idUser;
                    if (kwestiaOwner == Meteor.userId()) {//jezeli nadajacy priorytet jest tym,który utworzył kwestię
                        newValue += ratingValue;
                    }
                    else {
                        var newValueOwner = 0;
                        newValueOwner = Number(ratingValue) + getUserRadkingValue(kwestiaOwner);
                        console.log("Nowa wartosc: "+newValueOwner);
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
    }});
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
    isSelected: function( number) {
        console.log("Jestem tu");
        var flag=false;
        var currentKwestiaId = Session.get("idKwestia");
        var kwestie = Kwestia.find({'glosujacy.idUser': Meteor.userId(),idParent:currentKwestiaId }).fetch();
        var globalArray=[];
        kwestie.forEach(function (kwestia) {
            console.log("id kwestii " + kwestia._id);
            console.log("BLOCZEK NR "+number);
            var array = [];
            var tabGlosujacych = kwestia.glosujacy;
            console.log("Liczba glosujacych :" + tabGlosujacych.length);
            for (var j = 0; j < tabGlosujacych.length; j++) {
                if(tabGlosujacych[j].idUser==Meteor.userId()){
                    console.log("Value: "+tabGlosujacych[j].value);
                    console.log("Number: "+number);
                    if(tabGlosujacych[j].value==number){
                        console.log("DISABLED!");
                        //return "disabled";
                        //globalArray.push(value)
                        flag=true;
                    }
                }

            }
            console.log("-----------------------------------------------------");
        });
        if(flag==true)
            return "disabled";
        else
            return "";
    }
});
