Template.listKwestia.rendered = function () {
    var self = Template.instance();
    this.autorun(function () {
        var kwestie = Kwestia.find({
            $where: function () {
                return ((this.czyAktywny == true) && (this.sredniaPriorytet > 0));
            }
        }, {sort: {sredniaPriorytet: -1}, limit: 3});
        var tab = [];
        kwestie.forEach(function (item) {
            tab.push(item._id);
        });
        self.liczbaKwestiRV.set(tab);
    })

};
Template.listKwestia.created = function () {
    this.liczbaKwestiRV = new ReactiveVar();
},
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
                    key: 'sredniaPriorytet',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Kliknij, aby zmienić swój priorytet dla tej Kwestii",
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
                        title: "Data zakończenia głosowania",
                        text: "Finał"
                    },
                    tmpl: Template.dataGlKwestia
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
        return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.DELIBEROWANA}).fetch();
    },
    priorytetsr: function () {
        var i = 0;
        var kwestia = Kwestia.findOne({_id: this._id});
        if (kwestia) {
            kwestia.glosujacy.forEach(function (item) {
                i++;
            });
            if (kwestia.priorytet === 0) {
                var srPriorytet = kwestia.priorytet;
            }
            else {
                var srPriorytet = kwestia.priorytet / i;
            }
            return srPriorytet
        }
    },
    kwestiaCount: function () {
        return Kwestia.find({czyAktywny: true}).count();
    },
    isAdminUser: function () {
        return IsAdminUser();
    },
    isAdmin: function () {
        if (Meteor.user().roles == "admin") return true;
        else return false;
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

Template.dataGlKwestia.helpers({
    date: function () {
        var d = this.dataGlosowania;
        if (d) return moment(d).format("DD-MM-YYYY");
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
        var p = this.sredniaPriorytet;
        //if(p){
        return p.toFixed(2);
        //}
    }
});

Template.listKwestiaColumnLabel.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
}
