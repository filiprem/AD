Template.listKwestia.rendered = function () {
    var self = Template.instance();
    this.autorun(function () {
        var kwestie = Kwestia.find({
            $where: function () {
                return ((this.czyAktywny == true) && (this.wartoscPriorytetu > 0));
            }
        }, {sort: {wartoscPriorytetu: -1}, limit: 3});
        var tab = [];
        kwestie.forEach(function (item) {
            tab.push(item._id);
        });
        self.liczbaKwestiRV.set(tab);
    })

};
Template.listKwestia.created = function () {
    this.liczbaKwestiRV = new ReactiveVar();
};

Template.listKwestia.events({
    //edycja kwestii
    'click .glyphicon-pencil': function (event, template) {
        Session.set('kwestiaInScope', this);
        Router.go("editKwestia");
    },
    'click #addKwestiaButton': function () {
        if (!!Session.get("kwestiaPreview"))
            Session.set("kwestiaPreview", null);
        Router.go("addKwestia");
    },
    'click #clickMe': function () {
        var users = Users.find({}).fetch();
        var en = new EmailNotifications();
        en.registerAddKwestiaNotification('AD', 'Organizacja DOM', users,
            'Kwestia w sprawie...', 'Uchwała', 'Opis Kwestii....', 'linkDK', 'linkLoginTo');
    },
    'click #kwestiaIdClick': function () {//nadajemy priorytet automatycznie po wejściu na kwestię + dajemy punkty
        //za wyjątkiem ,gdy użytkownik nie jest zalogowany i nie jest doradcą

        if(Meteor.userId()==null)
            return;
        var me=Users.findOne({_id:Meteor.userId()});
        if(me){
            if(me.profile.userType=='doradca' || Meteor.user().roles == "admin")
                return;
        }

        var kwestia = Kwestia.findOne({_id: this._id});
        var tabGlosujacy = getAllUsersWhoVoted(kwestia._id);
        if (!_.contains(tabGlosujacy, Meteor.userId())) {//jeżeli użytkownik jeszcze nie głosował
            var glosujacy = {
                idUser: Meteor.userId(),
                value: 0
            };
            var voters = kwestia.glosujacy.slice();
            voters.push(glosujacy);
            Meteor.call('setGlosujacyTab', kwestia._id, voters, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                }
            });
            //dodanie pkt za głosowanie
            var newValue = 0;
            var pktAddPriorytet = Parametr.findOne({});
            newValue = Number(pktAddPriorytet.pktNadaniePriorytetu) + getUserRadkingValue(Meteor.userId());

            Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
            });
        }
    }
});
Template.listKwestia.helpers({
    'settings': function () {
        var self = Template.instance();
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji",
                        text: "Data"
                    },
                    tmpl: Template.dataUtwKwestia
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Kliknij, aby zobaczyć szczegóły",
                        text: "Nazwa Kwestii"
                    },
                    tmpl: Template.nazwaKwestiLink
                },
                {
                    key: 'wartoscPriorytetu',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Priorytet nadany przez Ciebie oraz ogólna siła priorytetu",
                        text: "Priorytet"
                    },
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'descending'
                },
                {key: 'idTemat', label: "Temat", tmpl: Template.tematKwestia},
                {key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia},
                {
                    key: 'dataGlosowania',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Aktualne kworum / wymagane kworum",
                        text: "Kworum"
                    },
                    tmpl: Template.kworumNumber
                }
            ],
            rowClass: function (item) {
                tab = self.liczbaKwestiRV.get();
                if (_.contains(tab, item._id)) {
                    return 'priorityClass';
                }
            }
        };
    },
    KwestiaList: function () {
        var kwestie = Kwestia.find({
            $where: function () {
                return ((this.czyAktywny == true) && ((this.status==KWESTIA_STATUS.DELIBEROWANA)  || (this.status==KWESTIA_STATUS.STATUSOWA)));
            }
        });
        if(kwestie) return kwestie;
        return null;
    },
    kwestiaCount: function () {
        return Kwestia.find({czyAktywny: true}).count();
    },
    isAdminUser: function () {
        return IsAdminUser();
    },
    isAdmin: function () {
        if(Meteor.user()){
            if (Meteor.user().roles) {
                if (Meteor.user().roles == "admin")
                    return true;
                else
                    return false;
            }
            else return false;
        }
    }
});

Template.tematKwestia.helpers({
    tematNazwa: function () {
        var t = Temat.findOne({_id: this.idTemat});
        if (t) return t.nazwaTemat;
    }
});

Template.rodzajKwestia.helpers({
    rodzajNazwa: function () {
        var r = Rodzaj.findOne({_id: this.idRodzaj});
        if (r) return r.nazwaRodzaj;
    }
});

//Template.dataGlKwestia.helpers({
//    date: function () {
//        var d = this.dataGlosowania;
//        if (d) return moment(d).format("DD-MM-YYYY");
//    }
//});

Template.kworumNumber.helpers({//brani są tu użytkownicy,którzy zaglosowali,czy ktorzy są w systemie?
    // Karolina: myślę, ze wszyscy uzytkownicy bo w funkcji z xml napisane jest, ze bierzemy wszystkich uprawnionych
    // do glosowania uzytkownikow :)
    date: function () {
        var usersCount = this.glosujacy.length;
        var allUsers = Users.find({}).count(); // <- tutaj bedzie zmiana, bo trzeba bedzie ograniczyc liczbe uzytkownikow
        // bedziemy brac tylko czlonkow zwyklych !!!!!
        var idrodzaj = this.idRodzaj;
        var r = Rodzaj.findOne({_id: idrodzaj});
        if (r) {
            if (usersCount) {
                var data;
                if (r.kworum == "zwykla") {
                    var kworum = liczenieKworumZwykle(allUsers);
                    if (kworum >= 3) {

                        data = usersCount.toString() + " / " + kworum.toString();
                    }
                    else {
                        data = usersCount.toString() + " / 3";
                    }
                    return data;
                }
                else if (r.kworum == "statutowa") {
                    var kworum = liczenieKworumStatutowe(allUsers);
                    if (kworum >= 3) {

                        data = usersCount.toString() + " / " + kworum.toString();
                    }
                    else {
                        data = usersCount.toString() + " / 3";
                    }
                    return data;
                }
            }
        }
    }
});

Template.dataUtwKwestia.helpers({
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format("DD-MM-YYYY");
    }
});

Template.priorytetKwestia.helpers({
    priorytet: function () {
        var searchedId = this._id;
        var kwe = Kwestia.findOne({_id: this._id});
        if (kwe) {
            var glosy = kwe.glosujacy.slice();
            var myGlos;
            _.each(glosy, function (glos) {
                if (glos.idUser == Meteor.userId()) {
                    myGlos = glos.value;
                }
            });
            var p = this.wartoscPriorytetu;
            if (p) {
                if (p > 0) p = " +" + p;
                if (myGlos) {
                    if (myGlos > 0) myGlos = " +" + myGlos;
                }
                else
                    myGlos = 0;
                return myGlos + " / " + p;
            }
            else return 0 + " / " + 0;
        }
    }
});

Template.listKwestiaColumnLabel.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
};

Template.listKwestia.helpers({
    isUserOrDoradcaLogged:function(){
        if(!Meteor.roles=='admin')
            return false;
        else {
            var user = Users.findOne({_id: Meteor.userId()});
            if (user) {
                return user.profile.userType == 'doradca' ? false : true;
            }
            return "";
        }
    }
});
