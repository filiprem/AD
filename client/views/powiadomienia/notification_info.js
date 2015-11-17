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