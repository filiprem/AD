Template.doradcaForm.rendered = function () {
    document.getElementById("submitButton").disabled = false;
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    $("#doradcaFormApp").validate({
        rules: {
            email: {
                email: true,
                checkExistsEmail: USERTYPE.DORADCA,//czy juz nie ma mnie jako doradca w systemie
                checkExistsEmail2: USERTYPE.CZLONEK,//czy nie jestem wyzej
                checkExistsEmailDraft: true
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
            phone:{
                required:fieldEmptyMessage()
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
    })
};

Template.doradcaForm.events({
    'submit form': function (e) {
        e.preventDefault();
        if ($('#doradcaFormApp').valid()) {
            document.getElementById("submitButton").disabled = true;

            var idUser = null;
            if (Meteor.userId())
                idUser = Meteor.userId();
            var newUser = [
                {
                    email: $(e.target).find('[name=email]').val(),
                    login: "",
                    firstName: $(e.target).find('[name=firstName]').val(),
                    lastName: $(e.target).find('[name=lastName]').val(),
                    role: 'user',
                    city:$(e.target).find('[name=city]').val(),
                    userType: USERTYPE.DORADCA,
                    isExpectant: false,
                    uwagi: $(e.target).find('[name=uwagi]').val(),
                    pesel:""
                }];
            //-- generowanie loginu dla użytkownika
            newUser[0].login = generateLogin(newUser[0].firstName, newUser[0].lastName);

            addUserDraftDoradca(newUser);
        }
    },
    'reset form': function () {
        Router.go('home');
    }
});
addUserDraftDoradca=function(newUser){
    console.log("add user draft");
    console.log(newUser);
    Meteor.call('addUserDraft', newUser, function (error, ret) {
        if (error) {
            console.log(error.reason);
        }
        else {
            addKwestiaOsobowaDoradca(ret, newUser);
        }
    });
};
addKwestiaOsobowaDoradca=function(idUserDraft,newUser){
    var ZR=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"});
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
            var uwagi = "";
            if (newUser[0].uwagi != null)
                uwagi = newUser[0].uwagi;

            var daneAplikanta = {
                fullName: newUser[0].firstName + " " + newUser[0].lastName,
                email: newUser[0].email,
                city: newUser[0].city,
                uwagi: uwagi
            };
            var newKwestia = [
                {
                    idUser: idUserDraft,
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: 'Aplikowanie- ' + newUser[0].firstName + " " + newUser[0].lastName,
                    wartoscPriorytetu: 0,
                    wartoscPriorytetuWRealizacji: 0,
                    idTemat: Temat.findOne({})._id,
                    idRodzaj: Rodzaj.findOne({})._id,
                    idZespolRealizacyjny: ret,
                    dataGlosowania: null,
                    krotkaTresc: 'Aplikacja o przyjęcie do systemu jako ' + newUser[0].userType,
                    szczegolowaTresc: daneAplikanta,
                    isOption: false,
                    status: KWESTIA_STATUS.OSOBOWA,
                    typ: KWESTIA_TYPE.ACCESS_DORADCA
                }];
            console.log("add kwestia");
            console.log(newKwestia);
            Meteor.call('addKwestiaOsobowa', newKwestia, function (error, ret) {
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
                    if (Meteor.userId())
                        Router.go("administracjaUserMain");
                    else
                        Router.go("home");
                    addPowiadomienieAplikacjaIssueFunction(ret,newKwestia[0].dataWprowadzenia);
                    przyjecieWnioskuConfirmation(Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej, daneAplikanta.email, "doradztwo");
                    var user = UsersDraft.findOne({_id: idUserDraft});
                    Meteor.call("sendApplicationConfirmation", user,function(error){
                        if(!error)
                            Meteor.call("sendEmailAddedIssue", ret);
                    });
                }
            });
        }
    });
};
Template.doradcaForm.helpers({
    nazwaOrganizacji:function(){
        return Parametr.findOne() ? Parametr.findOne().nazwaOrganizacji :"Aktywna Demokracja";
    }
});