Template.listKwestia.rendered = function () {
    var self = Template.instance();
    this.autorun(function () {
        //a co z kwestiami, które nie pojda do glosowania???
        //{status:{$in:[KWESTIA_STATUS.DELIBEROWANA,KWESTIA_STATUS.ADMINISTROWANA]}},
        var kwestie = Kwestia.find({
            $where: function () {
                var typKworum=liczenieKworumZwykle();
                if(this.idRodzaj){
                    var rodzaj=Rodzaj.findOne({_id:this.idRodzaj});
                    if(rodzaj) {
                        //console.log(rodzaj.nazwaRodzaj);
                        if (rodzaj.nazwaRodzaj.trim() == "Statutowe")
                            typKworum = liczenieKworumStatutowe();
                    }
                }
                var zrCondition=true;
                if(this.idZespolRealizacyjny){
                    var zrDraft=ZespolRealizacyjnyDraft.findOne({_id:this.idZespolRealizacyjny});
                    if(zrDraft){
                        if(zrDraft.zespol.length>=3)
                            zrCondition=true;
                        else
                            zrCondition=false;
                    }
                    else
                        zrCondition=false;
                }
                return ((this.czyAktywny == true) &&
                (this.wartoscPriorytetu > 0) &&
                (this.glosujacy.length>=typKworum) && zrCondition==true
                &&(this.status==KWESTIA_STATUS.DELIBEROWANA || this.status==KWESTIA_STATUS.ADMINISTROWANA));
                //tutaj trzeba uwazac! dac tylko statusy,ktore maja byc w "kwestie",bo inaczej nie bd widoczne...
            }
        }, {sort: {wartoscPriorytetu: -1,dataWprowadzenia:1}});//, limit: 3});
        var tab = [];
        if(kwestie.count()<=3) {//jezeli tylko 3 spelniaja warunki,to git(sa 3 na liscie?,to ida wszystkie)
            kwestie.forEach(function (item) {
                tab.push(item._id);
            });
        }
        else {//jezeli jest takich wiecej z tym samym priorytetem,to trzeba wybrać max 3
            tab=setInQueueToVote(kwestie);
        }
        console.log("tab");
        console.log(tab);
        self.liczbaKwestiRV.set(tab);
    });
};
Template.listKwestia.created = function () {
    this.liczbaKwestiRV = new ReactiveVar();
    this.choosenSortRV = new ReactiveVar();
    this.choosenSortRV.set(0);
};

Template.listKwestia.events({
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
    //'click #kwestiaIdClick': function () {
    //
    //},
    "change #customFilterSelect": function (event, template) {
        var input = $(event.target).val();
        var self = Template.instance();
        if (!!input && input==0)
            self.choosenSortRV.set(0);
         else
            self.choosenSortRV.set(1);
    }
});
Template.listKwestia.helpers({
    'isDataSortEnabled':function(){
        var self = Template.instance();
        var sort = self.choosenSortRV.get();
        return sort==0 ? true : false;
    },
    'getFilterFields':function(){
        return ['kwestiaNazwa'];
    },
    'settings': function () {
        var self = Template.instance();
        var sort = self.choosenSortRV.get();
        return {
            rowsPerPage: 15,
            //showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            noDataTemplate:Template.noData,
            filters:['customFilter'],
            fields: [
                {
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji",
                        text: "Data"
                    },
                    tmpl: Template.dataUtwKwestia,
                    sortOrder: 1,
                    sortDirection: "descending"
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Kliknij w nazwę, aby zobaczyć szczegóły Kwestii",
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
                    tmpl: Template.priorytetKwestia
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
    'settings2': function () {
        var self = Template.instance();
        var sort = self.choosenSortRV.get();
        return {
            rowsPerPage: 15,
            //showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            noDataTemplate: Template.noData,
            filters: ['customFilter'],
            fields: [
                {
                    key: 'id',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "id",
                        text: "Id"
                    },
                    tmpl: Template.id
                },
                {
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji",
                        text: "Data"
                    },
                    tmpl: Template.dataUtwKwestia,
                    sortOrder: 1,
                    sortDirection: "ascending"
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Kliknij w nazwę, aby zobaczyć szczegóły Kwestii",
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
                    sortOrder: 0,
                    sortDirection: "descending"
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
                return ((this.czyAktywny == true) &&
                ((this.status==KWESTIA_STATUS.DELIBEROWANA)  ||
                (this.status==KWESTIA_STATUS.STATUSOWA) ||
                (this.status==KWESTIA_STATUS.ADMINISTROWANA) ||
                (this.status==KWESTIA_STATUS.OSOBOWA)));
            }
        });

        if(kwestie)
            return kwestie;
        else
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

Template.dataUtwKwestia.helpers({
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format("DD-MM-YYYY HH:mm:ss");
    }
});
Template.id.helpers({
    id: function () {
        return this._id;
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
        if(IsAdminUser())
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

Template.kworumNumber.helpers({
    'getKworum':function(){
        var usersCount = this.glosujacy.length;
        return usersCount.toString() + " / " +liczenieKworumZwykle();
    }
});

