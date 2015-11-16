Template.realizacjaTab2.helpers({
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
                    key: 'dataRealizacji',
                    label: Template.listKwestiaRealzacjaColumnLabel,
                    labelData: {
                        title: "Data rozpoczêcia realizacji kwestii",
                        text: "Data"
                    },
                    tmpl: Template.dataRealizKwestia
                },
                {
                    key: 'numerUchwaly',
                    label: Template.listKwestiaRealzacjaColumnLabel,
                    labelData: {
                        title: "Numer Uchwa³y",
                        text: "Nr. Uchwa³y"
                    },
                    tmpl: Template.numerUchwKwestia
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaRealzacjaColumnLabel,
                    labelData: {
                        title: "Kliknij, aby zobaczyæ szczegó³y",
                        text: "Nazwa Kwestii"
                    },
                    tmpl: Template.nazwaKwestiLink
                },
                {
                    key: 'idTemat',
                    label: "Temat",
                    tmpl: Template.tematKwestia
                },
                {
                    key: 'idRodzaj',
                    label: "Rodzaj",
                    tmpl: Template.rodzajKwestia
                },
                {key: 'status', label: "Status", tmpl: Template.statusKwestii},
                {
                    key: 'options',
                    label: "Opcje",
                    tmpl: Template.editColumnRealization
                }
            ]
        };
    },
    ZrealizowaneList: function () {
        return Kwestia.find({czyAktywny: true, status: {$in:[KWESTIA_STATUS.ZREALIZOWANA]}}).fetch();
    },
    zrealizowaneCount: function () {
        return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.ZREALIZOWANA}).count();
    },
    ZrealizowaneListCount: function () {
        var ile = Kwestia.find({czyAktywny: true, status: {$in:[KWESTIA_STATUS.ZREALIZOWANA]}}).count();
        return ile > 0 ? true : false;
    }
});

Template.realizacjaTab2.events({
    'click #printResolution': function() {

        var docDefinition = {
            content: [
                { text: "dn. " + moment(this.dataRealizacji).format("DD.MM.YYYY").toString() + "r.", style: 'uchwalaTop'},
                { text: "Uchwa³a  Numer: " + this.numerUchwaly.toString() + "\nDotyczy: " + this.kwestiaNazwa , style: 'uchwalaHeadline'},
                { text: "\n\t\t\t\t\t\t" + this.szczegolowaTresc, style: 'contentStyle'}
            ],
            styles: {
                uchwalaTop: {fontSize: 12, alignment: 'right'},
                uchwalaHeadline: {fontSize: 16, bold: true, alignment: 'center', margin: [0,50,0,50]},
                contentStyle: {fontSize: 12, alignment: 'justify'}
            }
        };

        pdfMake.createPdf(docDefinition).open();
    }
});
