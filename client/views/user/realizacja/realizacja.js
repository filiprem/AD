Template.realizacja.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'dataRealizacji',
                    label: Template.listKwestiaRealzacjaColumnLabel,
                    labelData: {
                        title: "Data rozpoczęcia realizacji kwestii",
                        text: "Data"
                    },
                    tmpl: Template.dataRealizKwestia
                },
                {
                    key: 'numerUchwały',
                    label: Template.listKwestiaRealzacjaColumnLabel,
                    labelData: {
                        title: "Numer Uchwały",
                        text: "Nr. Uchwały"
                    },
                    tmpl: Template.numerUchwKwestia
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaRealzacjaColumnLabel,
                    labelData: {
                        title: "Kliknij, aby zobaczyć szczegóły",
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
                {
                    key: 'options',
                    label: "Opcje",
                    tmpl: Template.editColumnRealization
                }
            ]
        };
    },
    RealizacjaList: function () {
        return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.REALIZOWANA}).fetch();
    },
    realizacjaCount: function () {
        return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.REALIZOWANA}).count();
    },
    RealizacjaListCount: function () {
        var ile = Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.REALIZOWANA}).count();
        return ile > 0 ? true : false;
    }
});

Template.realizacja.events({
    'click #printResolution': function() {

        var docDefinition = {
            content: [
                { text: "Uchwała  Numer: " + this.numerUchwały.toString() + " z dnia " + moment(this.dataRealizacji).format("DD-MMMM-YYYY").toString(), style: 'uchwalaHeadline'},
                { text: "\n\n" + this.szczegolowaTresc, style: 'contentStyle'}
            ],
            styles: {
                uchwalaHeadline: {fontSize: 18, bold: true, alignment: 'center'},
                contentStyle: {fontSize: 12, alignment: 'left'}
            }

        };

        pdfMake.createPdf(docDefinition).open();
    }
});

Template.dataRealizKwestia.helpers({
    date: function () {
        var d = this.dataRealizacji;
        if (d) return moment(d).format("DD-MM-YYYY");
    }
});

Template.numerUchwKwestia.helpers({
    number: function () {
        return this.numerUchwały;
    }
});

Template.listKwestiaRealzacjaColumnLabel.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
}

