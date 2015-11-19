Template.notificationInfo.rendered=function(){
    var powiadomienie=Powiadomienie.findOne({_id:Template.instance().data._id});
    console.log("czy odczytany");
    if(powiadomienie.czyOdczytany==false)
        Meteor.call("setOdczytanePowiadomienie",powiadomienie._id,true,function(error){
            if(error)
                console.log(error.reason);
        });
};

Template.notificationInfo.helpers({
   notificationTopic:function(){
       return getTopicTypeNotification(this.powiadomienieTyp,this.idNadawca,this.idKwestia);
   },
    notificationTypeMessage:function(){
        return this.powiadomienieTyp==NOTIFICATION_TYPE.MESSAGE_FROM_USER ? true : false;
    },
    notificationTypeNewIssue:function(){
        return this.powiadomienieTyp==NOTIFICATION_TYPE.NEW_ISSUE ? true : false;
    },
    notificationTypeLobbingMessage:function(){
        return this.powiadomienieTyp==NOTIFICATION_TYPE.LOOBBING_MESSAGE ? true : false;
    },
    notificationTypeHonorowyInvitation:function(){
        return this.powiadomienieTyp==NOTIFICATION_TYPE.HONOROWY_INVITATION ? true : false;
    },
    notificationTypeVoteStarted:function(){
        return this.powiadomienieTyp==NOTIFICATION_TYPE.VOTE_BEGINNING ? true : false;
    },
    notificationTypeApplicationConfirmationAcceptedRejected:function(){
        return _.contains([NOTIFICATION_TYPE.APPLICATION_CONFIRMATION,NOTIFICATION_TYPE.APPLICATION_ACCEPTED,
            NOTIFICATION_TYPE.APPLICATION_REJECTED ],this.powiadomienieTyp)? true : false;
    }
});

Template.notificationInfo.events({
   'click #backToNotificationList':function(e){
       e.preventDefault();
       Router.go("notification_list");
   }
});
Template.notificationNewMessage.helpers({
    powiadomienie:function(idPowiadomienie){
        return getNotification(idPowiadomienie);
    },
    dataWprowadzenia:function(){
        return formatDate(this.dataWprowadzenia);
    },
    sender:function(){
        var user=Users.findOne({_id:this.idNadawca});
        return user? user.profile.fullName : null;
    },
    welcomeGender:function(){
        return recognizeSexMethod(Meteor.user());
    },
    userData:function(){
        return Meteor.user().profile.fullName;
    },
    organisationName:function(){
        return Parametr.findOne().nazwaOrganizacji;
    }
});
Template.notificationNewIssue.helpers({
    powiadomienie:function(idPowiadomienie){
        return getNotification(idPowiadomienie);
    },
    actualKwestia:function(idKwestia){
        return getIssue(idKwestia);
    },
    welcomeGender:function(){
        return recognizeSexMethod(Meteor.user());
    },
    userData:function(){
        return Meteor.user().profile.fullName;
    },
    organisationName:function(){
        return Parametr.findOne().nazwaOrganizacji;
    },
    temat:function(){
        if(this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return "techniczna systemowa";
        else
        var temat=Temat.findOne({_id:this.idTemat});
        return temat? temat.nazwaTemat : "";
    },
    rodzaj:function(){
        if(this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return "techniczna systemowa";
        else
            var rodzaj=Rodzaj.findOne({_id:this.idRodzaj});
        return rodzaj? rodzaj.nazwaRodzaj : "";
    }
});

Template.notificationApplicationAnswer.helpers({
    powiadomienie:function(idPowiadomienie){
        return getNotification(idPowiadomienie);
    },
    actualKwestia:function(idKwestia){
        return getIssue(idKwestia);
    },
    welcomeGender:function(){
        return recognizeSexMethod(Meteor.user());
    },
    userData:function(){
        return Meteor.user().profile.fullName;
    },
    organisationName:function(){
        return Parametr.findOne().nazwaOrganizacji;
    },
    applicationConfirmation:function(){
        return this.powiadomienieTyp==NOTIFICATION_TYPE.APPLICATION_CONFIRMATION? true : false;
    },
    applicationRejected:function(){
        return this.powiadomienieTyp==NOTIFICATION_TYPE.APPLICATION_REJECTED? true : false;
    },
    userTypeData:function(){
        return this.typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY ? "Członka Zwyczajnego" : "Członka Honorowego";
    }
});

Template.notificationHonorowyInvitation.helpers({
    powiadomienie:function(idPowiadomienie){
        return getNotification(idPowiadomienie);
    },
    actualUserDraft:function(idUserDraft){
        return getUserDraft(idUserDraft);
    },
    userData:function(){
        return Meteor.user().profile.fullName;
    },
    organisationName:function(){
        return Parametr.findOne().nazwaOrganizacji;
    }
});

Template.notificationLobbingMessage.helpers({
    powiadomienie:function(idPowiadomienie){
        return getNotification(idPowiadomienie);
    },
    actualKwestia:function(idKwestia){
        return getIssue(idKwestia);
    },
    welcomeGender:function(){
        return recognizeSexMethod(Meteor.user());
    },
    userData:function(){
        return Meteor.user().profile.fullName;
    },
    organisationName:function(){
        return Parametr.findOne().nazwaOrganizacji;
    },
    sender:function(){
        var user=Users.findOne({_id:this.idNadawca});
        return user? user.profile.fullName : null;
    },
    temat:function(){
        if(this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return "techniczna systemowa";
        else
            var temat=Temat.findOne({_id:this.idTemat});
        return temat? temat.nazwaTemat : "";
    },
    rodzaj:function(){
        if(this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return "techniczna systemowa";
        else
            var rodzaj=Rodzaj.findOne({_id:this.idRodzaj});
        return rodzaj? rodzaj.nazwaRodzaj : "";
    }
});

formatDate=function(date){
    return moment(date).format("DD-MM-YYYY, HH:mm");
};
getNotification=function(idPowiadomienie){
    return Powiadomienie.findOne({_id:idPowiadomienie}) ? Powiadomienie.findOne({_id:idPowiadomienie}) :null;
};
getIssue=function(idKwestia){
    return Kwestia.findOne({_id:idKwestia}) ? Kwestia.findOne({_id:idKwestia}) :null;
};
getUserDraft=function(idUserDraft){
    return UsersDraft.findOne({_id:idUserDraft}) ? UsersDraft.findOne({_id:idUserDraft}) :null;
};