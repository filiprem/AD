Template.realizacjaTab1.rendered=function(){
};
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
                {
                    key: 'raporty',
                    label: "Raport",
                    tmpl:Template.raport
                },
                {
                    key: 'options',
                    label: "Opcje",
                    tmpl: Template.editColumnRealization
                }
            ]
        };
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
};

Template.raport.helpers({
    reportCurrentDurationExists:function(raporty){
        var raportId= _.last(raporty);
        var issue=Kwestia.findOne({_id:this._id});
        if(raportId==null)
        return false;
        else{
            var report=Raport.findOne({_id: raportId});
            return report.dataUtworzenia> _.last(issue.listaDatRR) ? true : false;_
        }
    },
    currentReport:function(raporty){
        var raport= _.first(raporty.reverse());
        return Raport.findOne({_id:raport});
    },
    hasZR:function(){
        var issue=Kwestia.findOne({_id:this._id});
        if(issue){
            if(issue.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return false;
            return true;
        }
    }
});
Template.raport.events({
   'click #showReport':function(e){
       e.preventDefault();
       lackOfRealizatonReport();
   }
});
lackOfRealizatonReport=function(){
    GlobalNotification.error({
        title: 'Uwaga',
        content: "Brak aktualnego Raportu Realizacyjnego",
        duration: 3 // duration the notification should stay in seconds
    });
};
checkRRExists=function(raporty,param){
    var previousCheck = moment(new Date()).subtract(param, "minutes").format();
    var timeNow = moment(new Date()).format();
    var reports =
        Raport.find({
            _id: {$in: raporty},
            dataUtworzenia: {
                $gte: previousCheck,
                $lt: timeNow
            }
        });
    return reports;
};

