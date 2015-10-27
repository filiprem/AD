Template.kwestiaDetails.helpers({
    protectorZR:function(){
        if(!Meteor.userId()) return false;
        var zr=ZespolRealizacyjny.findOne();
        if(zr){
            if(zr.protector)
                return zr.protector==Meteor.userId() ? true : false;
        }
    },
    isOsobowa: function (status) {
        if (status == KWESTIA_STATUS.OSOBOWA)
            return true;
        else
            return false;
    }
});