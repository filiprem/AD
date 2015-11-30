Template.realizacjaTab2.helpers({
    'settings': function () {
        return {
            rowsPerPage: 15,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'id', label: "Id", tmpl: Template.id },
                { key: 'dataRealizacji', label: "Data realizacji", tmpl: Template.dataRealizKwestia },
                { key: 'numerUchwaly', label: "Numer uchwaly", tmpl: Template.numerUchwKwestia },
                { key: 'kwestiaNazwa', label: "Kwestia nazwa", tmpl: Template.nazwaKwestiLink },
                { key: 'idTemat', label: "Temat", tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia },
                {key: 'raporty', label: "Raport", tmpl:Template.raport},
                { key: 'options', label: "Opcje", tmpl: Template.editColumnRealization }
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
                { text: "Uchwała  Numer: " + this.numerUchwaly.toString() + "\nDotyczy: " + this.kwestiaNazwa , style: 'uchwalaHeadline'},
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
