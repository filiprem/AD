Template.listKwestiaAdmin.rendered = function () {
};
Template.listKwestiaAdmin.events({
    'click .glyphicon-pencil': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click #addKwestiaButton': function () {
        if (!!Session.get("kwestiaPreview"))
            Session.set("kwestiaPreview", null);
        Router.go("addKwestia");
    }
});
Template.listKwestiaAdmin.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji", text: "Data"},
                    tmpl: Template.dataUtwKwestia,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Kliknij, aby zobaczyć szczegóły", text: "Nazwa kwestii"},
                    tmpl: Template.nazwaKwestiLink,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                {
                    key: 'sredniaPriorytet',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Kliknij, aby zmienić swój priorytet dla tej Kwestii", text: "Priorytet"},
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'descending',
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                {
                    key: 'temat_id',
                    label: "Temat",
                    tmpl: Template.tematKwestia,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                {
                    key: 'rodzaj_id',
                    label: "Rodzaj",
                    tmpl: Template.rodzajKwestia,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                {
                    key: 'dataGlosowania',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Data zakończenia głosowania", text: "Finał"},
                    tmpl: Template.dataGlKwestia,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                {
                    key: 'status',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Etap, na którym znajduje sie ta Kwestia", text: "Status"},
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                {
                    key: 'options',
                    label: "Opcje",
                    tmpl: Template.editColumnKwestiaAdmin,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                }
            ]
        };
    },
    KwestiaListAdmin: function () {
        return Kwestia.find({czyAktywny: true}).fetch();
    },
    kwestiaCount: function () {
        return Kwestia.find({czyAktywny: true}).count();
    },
    isAdminUser: function () {
        return IsAdminUser();
    },
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    }
});

Template.listKwestiaAdminColumnLabel.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
}