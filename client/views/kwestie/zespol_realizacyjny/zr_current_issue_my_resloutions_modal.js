Template.zrModalCurrentIssueMyResolutionsInner.rendered=function(){
    document.getElementById("agreeButton").disabled=false;
};

Template.zrModalCurrentIssueMyResolutionsInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 5,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'numerUchwaly', label: "Numer Uchwaly"},
                {key: 'kwestiaNazwa', label: "Nazwa Kwestii"},
                {key: 'dataRealizacji', label: "Data realizacjii", tmpl: Template.dataRealizKwestia}
            ]
        };
    },
    IssuesList: function(){
        var zr = ZespolRealizacyjny.findOne({_id: this.idZespolRealizacyjny});
        console.log(zr);
        console.log(zr.kwestie);
        var issues = Kwestia.find({_id: {$in: zr.kwestie}, czyAktywny: true});
        console.log(issues.count());
        return issues;
    }
});

Template.zrModalCurrentIssueMyResolutionsInner.events({
    'click #agreeButton':function(e){
        e.preventDefault();
        document.getElementById("agreeButton").disabled=true;
        $("#zrCurrentIssueMyResolutions").modal("hide");


        var zr=ZespolRealizacyjny.findOne({_id:this.idZespolRealizacyjny});
        console.log(zr);
        //przepisz do kwestii członków,mimo,że jeszcze nie idzie do kosza?=to nie ,patrz->zeszyt!
        var currentIssueId=Router.current().params._id;
        //usunięcie z zespołu członka
        var zespol= _.without(zr.zespol,Meteor.userId());
        console.log("new zespół");
        console.log(zespol);
        Meteor.call("updateCzlonkowieZR",zr._id,zespol,function(error){//to FINISH
            if(error)
                throwError(error.reason);
            else{
                var zrList=ZespolRealizacyjnyDraft.find({idZR:zr._id});
                var array=[];
                zrList.forEach(function(zr){
                    array.push(zr._id);
                });
                console.log("te zespoły");
                console.log(zrList.count());
                console.log(array);
                var allIssues=Kwestia.find({
                    czyAktywny:true,
                    status:{$in:[
                        KWESTIA_STATUS.GLOSOWANA,
                        KWESTIA_STATUS.OSOBOWA,
                        KWESTIA_STATUS.OCZEKUJACA,
                        KWESTIA_STATUS.DELIBEROWANA]},
                    _id:{$nin:[currentIssueId]},
                    idZespolRealizacyjny:{$in:array}
                });
                if(allIssues.count>0){
                    var newZRList=[];
                    allIssues.forEach(function(issue){
                        newZRList.push(issue.idZespolRealizacyjny);
                    });
                    console.log(allIssues.count());
                    var zrCur=ZespolRealizacyjnyDraft.findOne({idZR:{$in:newZRList}});
                    console.log(zrCur.count());
                    zrCur.forEach(function(zrItem){
                       Meteor.call("updateCzlonkowieNazwaZRDraft",zrItem._id,zespol,zr.nazwa);
                    });
                }
                document.getElementById("agreeButton").disabled=false;
            }
        });


    }
});

manageIssuesWithoutZR=function(issuesArray){
    var issues=Kwestia.find({_id:{$in:issuesArray},status:{$in:[KWESTIA_STATUS.ZREALIZOWANA,KWESTIA_STATUS.REALIZOWANA]}});
    issues.forEach(function(issue){
        Meteor.call("removeKwestia",issue._id,function(error){
           if(!error){

           }
        });
    });
    //bierzemy wszystkie kwestie,które były realizowane przez ten ZR :
    // ustwiamy na czyKAtywne=false
    //przepisujemy zespoły-wezmiemy od tej kwesti z grupy,która ma full członków-nie!-patrz w zeszyt
    //zarządzamy kwestiami w zależności jaki typ kwestii:access-cofnięcie uprawnień, global Params-przywrócenie starych
    //
};

withdrawalIssueChanges=function(issue){
    if(issue.typ=KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){
        restoratePreviousParameters(issue);
    }
    if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_HONOROWY,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],issue.typ)){
        //odnajdz usera
        //usuń go
        var userDraft=UsersDraft.findOne({_id:issue.idUser});
        if(userDraft.idUser){
            //to będzie user existing
        }
        else{
            //to będzie nowy user:/-pasuje wpisywać do userDraft lub do kwestii idUSera nowo dodanego
        }
    }
};

restoratePreviousParameters=function(issue){

};