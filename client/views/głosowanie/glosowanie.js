Template.glosowanie.helpers({
    'settings': function () {
        return {
            rowsPerPage: 15,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'id', label: "Id", tmpl: Template.id },
                { key: 'dataGlosowania', label: "Data glosowanie", tmpl: Template.dataGlosowaniaKwestia ,sortOrder:0,sortDirection:'ascending'},
                { key: 'kwestiaNazwa', label: "Nazwa", tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: "Priorytet", tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'descending'},
                { key: 'idTemat', label: "Temat", tmpl: Template.tematKwestia},
                { key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia}
            ]
        };
    },
    //GlosowanieList: function () {
    //    return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.GLOSOWANA}).fetch();
    //},
    //GlosowanieListCount: function () {
    //    var ile = Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.GLOSOWANA}).count();
    //    return ile > 0 ? true : false;
    //}
});

Template.dataGlosowaniaKwestia.helpers({
    date: function () {
        var d = this.dataGlosowania;
        if (d) return moment(d).format("DD-MM-YYYY HH:mm");
    }
});