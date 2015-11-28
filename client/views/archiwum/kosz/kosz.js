Template.kosz.helpers({
    'settings': function () {
        return {
            rowsPerPage: 15,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                //{
                //    key: 'id',
                //    label: Template.listKwestiaColumnLabel,
                //    labelData: {
                //        title: "id",
                //        text: "Id"
                //    },
                //    tmpl: Template.id
                //},
                { key: 'dataGlosowania', label: Template.listKwestiaColumnLabel, tmpl: Template.dataKoniecKwestia },
                { key: 'kwestiaNazwa', label: Template.listKwestiaColumnLabel, tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: Template.listKwestiaColumnLabel, tmpl: Template.priorytetKwestia },
                { key: 'idTemat', label: "Temat", tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia }
                //{
                //    key: 'dataGlosowania',
                //    label: Template.listKwestiaColumnLabel,
                //    labelData: {
                //        title: "Data zakończenia głosowania",
                //        text: "Finał"
                //    },
                //    tmpl: Template.dataGlKwestia
                //}
            ]
        };
    },
    KoszList: function () {
        return Kwestia.find({czyAktywny: false});
    },
    KoszListCount: function () {
        var ile = Kwestia.find({czyAktywny: false}).count();
        return ile > 0 ? true : false;
    }
});

Template.dataKoniecKwestia.helpers({
    date: function () {
        var d = this.dataGlosowania;
        if (d) return moment(d).format("DD-MM-YYYY HH:mm");
    }
});