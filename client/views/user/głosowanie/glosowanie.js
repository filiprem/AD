Template.glosowanie.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'dataGlosowania',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Termin głosowania Kwestii",
                        text: "Data"
                    },
                    tmpl: Template.dataGlosowaniaKwestia
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
                {key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia}
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
    GlosowanieList: function () {
        return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.GLOSOWANA}).fetch();
    },
    GlosowanieListCount: function () {
        var ile = Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.GLOSOWANA}).count();
        return ile > 0 ? true : false;
    }
});

Template.dataGlosowaniaKwestia.helpers({
    date: function () {
        var d = this.dataGlosowania;
        if (d) return moment(d).format("DD-MM-YYYY HH:mm");
    }
});