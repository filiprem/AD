Template.kwestiaDetails.helpers({
    protectorZR:function(){
        if(!Meteor.userId()) return false;
        var zr=ZespolRealizacyjny.findOne();
        if(zr){
            if(zr.protector)
                return zr.protector==Meteor.userId() ? true : false;
        }
    },
    isOsobowa: function (typ) {
        if (_.contains([KWESTIA_TYPE.ACCESS_ZWYCZAJNY,KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_HONOROWY],typ))
            return true;
        else
            return false;
    },
    isHonorowyType:function(typ){
        console.log("mrrrr");
        console.log(typ);
        return typ==KWESTIA_TYPE.ACCESS_HONOROWY ? true: false;
    }
});