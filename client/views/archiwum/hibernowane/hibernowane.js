Template.hibernowaneList.events({
    'click .glyphicon-trash': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-pencil': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-repeat': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-info-sign': function (event, template) {
        Session.set('kwestiaInScope', this);
    }
});
Template.hibernowaneList.helpers({
    'settings': function () {
        return {
            rowsPerPage: 15,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {
                        //title: "Data wprowadzenia Kwestii i rozpocz�cia jej deliberacji",
                        text: "Data"
                    },
                    tmpl: Template.dataUtwKwestia
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {
                        //title: "Kliknij, aby zobaczy� szczeg�y",
                        text: "Nazwa Kwestii"
                    },
                    tmpl: Template.nazwaKwestiiHibernowaneLink
                },
                {
                    key: 'wartoscPriorytetu',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {
                        //title: "Kliknij, aby zmieni� sw�j priorytet dla tej Kwestii",
                        text: "Priorytet"
                    },
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'descending'
                },
                {key: '', label: "Temat", tmpl: Template.tematKwestiiHibernowane},
                {key: '', label: "Rodzaj", tmpl: Template.rodzajKwestiiHibernowane},
                {
                    key: 'status',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {
                        //title: "Etap, na kt�rym znajduje sie ta Kwestia",
                        text: "Status"
                    }
                }
            ]
        };
    },
    HibernowaneList: function () {
        return Kwestia.find({
            czyAktywny: true,
            status: {
                $in: [
                    //KWESTIA_STATUS.ARCHIWALNA
                    KWESTIA_STATUS.HIBERNOWANA
                ]
            }
        });
    },
    'hibernowaneListCount': function () {
        var count = Kwestia.find({
            czyAktywny: true,
            status: {
                $in: [
                    //KWESTIA_STATUS.ARCHIWALNA,
                    KWESTIA_STATUS.HIBERNOWANA
                ]
            }
        }).count();
        return count > 0 ? true : false;
    },
    'isAdminUser': function () {
        return IsAdminUser();
    },
    'tematNazwa': function () {
        return Temat.findOne({_id: this.idTemat});
    },
    'rodzajNazwa': function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    }
});

Template.hibernowaneList.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
}

Template.tematKwestiiHibernowane.helpers({
    'getTemat': function (id) {
        var item = Temat.findOne({_id: id});
        return !!item && !!item.nazwaTemat ? item.nazwaTemat : id;
    }
});

Template.rodzajKwestiiHibernowane.helpers({
    'getRodzaj': function (id) {
        var item = Rodzaj.findOne({_id: id});
        return !!item && !!item.nazwaRodzaj ? item.nazwaRodzaj : id;
    }
});