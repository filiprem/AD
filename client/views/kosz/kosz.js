Template.kosz.helpers({
    'settings': function () {
        return {
            rowsPerPage: 15,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
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
                    key: 'dataGlosowania',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Koniec g³osowania Kwestii",
                        text: "Data"
                    },
                    tmpl: Template.dataKoniecKwestia,
                    sortOrder: 0,
                    sortDirection: 'ascending'
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Kliknij, aby zobaczyæ szczegó³y",
                        text: "Nazwa Kwestii"
                    },
                    tmpl: Template.nazwaKwestiLink
                },
                {
                    key: 'sredniaPriorytet',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Kliknij, aby zmieniæ swój priorytet dla tej Kwestii",
                        text: "Priorytet"
                    },
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'descending'
                },
                {key: 'idTemat', label: "Temat", tmpl: Template.tematKwestia},
                {key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia}
                //{
                //    key: 'dataGlosowania',
                //    label: Template.listKwestiaColumnLabel,
                //    labelData: {
                //        title: "Data zakoñczenia g³osowania",
                //        text: "Fina³"
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