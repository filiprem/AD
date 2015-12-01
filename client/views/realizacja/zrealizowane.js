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

        var globalParameters = Parametr.findOne({});
        var vote = this.glosujacy;
        var voteFor = 0;
        var voteAgainst = 0;
        var abstained = 0;
        var realizationTeamMembers = new Array(3);
        var membersNames = new Array(3);
        var issueContent;

        for(i=0; i < 3; i++){
            membersNames[i] = "";
        }

        if(this.idZespolRealizacyjny){
            var realizationTeam = ZespolRealizacyjny.findOne({_id: this.idZespolRealizacyjny}).zespol;

            for(i = 0; i < realizationTeam.length; i++){
                realizationTeamMembers[i] = Users.findOne({_id: realizationTeam[i]});
            }
            var iterator = 0;
            realizationTeamMembers.forEach(function(member){
                membersNames[iterator] = member.profile.firstName + " " + member.profile.lastName;
                iterator++;
            });
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

        if(this.typ == KWESTIA_TYPE.BASIC){
            issueContent = this.szczegolowaTresc;
        }else{
            issueContent = this.krotkaTresc;
        }

        if(this.idZespolRealizacyjny){
            var docDefinition = {
                content: [
                    { text: "dn. " + moment(this.dataRealizacji).format("DD.MM.YYYY").toString() + "r.", style: 'uchwalaTop'},
                    { text: globalParameters.nazwaOrganizacji + "\n" +
                    globalParameters.terytorium + "\n" +
                    globalParameters.kontakty + "\n"
                    },
                    { text: "Uchwała  Numer: " + this.numerUchwaly.toString() + "\nDotyczy: " + this.kwestiaNazwa , style: 'uchwalaHeadline'},
                    { text: "\n\t\t\t\t\t\t" + issueContent, style: 'contentStyle'},
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
        }else{
            var docDefinition = {
                content: [
                    { text: "dn. " + moment(this.dataRealizacji).format("DD.MM.YYYY").toString() + "r.", style: 'uchwalaTop'},
                    { text: globalParameters.nazwaOrganizacji + "\n" +
                    globalParameters.terytorium + "\n" +
                    globalParameters.kontakty + "\n"
                    },
                    { text: "Uchwała  Numer: " + this.numerUchwaly.toString() + "\nDotyczy: " + this.kwestiaNazwa , style: 'uchwalaHeadline'},
                    { text: "\n\t\t\t\t\t\t" + issueContent, style: 'contentStyle'},
                    { text: "\nStan osobowy - " + this.glosujacy.length +
                    "\nObecnych  - " + this.glosujacy.length +
                    "\nGłosujących za - " + voteFor +
                    "\nGłosujących przeciw - " + voteAgainst +
                    "\nWstrzymujących - " + abstained
                    }
                ],
                styles: {
                    uchwalaTop: {fontSize: 12, alignment: 'right'},
                    uchwalaHeadline: {fontSize: 16, bold: true, alignment: 'center', margin: [0,50,0,50]},
                    contentStyle: {fontSize: 12, alignment: 'justify'}
                }
            };
        }

        pdfMake.createPdf(docDefinition).open();
    }
});
