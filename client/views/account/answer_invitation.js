Template.answerInvitation.helpers({
    notActivatedAccount:function(){
        var currentRoute=Router.current().params;
        console.log("current route");
        console.log(currentRoute.linkAktywacyjny);
        var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
        if(userDraft)
            return userDraft.czyAktywny==true || userDraft.licznikKlikniec<=1 ? true : false;
        return true;
    },
    userNotAnswered:function(){
        var currentRoute=Router.current().params;
        var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
        var kwestia=getKwestia(currentRoute);
        console.log("hiere");
        console.log(kwestia);
        if(kwestia)
            return kwestia.status==KWESTIA_STATUS.OCZEKUJACA && kwestia.czyAktywny==true && userDraft.czyAktywny==true ? true : false;
    },
    timeExpired:function(){
        var kwestia=getKwestia(Router.current().params);
        var param=Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej;
        console.log("time");

        console.log(moment(kwestia.dataRozpoczeciaOczekiwania).add("hours",param).format());
        console.log(moment(new Date()).format());
        return (moment(kwestia.dataRozpoczeciaOczekiwania).add("hours",param).format() < moment(new Date()).format()) ? true : false;

    },
    fullName:function(){
        var userDraft=getUserDraft(Router.current().params);
        return userDraft.profile.firstName+" "+userDraft.profile.lastName;
    },
    position:function(){
        var userDraft=getUserDraft(Router.current().params);
        if(userDraft.profile.userType==USERTYPE.HONOROWY)
        return "cz³onka honorowego";
    }
});

getKwestia=function(currentRoute){
    console.log("get");
    console.log(currentRoute);
    var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
    kwestia=Kwestia.findOne({idUser:userDraft._id});
    return kwestia? kwestia: null;
};
getUserDraft=function(currentRoute){
    var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
    return userDraft ? userDraft : null;
}