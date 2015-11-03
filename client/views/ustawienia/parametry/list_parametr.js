Template.listParametr.helpers({
    isUserCzlonek:function(){
        return Meteor.user().profile.userType == USERTYPE.CZLONEK ? true : false;
    },
    noKwestiaParameters:function(){
        var kwestie=Kwestia.find({typ:KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE, czyAktywny:true,
            status:{$nin:[KWESTIA_STATUS.ZREALIZOWANA]}});
        return kwestie.count()>0 ? false : true;
    }
});
Template.listParametr.events({
   'click #parametersClick':function(e){
       e.preventDefault();
       var kwestia=Kwestia.findOne({typ:KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE,
           czyAktywny:true,status:{$nin:[KWESTIA_STATUS.ZREALIZOWANA]}});
       if(kwestia){
           var path=null;
           if(kwestia.status==KWESTIA_STATUS.ARCHIWALNA)
                path="/archive_issue_info/"+kwestia._id;
           else
                path="/issue_info/"+kwestia._id;
           Router.go(path);
       }
   }
});