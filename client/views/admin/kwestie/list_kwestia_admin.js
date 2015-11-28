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
                { key: 'dataWprowadzenia', label: Template.listKwestiaAdminColumnLabel, tmpl: Template.dataUtwKwestia,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                { key: 'kwestiaNazwa', label: Template.listKwestiaAdminColumnLabel, tmpl: Template.nazwaKwestiLink,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                { key: 'temat_id', label: "Temat", tmpl: Template.tematKwestia,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                { key: 'rodzaj_id', label: "Rodzaj", tmpl: Template.rodzajKwestia,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                { key: 'dataGlosowania', label: Template.listKwestiaAdminColumnLabel, tmpl: Template.dataGlKwestia,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                { key: 'status', label: Template.listKwestiaAdminColumnLabel,
                    cellClass: function () {
                        var css = 'tableCellsFont';
                        return css;
                    }
                },
                { key: 'options', label: "Opcje", tmpl: Template.editColumnKwestiaAdmin,
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