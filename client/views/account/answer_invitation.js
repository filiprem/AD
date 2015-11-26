Template.answerInvitation.rendered=function(){
    var userDraft=getUserDraftMethod(Router.current().params);
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
        var userDraft=getUserDraftMethod(Router.current().params);
        return userDraft.profile.firstName+" "+userDraft.profile.lastName;
    },
    position:function(){
        var userDraft=getUserDraftMethod(Router.current().params);
        console.log(userDraft.profile.userType);
        if(userDraft.profile.userType==USERTYPE.HONOROWY)
        return "członka honorowego";
    },
    organizationName:function(){
        return Parametr.findOne().nazwaOrganizacji ? Parametr.findOne().nazwaOrganizacji : null;
    },
    answeredNow:function(){
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraftMethod(Router.current().params);
        return (kwestia.isAnswerPositive==true || kwestia.isAnswerPositive==false) && userDraft.licznikKlikniec<=1 ? true : false;
    },
    ansPos:function(){
        var kwestia=getKwestia(Router.current().params);
        return kwestia.isAnswerPositive==true? true:false;
    },
    answerPositive:function(){
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraftMethod(Router.current().params);
        return kwestia.isAnswerPositive==true &&  userDraft.licznikKlikniec>1  ? true : false;
    },
    answerNegative:function(){
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraftMethod(Router.current().params);
        return kwestia.isAnswerPositive==false &&  userDraft.licznikKlikniec>1  ? true : false;
    },
    url:function(){
        var userDraft=getUserDraftMethod(Router.current().params);
        return("/issueInfo/")
    },
    actualKwestia:function(){
        return getKwestia(Router.current().params);
    },
    isGuest:function(){
        var userDraft=getUserDraftMethod(Router.current().params);
        return userDraft.profile.idUser==null ? true : false;
    }
});
Template.answerInvitation.events({
   'click #apply':function(e){
       e.preventDefault();//kwestia idzie do realizacji
       var kwestia=getKwestia(Router.current().params);

       if(kwestia.typ=KWESTIA_TYPE.ACCESS_HONOROWY){

           var userDraft=getUserDraftMethod(Router.current().params);
           //jezeli to jest istniejący doradca- email o wynku i update jego statusu
           if(userDraft.profile.idUser!=null){
               applyPositiveMethod(kwestia);
               Meteor.call("updateUserType",userDraft.profile.idUser,userDraft.profile.userType,function(error){
                   Meteor.call("sendApplicationAccepted", userDraft._id, "acceptExisting", function (error) {
                       (!error)
                       {
                           Meteor.call("removeUserDraft", userDraft._id);
                       }
                   });
               });
           }
           else{
                fillDataNewHonorowyBootbox(kwestia,userDraft.email);
           }
       }

   },
    'click #refuse':function(e){
        e.preventDefault();
        //kwestia idzie do kosza,przepisz ZR
        //dodać pole reason
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraftMethod(Router.current().params);

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
    console.log(userDraft);
    var kwestia=Kwestia.findOne({idUser:userDraft._id});
    return kwestia? kwestia: null;
};
getUserDraftMethod=function(currentRoute){
    var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
    return userDraft ? userDraft : null;
};

applyPositiveMethod=function(kwestia){
    console.log("apply positive");
    console.log(kwestia);
    console.log(kwestia.issueNumber);
    var nrUchw=kwestia.issueNumber;
    kwestia.dataRealizacji = new Date();
    kwestia.numerUchwaly = kwestia.issueNumber; //nadawanieNumeruUchwalyMethod(kwestia.dataRealizacji);
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
            var userDraft=getUserDraftMethod(Router.current().params);
            var counter=userDraft.licznikKlikniec+1;
            Meteor.call("updateLicznikKlikniec",userDraft._id,counter,function(error){
                if(!error)
                    Meteor.call("setAnswerKwestiaOczekujacaNrUchwDataRealizacji",kwestia._id,true,nrUchw,new Date(),function(error){
                        if(error)
                        console.log(error.reason);
                    });
            });
        }
    });
};

fillDataNewHonorowyBootbox=function(kwestia,email){
    //bootbox z danymi do uzupełnienia: imie,nazwisko,miasto
    //tutaj już następuje aktywacja konta
    // info,ze w kolejnym mailu dostanie dane do logowania

   // $("#fillDataHonorowy").modal("show");
    bootbox.dialog({
            title: "Aby uzyskać dostęp, należy uzupełnić wymagane pola.",
            closeButton:false,
            message:
            '<div class="row">  ' +
            '<div class="col-md-12"> ' +
            '<form class="form-horizontal"> ' +
            '<div class="form-group"> ' +
                '<label class="col-md-4 control-label" for="name">Imię</label> ' +
                '<div class="col-md-4"> ' +
                    '<input id="firstName" name="firstName" type="text"  class="form-control input-md"> ' +
                '</div> ' +
            '</div>'+
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">Nazwisko</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="lastName" name="lastName" type="text"  class="form-control input-md"> ' +
            '</div> ' +'</div>'+
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">Miasto</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="city" name="city" type="text"  class="form-control input-md"> ' +
            '</div> ' +'</div>'+
            '</form> ' +
            '</div>  ' +
            '</div>',
            buttons: {
                success: {
                    label: "Zapisz",
                    className: "btn-success",
                    callback: function () {
                        var firstName = $('#firstName').val();
                        var lastName=$('#lastName').val();
                        var city=$('#city').val();
                        console.log("dane:");
                        console.log(firstName);
                        console.log(lastName);
                        console.log(city);
                        if(firstName.trim()!='' && lastName.trim()!='' && city.trim()!=''){
                            $('.btn-success').css("visibility", "hidden");
                            addNewUser(firstName,lastName,city,email,kwestia);
                        }
                        else{
                            fillDataNewHonorowyBootbox(kwestia,email);
                            $('.btn-success').css("visibility", "visible");
                            GlobalNotification.error({
                                title: 'Błąd',
                                content: 'Formularz nie może zawierać pustych pól!',
                                duration: 3 // duration the notification should stay in seconds
                            });
                        }
                    }
                },
                main: {
                    label: "Wstecz",
                    className: "btn-primary"
                }
            }
        }
    );
};
addNewUser=function(firstName,lastName,city,email,kwestia){
    console.log("dane2:");
    console.log(firstName);
    console.log(lastName);
    console.log(city);
    applyPositiveMethod(kwestia);
    var newUser = [
        {
            email: email,
            login: "",
            firstName: firstName,
            lastName: lastName,
            city:city,
            userType:USERTYPE.HONOROWY

        }];
    newUser[0].login = generateLogin(firstName,lastName);
    newUser[0].fullName=firstName+" "+lastName;
    newUser[0].password=CryptoJS.MD5(newUser[0].login).toString();
    newUser[0].confirm_password=newUser[0].password;

    Meteor.call('addUser', newUser, function (error,ret) {
        if (error) {
            console.log(error.reason);
        }
        else {
            var idUser=ret;
            console.log("idUser");
            console.log(idUser);
            Meteor.call("removeUserDraftAddNewIdUser", getUserDraftMethod(Router.current().params)._id,idUser, function (error) {
                if (error)
                    console.log(error.reason);
                else{
                    Meteor.call("sendFirstLoginData",Users.findOne({_id:idUser}),newUser[0].password,function(error){
                        if(error)
                            console.log(error.reason);
                    })
                }
            });
        }
    });

    //var activationLink = CryptoJS.MD5(userDraft._id).toString();
    //if (userDraft) {
    //    Meteor.call("setZrealizowanyActivationHashUserDraft", userDraft._id, activationLink, true, function (error, ret) {
    //        (!error)
    //        {
    //            Meteor.call("sendApplicationAccepted", UsersDraft.findOne({_id: userDraft._id}), "acceptNew", function (error) {
    //                (!error)
    //                Meteor.call("updateLicznikKlikniec", userDraft._id, 0);
    //            });
    //        }
    //    });
    //}
};