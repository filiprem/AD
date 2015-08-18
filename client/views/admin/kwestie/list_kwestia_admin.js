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
                    tmpl: Template.dataUtwKwestia
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Kliknij, aby zobaczyć szczegóły", text: "Nazwa Kwestii"},
                    tmpl: Template.nazwaKwestiLink
                },
                {
                    key: 'sredniaPriorytet',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Kliknij, aby zmienić swój priorytet dla tej Kwestii", text: "Priorytet"},
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'descending'
                },
                {key: 'idTemat', label: "Temat", tmpl: Template.tematKwestia},
                {key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia},
                {
                    key: 'dataGlosowania',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Data zakończenia głosowania", text: "Finał"},
                    tmpl: Template.dataGlKwestia
                },
                {
                    key: 'status',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Etap, na którym znajduje sie ta Kwestia", text: "Status"}
                },
                {key: 'options', label: "Opcje", tmpl: Template.editColumnKwestiaAdmin}
            ]
        };
    },
    KwestiaListAdmin: function () {
        return Kwestia.find({}).fetch();
    },
    priorytetsr: function () {
        var i = 0;
        var kwestia = Kwestia.findOne({_id: this._id});
        kwestia.glosujacy.forEach(function (item) {
            i++;
        });
        if (kwestia.priorytet === 0)
            var srPriorytet = kwestia.priorytet;
        else
            var srPriorytet = kwestia.priorytet / i;
        return srPriorytet
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