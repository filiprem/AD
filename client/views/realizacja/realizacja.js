Template.realizacjaTab1.helpers({
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
                       // title: "id",
                        text: "Id"
                    },
                    tmpl: Template.id
                },
                {
                    key: 'dataRealizacji',
                    label: Template.listKwestiaRealzacjaColumnLabel,
                    labelData: {
                        //title: "Data rozpoczęcia realizacji kwestii",
                        text: "Data realizacji"
                    },
                    tmpl: Template.dataRealizKwestia
                },
                {
                    key: 'numerUchwaly',
                    label: Template.listKwestiaRealzacjaColumnLabel,
                    labelData: {
                       // title: "Numer Uchwały",
                        text: "Nr. Uchwały"
                    },
                    tmpl: Template.numerUchwKwestia
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaRealzacjaColumnLabel,
                    labelData: {
                        //title: "Kliknij, aby zobaczyć szczegóły",
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
                {key: 'raport', label: "Raport", tmpl: Template.statusKwestii},
                {
                    key: 'options',
                    label: "Opcje",
                    tmpl: Template.editColumnRealization
                }
            ]
        };
    },
    RealizacjaList: function () {
        return Kwestia.find({czyAktywny: true, status: {$in:[KWESTIA_STATUS.REALIZOWANA]}}).fetch();
    },
    realizacjaCount: function () {
        return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.REALIZOWANA}).count();
    },
    RealizacjaListCount: function () {
        var ile = Kwestia.find({czyAktywny: true, status: {$in:[KWESTIA_STATUS.REALIZOWANA]}}).count();
        return ile > 0 ? true : false;
    }
});

Template.realizacjaTab1.events({
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

Template.dataRealizKwestia.helpers({
    date: function () {
        var d = this.dataRealizacji;
        if (d) return moment(d).format("DD-MM-YYYY");
    }
});

Template.numerUchwKwestia.helpers({
    number: function () {
        return this.numerUchwaly;
    }
});

Template.listKwestiaRealzacjaColumnLabel.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
}

