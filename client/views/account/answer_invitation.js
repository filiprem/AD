Template.answerInvitation.rendered=function(){
    var userDraft=getUserDraft(Router.current().params);
    var kwestia=getKwestia(Router.current().params);
    var licznik=userDraft.licznikKlikniec+1;
    if(kwestia.isAnswerPositive!=null) {
        console.log('tu weszło');
        Meteor.call("updateLicznikKlikniec", userDraft._id, licznik, function (error) {
            if (error)
                console.log(error.reason);
        });
    }
},
Template.answerInvitation.helpers({
    userNotAnswered:function(){
        var currentRoute=Router.current().params;
        var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
        var kwestia=getKwestia(currentRoute);
        console.log("hiere");
        console.log(kwestia);
        console.log(kwestia.isAnswerPositive);
        if(kwestia) {
            //return kwestia.status==KWESTIA_STATUS.OCZEKUJACA && kwestia.czyAktywny==true && userDraft.czyAktywny==true ? true : false;
            return kwestia.isAnswerPositive==null ? true: false;
        }
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
        console.log(userDraft.profile.userType);
        if(userDraft.profile.userType==USERTYPE.HONOROWY)
        return "członka honorowego";
    },
    organizationName:function(){
        return Parametr.findOne().nazwaOrganizacji ? Parametr.findOne().nazwaOrganizacji : null;
    },
    answeredNow:function(){
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraft(Router.current().params);
        return (kwestia.isAnswerPositive==true || kwestia.isAnswerPositive==false) && userDraft.licznikKlikniec<=1 ? true : false;
    },
    ansPos:function(){
        var kwestia=getKwestia(Router.current().params);
        return kwestia.isAnswerPositive==true? true:false;
    },
    answerPositive:function(){
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraft(Router.current().params);
        return kwestia.isAnswerPositive==true &&  userDraft.licznikKlikniec>1  ? true : false;
    },
    answerNegative:function(){
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraft(Router.current().params);
        return kwestia.isAnswerPositive==false &&  userDraft.licznikKlikniec>1  ? true : false;
    },
    url:function(){
        var userDraft=getUserDraft(Router.current().params);
        return("/issueInfo/")
    },
    actualKwestia:function(){
        return getKwestia(Router.current().params);
    }
});
Template.answerInvitation.events({
   'click #apply':function(e){
       e.preventDefault();//kwestia idzie do realizacji
       var kwestia=getKwestia(Router.current().params);
       kwestia.dataRealizacji = new Date();
       kwestia.numerUchwaly = nadawanieNumeruUchwalyMethod(kwestia.dataRealizacji);
       var idZr=kwestia.idZespolRealizacyjny;
       var zrDraft = ZespolRealizacyjnyDraft.findOne({_id: kwestia.idZespolRealizacyjny});
       if (zrDraft.idZR != null) {//jezeli draft ma id ZR( kopiuje od istniejącego ZR), to dopisz do kisty ZR tego drafta
           var ZR = ZespolRealizacyjny.findOne({_id: zrDraft.idZR});
           if(ZR) {
               console.log("updetujemy zr istniejący");
               updateListKwestieMethod(ZR, kwestia._id);
           }
           else {
               createNewZRMethod(zrDraft, kwestia);
           }
       }
       else {
           createNewZRMethod(zrDraft, kwestia);
       }

       Meteor.call('removeZespolRealizacyjnyDraft',kwestia.idZespolRealizacyjny,function(error){
           if(!error){
               var userDraft=getUserDraft(Router.current().params);
               var counter=userDraft.licznikKlikniec+1;
                Meteor.call("updateLicznikKlikniec",userDraft._id,counter,function(error){
                    if(!error)
                        Meteor.call("setAnswerKwestiaOczekujaca",kwestia._id,true);
                });
           }
       });
   },
    'click #refuse':function(e){
        e.preventDefault();
        //kwestia idzie do kosza,przepisz ZR
        //dodać pole reason
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraft(Router.current().params);

        console.log("draft!!");
        console.log(userDraft);
        console.log(userDraft.licznikKlikniec);
        Meteor.call('removeKwestiaSetReasonAnswer', kwestia._id,KWESTIA_ACTION.INVITATION_HONOROWY_REJECTED,false,function(error) {
            if(!error) {
                if (kwestia.idZespolRealizacyjny) {
                    var zrDraft=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
                    Meteor.call("removeZespolRealizacyjnyDraft",kwestia.idZespolRealizacyjny,function(error){
                       if(!error) {
                           rewriteZRMembersToListMethod(zrDraft, kwestia);
                           var licznik=userDraft.licznikKlikniec+1;

                           Meteor.call("removeUserDraftNotZrealizowanyLicznik", userDraft._id,licznik,function(error){
                               if(error)
                                    console.log(error.reason);
                           });
                       }
                    });
                }
            }
            else
                console.log(error.reason);
        });
    }
});
getKwestia=function(currentRoute){
    console.log("get");
    console.log(currentRoute);
    var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
    var kwestia=Kwestia.findOne({idUser:userDraft._id});
    return kwestia? kwestia: null;
};
getUserDraft=function(currentRoute){
    var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
    return userDraft ? userDraft : null;
};