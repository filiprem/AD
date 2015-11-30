Template.editParametrModalInner.rendered=function(){
    console.log("render!");
    $('.btn-success').css("visibility", "visible");
    $("#parametrFormEditModal").validate({
        rules:{
            voteDuration: {
                min: 0,
                number: true
            },
            voteQuantity: {
                min: 0,
                number: true
            },
            czasWyczekiwaniaKwestiiSpec: {
                min: 0,
                number: true
            },
            addIssuePause: {
                min: 0,
                number: true
            },
            addCommentPause: {
                min: 0,
                number: true
            },
            addReferencePause: {
                min: 0,
                number: true
            },
            okresSkladaniaRR:{
                min:1,
                number:true
            }
        },
        messages: {
            nazwaOrganizacji: {
                required: fieldEmptyMessage()
            },
            terytorium: {
                required: fieldEmptyMessage()
            },
            kontakty: {
                required: fieldEmptyMessage()
            },
            regulamin: {
                required: fieldEmptyMessage()
            },
            voteDuration: {
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
            },
            voteQuantity: {
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
            },
            czasWyczekiwaniaKwestiiSpec:{
                required:fieldEmptyMessage(),
                min:positiveNumberMessage()
            },
            addIssuePause: {
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
            },
            addCommentPause: {
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
            },
            addReferencePause: {
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
            },
            okresSkladaniaRR:{
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
            }
        },
        highlight: function (element) {
            highlightFunction(element);
        },
        unhighlight: function (element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            validationPlacementError(error, element);
        }
    })
},
Template.editParametrModalInner.helpers({
    parametrInScope: function () {
        console.log(Session.get('chosenParameterSession'));
        return Session.get('chosenParameterSession');
    },
    NoStatutKontaktInput:function(parameterName){
        console.log("check");
        return parameterName=="Statut" || parameterName=="Kontakty" ? false :true;
    },
    nazwaOrganizacjiInput:function(parameterName){
        return parameterName=="Nazwa organizacji" ? false :true;
    },
    terytoriumInput:function(parameterName){
        return parameterName=="Terytorium" ? false :true;
    },
    kontaktInput:function(parameterName){
        return parameterName=="Kontakty" ? false :true;
    },
    statutInput:function(parameterName){
        return parameterName=="Statut" ? false :true;
    },
    voteDurationInput:function(parameterName){
        return parameterName=="Czas głosowania(w godzinach)" ? false :true;
    },
    czasWyczekiwaniaKwestiiSpecjalnejInput:function(parameterName){
        return parameterName=="Czas wyczekiwania kwestii i komentarzy specjalnych (w dniach)" ? false :true;
    },
    editVoteQuantityInput:function(parameterName){
        return parameterName=="Maksymalna ilość kwestii w głosowaniu" ? false :true;
    },
    editIssuePauseInput:function(parameterName){
        return parameterName=="Częstotliwość dodania kwestii (w minutach)" ? false :true;
    },
    editCommentPauseInput:function(parameterName){
        return parameterName=="Częstotliwość dodania komentarza (w minutach)" ? false :true;
    },
    editReferencePauseInput:function(parameterName){
        return parameterName=="Częstotliwość dodania odniesienia (w minutach)" ? false :true;
    },
    editRRDurationInput:function(parameterName){
        return parameterName=="Okres składania Raportów Realizacyjnych (w dniach)" ? false :true;
    }
});

Template.editParametrModalInner.events({
    'click .btn-danger': function (e) {
        e.preventDefault();
        Session.setPersistent("chosenParameterSession",null);
        $("#editParametrMod").modal("hide");
    },
    'submit form':function(e){
        console.log("success");//submit form
        e.preventDefault();//click .btn-success
        if ($('#parametrFormEditModal').valid()) {
            $('.btn-success').css("visibility", "hidden");
            var odp = checkIssueGlobalParamExists();
            if (odp == true) {
                bootbox.alert("Przepraszamy, istnieje już kwestia dotycząca zmiany parametru globalnego!");
                $("#editParametrMod").modal("hide");
                document.getElementById("parametrFormEditModal").reset();
            }
            else {
                var session = Session.get("chosenParameterSession");
                console.log(session.name);
                console.log(session.title);
                console.log(session.value);
                console.log();

                var val = session.name;
                var newValue = document.getElementById("param").value;
                console.log(newValue);
                console.log(document.getElementById("param").name);
                if (newValue == null || newValue.trim() == "") {
                    GlobalNotification.error({
                        title: 'Przepraszamy',
                        content: "Pole " + session.title + " nie może być puste!",
                        duration: 3 // duration the notification should stay in seconds
                    });
                }
                else {
                    //document.getElementById("parametrFormEditModal").reset();
                    //document.getElementById(session.name).value=newValue;
                    parametrPreview(session.name, session.title, session.value, newValue);
                }
            }
            $('.btn-success').css("visibility", "visible");
        }

    }
});

parametrPreview=function(paramName,title,oldValue,newValue){
    bootbox.dialog({
        message: '<p class="bg-warning padding-15 color-red"><b>' + 'Zamierzasz dokonać następujących zmian:' + '</b></p>' +
        '<p>' + 'Proponuję zmianę zawartości w ' + '<b>' + title.toUpperCase() + '</b>' + ' z wartości' + '</p>' +
        '<p>' + oldValue + '</p>' +
        '<p>' + 'na' + '</p>' +
        '<p>' + newValue + '</p>',
        title: "Uwaga",
        closeButton: false,
        buttons: {
            success: {
                label: "Zgadzam się",
                className: "btn-success successBtn",
                callback: function () {
                    $('.successBtn').css("visibility", "hidden");
                    var odp=checkIssueGlobalParamExists();
                    if(odp==true){
                        bootbox.alert("Przepraszamy, istnieje już kwestia dotycząca zmiany parametru globalnego!");
                        $("#editParametrMod").modal("hide");
                    }
                    else
                        createIssueChangeParam(paramName, title, oldValue, newValue);
                    $('.successBtn').css("visibility", "visible");
                }
            },
            danger: {
                label: "Rezygnuję",
                className: "btn-danger",
                callback: function () {
                    $('.btn-success2').css("visibility", "visible");
                }
            }
        }
    });
};

createIssueChangeParam=function(paramName,title,oldValue,newValue){
    console.log("param name");
    console.log(paramName);
    var params=Parametr.findOne();
    var nazwaOrg=params.nazwaOrganizacji;
    var terytorium=params.terytorium;
    var kontakty=params.kontakty;
    var reg=params.regulamin;
    var voteDur=params.voteDuration;
    var voteQuan=params.voteQuantity;
    var czasWycz=params.czasWyczekiwaniaKwestiiSpecjalnej;
    var issuePause=params.addIssuePause;
    var commPause=params.addCommentPause;
    var refPause=params.addReferencePause;
    var okresSkladaniaRR=params.okresSkladaniaRR;

    switch(paramName){
        case "nazwaOrganizacji":nazwaOrg=newValue;break;
        case "terytorium":terytorium=newValue;break;
        case "kontakty":kontakty=newValue;break;
        case "regulamin":reg=newValue;break;
        case "voteDuration":voteDur=newValue;break;
        case "voteQuantity":voteQuan=newValue;break;
        case "czasWyczekiwaniaKwestiiSpecjalnej":czasWycz=newValue;break;
        case "addIssuePause":issuePause=newValue;break;
        case "addCommentPause":commPause=newValue;break;
        case "addReferencePause":refPause=newValue;break;
        case "okresSkladaniaRR":okresSkladaniaRR=newValue;break;
    }
    var addParamDraft =
    {
        nazwaOrganizacji: nazwaOrg,
        terytorium: terytorium,
        kontakty: kontakty,
        regulamin: reg,
        voteDuration:voteDur,
        voteQuantity:voteQuan,
        czasWyczekiwaniaKwestiiSpecjalnej:czasWycz,
        addIssuePause:issuePause,
        addCommentPause:commPause,
        addReferencePause:refPause,
        okresSkladaniaRR:okresSkladaniaRR
    };
    console.log(addParamDraft);
    Meteor.call('addParametrDraft', addParamDraft, function (error,ret) {
        if (!error) {
            var dataParams={
                title:title.toUpperCase(),
                oldValue:oldValue,
                newValue:newValue
            }
            var newKwestia = [
                {
                    idUser: Meteor.userId(),
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: 'Propozycja zmiany parametru globalnego  przez ' +Meteor.user().profile.firstName +"  "+ Meteor.user().profile.lastName ,
                    wartoscPriorytetu: 0,
                    dataGlosowania: null,
                    krotkaTresc: 'Propozycja zmiany parametrów globalnego' ,
                    szczegolowaTresc: dataParams,
                    isOption: false,
                    status: KWESTIA_STATUS.ADMINISTROWANA,
                    idParametr : ret,
                    typ:KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE
                }];

            Meteor.call('addKwestiaADMINISTROWANA', newKwestia, function (error,ret) {
               if(error)
                console.log(error.reason);
                else {
                   addPowiadomienieGlobalneFunction(ret);
                   Meteor.call("sendEmailAddedIssue", ret);
               }
            });
        }
    });
    Session.setPersistent("chosenParameterSession",null);
    $("#editParametrMod").modal("hide");
};

addPowiadomienieGlobalneFunction=function(idKwestia){
    var users=Users.find({'profile.userType':USERTYPE.CZLONEK});
    var kwestia=Kwestia.findOne({_id:idKwestia});
    users.forEach(function(user){
        var newPowiadomienie ={
            idOdbiorca: user._id,
            idNadawca: null,
            dataWprowadzenia: kwestia.dataWprowadzenia,
            tytul: "",
            powiadomienieTyp: NOTIFICATION_TYPE.NEW_ISSUE,
            tresc: "",
            idKwestia:idKwestia,
            czyAktywny: true,
            czyOdczytany:false
        };
        Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
            if(error)
                console.log(error.reason);
        })
    });

};

checkIssueGlobalParamExists=function(){
    var kwestie=Kwestia.find({typ:KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE, czyAktywny:true,
        status:{$nin:[KWESTIA_STATUS.ZREALIZOWANA]}});
    return kwestie.count()>0? true : false;
};