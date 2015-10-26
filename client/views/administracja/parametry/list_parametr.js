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