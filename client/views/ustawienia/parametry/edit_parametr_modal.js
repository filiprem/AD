Template.editParametrModalInner.rendered=function(){
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
        return Session.get('chosenParameterSession');
    },
    NoStatutKontaktInput:function(parameterName){
        console.log("check");
        return parameterName=="Statut" || parameterName=="Kontakty" ? false :true;
    }
});

Template.editParametrModalInner.events({
    'click .btn-danger': function (e) {
        e.preventDefault();
        console.log("tu weszło");
        Session.setPersistent("chosenParameterSession",null);
        $("#editParametrMod").modal("hide");
    },
    'click .btn-success':function(e){
        console.log("success");
        e.preventDefault();
        var session=Session.get("chosenParameterSession");
        console.log(session.name);
        console.log(session.title);
        console.log(session.value);
        console.log();

        var val=session.name;
        var newValue=document.getElementById("param").value;
        console.log(newValue);
        console.log(document.getElementById("param").name);
        if(newValue==null || newValue.trim()==""){
            GlobalNotification.error({
                title: 'Przepraszamy',
                content: "Pole "+ session.title+ " nie może być puste!",
                duration: 3 // duration the notification should stay in seconds
            });
        }
        else
            parametrPreview(session.name,session.title,session.value,newValue);
    }
});

parametrPreview=function(paramName,title,oldValue,newValue){
    bootbox.dialog({
        message:
        '<p class="bg-warning padding-15 color-red"><b>'+'Zamierzasz dokonać następujących zmian:'+'</b></p>'+
        '<p>'+'Proponuję zmianę zawartości w '+'<b>'+title.toUpperCase()+'</b>'+' z wartości'+'</p>'+
        '<p>'+oldValue+'</p>'+
        '<p>'+'na'+'</p>'+
        '<p>'+newValue+'</p>',
        title: "Uwaga",
        closeButton:false,
        buttons: {
            success: {
                label: "Zgadzam się",
                className: "btn-success",
                callback: function() {
                    createIssueChangeParam(paramName,title,oldValue,newValue);
                }
            },
            danger: {
                label: "Rezygnuję",
                className: "btn-danger",
                callback: function() {

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