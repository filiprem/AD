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
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Data wprowadzenia Kwestii i rozpoczêcia jej deliberacji",
                        text: "Data"
                    },
                    tmpl: Template.dataUtwKwestia
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
                {key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia},
                {
                    key: 'dataGlosowania',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Data zakoñczenia g³osowania",
                        text: "Fina³"
                    },
                    tmpl: Template.dataGlKwestia
                }
            ]
        };
    },
    GlosowanieList: function () {
        return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.GLOSOWANA}).fetch();
    }
});