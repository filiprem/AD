Template.realizacjaTab1.helpers({
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
                { key: 'numerUchwaly', label: "Numer uchwały", tmpl: Template.numerUchwKwestia },
                { key: 'kwestiaNazwa', label: "Nazwa", tmpl: Template.nazwaKwestiLink },
                { key: 'idTemat', label: "Temat", tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia },
                { key: 'raport', label: "Raport", tmpl: Template.raport },
                { key: 'options', label: "Opcje", tmpl: Template.editColumnRealization }
            ]
        };
    }
    //RealizacjaList: function () {
    //    return Kwestia.find({czyAktywny: true, status: {$in:[KWESTIA_STATUS.REALIZOWANA]}}).fetch();
    //},
    //realizacjaCount: function () {
    //    return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.REALIZOWANA}).count();
    //},
    //RealizacjaListCount: function () {
    //    var ile = Kwestia.find({czyAktywny: true, status: {$in:[KWESTIA_STATUS.REALIZOWANA]}}).count();
    //    return ile > 0 ? true : false;
    //}
});

Template.realizacjaTab1.events({
    'click #printResolution': function() {

        var globalParameters = Parametr.findOne({});
        var realizationTeam = ZespolRealizacyjny.findOne({_id: this.idZespolRealizacyjny}).zespol;
        var vote = this.glosujacy; //.find({value:{ $gt: 0 }})
        var voteFor = 0;
        var voteAgainst = 0;
        var abstained = 0;
        var realizationTeamMembers = new Array(3);
        var membersNames = new Array(3);
        for(i=0; i < 3; i++){
            membersNames[i] = "";
        }

        for(i = 0; i < realizationTeam.length; i++){
            realizationTeamMembers[i] = Users.findOne({_id: realizationTeam[i]});
        }

        for(i = 0; i < vote.length; i++){
            if(vote[i].value>0){
                voteFor++;
            }else if(vote[i].value<0){
                voteAgainst++
            }else if(vote[i].value==0){
                abstained++
            }
        }
        var iterator = 0;
        realizationTeamMembers.forEach(function(member){
            membersNames[iterator] = member.profile.firstName + " " + member.profile.lastName
            iterator++;
        });

        var docDefinition = {
            content: [
                { text: "dn. " + moment(this.dataRealizacji).format("DD.MM.YYYY").toString() + "r.", style: 'uchwalaTop'},
                { text: globalParameters.nazwaOrganizacji + "\n" +
                        globalParameters.terytorium + "\n" +
                        globalParameters.kontakty + "\n"
                },
                { text: "Uchwała  Numer: " + this.numerUchwaly.toString() + "\nDotyczy: " + this.kwestiaNazwa , style: 'uchwalaHeadline'},
                { text: "\n\t\t\t\t\t\t" + this.szczegolowaTresc, style: 'contentStyle'},
                { text: "\nStan osobowy - " + this.glosujacy.length +
                        "\nObecnych  - " + this.glosujacy.length +
                        "\nGłosujących za - " + voteFor +
                        "\nGłosujących przeciw - " + voteAgainst +
                        "\nWstrzymujących - " + abstained +
                        "\n\nZespół Realizacyjny:" +
                        "\n1. - " + membersNames[0] +
                        "\n2. - " + membersNames[1] +
                        "\n3. - " + membersNames[2]
                }
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
            else return true;
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
    var reports = Raport.find({
        _id: {$in: raporty},
        dataUtworzenia: {
            $gte: previousCheck,
            $lt: timeNow
       }
   });
    return reports;
};


