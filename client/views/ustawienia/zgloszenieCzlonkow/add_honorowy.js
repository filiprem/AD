Template.addHonorowy.rendered=function(){

    $("#honorowyForm").validate({
        rules: {
            email: {
                email: true,
                checkExistsAnyEmail: true,
                checkExistsEmailDraft:true
            },
            pesel:{
                exactlength: 11,
                peselValidation:true
            }
        },
        messages: {
            email: {
                required: fieldEmptyMessage(),
                email: validEmailMessage()
            },
            firstName: {
                required: fieldEmptyMessage()
            },
            lastName: {
                required: fieldEmptyMessage()
            },
            personChosen: {
                required: fieldEmptyMessage()
            },
            personChosen1: {
                required: fieldEmptyMessage()
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
    'change #chooseOption': function (e) {
        console.log("change!!");
        var value=$(e.target).val();
        if(value=="chooseNewOption"){
            $("#listDoradcy").modal("hide");
            document.getElementById("chooseNewOptionSelect").style.display="block";
            document.getElementById("chosenCandidate").style.display="none";
        }
        else {
            $("#listDoradcy").modal("show");
            document.getElementById("chooseNewOptionSelect").style.display="none";
            document.getElementById("chosenCandidate").style.display="block";
        }
    },
    'click #changeChosenPerson':function(e){
        e.preventDefault();
        $("#listDoradcy").modal("show");
    },
    'submit form':function(e){
        e.preventDefault();

        if(document.getElementById("chooseNewOptionSelect").style.display=="block"){//kwestia z gościem
            console.log("kwestia guest");
            var newUserDraft = [
                {
                    email: $(e.target).find('[name=email]').val(),
                    login: "",
                    firstName: $(e.target).find('[name=firstName]').val(),
                    lastName: $(e.target).find('[name=lastName]').val(),
                    role: 'user',
                    uwagi: $(e.target).find('[name=uzasadnienie]').val(),
                    userType: USERTYPE.HONOROWY,
                    pesel:"",
                    licznikKlikniec:0
                }];
            addUserDraftHonorowy(newUserDraft);
        }
        else{
            console.log("kwestia existing");
            var chosenPersonId=document.getElementById("chosenDor").value;
            console.log(chosenPersonId);
            var user=Users.findOne({_id:chosenPersonId});
            var newUserDraft = [
                {
                    email: user.emails[0].address,
                    login: user.username,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    role: 'user',
                    uwagi: $(e.target).find('[name=uzasadnienie]').val(),
                    userType: USERTYPE.HONOROWY,
                    pesel:"",
                    idUser:chosenPersonId,
                    licznikKlikniec:0
                }];
            addUserDraftHonorowy(newUserDraft);
        }
    },
    'reset form':function(e){
        //e.preventDefault();
        //selectedOption.set("chooseNewOption");
        document.getElementById("chooseNewOptionSelect").style.display="block";
        document.getElementById("chosenCandidate").style.display="none";
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
            var daneAplikanta = {
                fullName: newUser[0].firstName + " " + newUser[0].lastName,
                email: newUser[0].email,
                uwagi: newUser[0].uwagi
            };
            var newKwestia = [
                {
                    idUser: idUserDraft,
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: 'Aplikowanie na stanowisko członka honorowego- ' + newUser[0].firstName + " " + newUser[0].lastName,
                    wartoscPriorytetu: 0,
                    wartoscPriorytetuWRealizacji: 0,
                    sredniaPriorytet: 0,
                    idTemat: Temat.findOne({})._id,
                    idRodzaj: Rodzaj.findOne({})._id,
                    idZespolRealizacyjny: ret,
                    dataGlosowania: null,
                    krotkaTresc: 'Aplikowanie do systemu na stanowisko członka honorowego',
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
                    przyjecieWnioskuHonorowyConfirmation(Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej, daneAplikanta.email, "członek honorowy");
                    var user = UsersDraft.findOne({_id: idUserDraft});
                    //Meteor.call("sendApplicationConfirmation", user);
                }
            });
        }
    });
};