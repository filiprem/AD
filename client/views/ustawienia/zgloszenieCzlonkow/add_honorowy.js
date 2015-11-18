Template.addHonorowy.rendered=function(){

    $("#honorowyForm").validate({
        rules: {
            email: {
                email: true,
                checkExistsEmailZwyczajny: true,
                checkExistsEmailDraft:true
            }
        },
        messages: {
            email: {
                required: fieldEmptyMessage(),
                email: validEmailMessage()
            },
            uzasadnienie: {
                required: fieldEmptyMessage()
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
    });
};
Template.addHonorowy.events({
    'submit form':function(e){
        e.preventDefault();
        var idUser=null;
        var email=$(e.target).find('[name=email]').val();
        var users=Users.find({'profile.userType':USERTYPE.DORADCA});
        users.forEach(function(user){
            if(user.emails[0].address==email)
                idUser=user._id;
        });
        console.log("id user!");
        console.log(idUser);

        var newUserDraft = [
            {
                email: email,
                login: "",
                firstName: "",
                lastName: "",
                role: 'user',
                uwagi: $(e.target).find('[name=uzasadnienie]').val(),
                userType: USERTYPE.HONOROWY,
                pesel:"",
                idUser:idUser,
                licznikKlikniec:0
            }];
        addUserDraftHonorowy(newUserDraft);
    },
    'reset form':function(e){

    }
});
addUserDraftHonorowy=function(newUser){
    console.log("add user draft");
    console.log(newUser);
    Meteor.call('addUserDraft', newUser, function (error, ret) {
        if (error) {
            console.log(error.reason);
        }
        else {
            addKwestiaOsobowaHonorowy(ret, newUser);
        }
    });
};
addKwestiaOsobowaHonorowy=function(idUserDraft,newUser){
    var ZR=ZespolRealizacyjny.findOne();
    var newZR=[{
        nazwa:ZR.nazwa,
        idZR:ZR._id,
        zespol:ZR.zespol
    }];
    Meteor.call('addZespolRealizacyjnyDraft', newZR, function (error,ret) {
        if (error) {
            console.log(error.reason);
        }
        else {
            var fullName=null;
            if(newUser[0].idUser!=null){
                var user=Users.findOne({_id:newUser[0].idUser});
                fullName=user.profile.fullName;
            }
            var daneAplikanta = {
                fullName: fullName,
                email: newUser[0].email,
                uwagi: newUser[0].uwagi
            };
            var newKwestia = [
                {
                    idUser: idUserDraft,
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: 'Aplikowanie na stanowisko członka honorowego' ,
                    wartoscPriorytetu: 0,
                    wartoscPriorytetuWRealizacji: 0,
                    sredniaPriorytet: 0,
                    idTemat: Temat.findOne({})._id,
                    idRodzaj: Rodzaj.findOne({})._id,
                    idZespolRealizacyjny: ret,
                    dataGlosowania: null,
                    krotkaTresc: 'Aplikowanie do systemu na stanowisko Członka Honorowego '+ newUser[0].email,
                    szczegolowaTresc: daneAplikanta,
                    isOption: false,
                    status: KWESTIA_STATUS.STATUSOWA,
                    typ: KWESTIA_TYPE.ACCESS_HONOROWY,
                    idZglaszajacego:Meteor.userId()
                }];
            console.log("add kwestia");
            console.log(newKwestia);
            Meteor.call('addKwestiaStatusowa', newKwestia, function (error, ret) {
                if (error) {
                    // optionally use a meteor errors package
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        //if(error.error === 409)
                        throwError(error.reason);
                    }
                }
                else {
                    Router.go("home");
                    addPowiadomienieAplikacjaIssueFunction(ret,newKwestia[0].dataWprowadzenia);
                    przyjecieWnioskuHonorowyConfirmation(Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej, daneAplikanta.email, "członek honorowy");
                    var user = UsersDraft.findOne({_id: idUserDraft});
                    //Meteor.call("sendApplicationConfirmation", user,function(error){
                       // if(!error)
                            Meteor.call("sendEmailAddedIssue", ret);
                    //});
                }
            });
        }
    });
};