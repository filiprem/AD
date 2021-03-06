Template.czlonekZwyczajnyForm.rendered = function () {
    document.getElementById("submitZwyczajny").disabled = false;

    $("#userForm").validate({
        rules: {
            email: {
                email: true
            },
            confirmPassword: {
                equalTo: "#inputPassword"
            },
            pesel:{
                exactlength: 11,
                peselValidation:true,
                peselValidation2:true
            },
            ZipCode:{
                kodPocztowyValidation:true
            },
            language:{
                isNotEmptyValue:true
            }
        },
        messages: {
            role: {
                required: fieldEmptyMessage()
            },
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
            address: {
                required: fieldEmptyMessage()
            },
            ZipCode: {
                required: fieldEmptyMessage()
            },
            pesel:{
                required:fieldEmptyMessage()
            },
            city:{
                required:fieldEmptyMessage()
            },
            statutConfirmation:{
                required:fieldEmptyMessage()
            },
            language:{
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
            if(element.attr("name") == "statutConfirmation")
                error.insertAfter(document.getElementById("statutConfirmationSpan"));
            else
                validationPlacementError(error, element);
        }
    });
};

Template.czlonekZwyczajnyForm.events({
    'submit form': function (e) {
        e.preventDefault();

        if ($('#userForm').valid()) {
            document.getElementById("submitZwyczajny").disabled = true;
            var email=$(e.target).find('[name=email]').val();

            Meteor.call("serverCheckExistsUserDraft",email, function (error, ret) {
                if (error) {
                    throwError(error.reason);
                }
                else {
                    if(ret == false) {
                        var idUser=null;
                        if (Meteor.userId())
                            idUser = Meteor.userId();
                        var firstName = $(e.target).find('[name=firstName]').val();
                        var lastName = $(e.target).find('[name=lastName]').val();
                        var newUser = [
                            {
                                email: $(e.target).find('[name=email]').val(),
                                login: "",
                                firstName: firstName,
                                lastName: lastName,
                                address: $(e.target).find('[name=address]').val(),
                                zip: $(e.target).find('[name=ZipCode]').val(),
                                role: 'user',
                                userType: USERTYPE.CZLONEK,
                                uwagi: $(e.target).find('[name=uwagi]').val(),
                                language: $(e.target).find('[name=language]').val(),
                                isExpectant: false,
                                idUser: idUser,
                                city: $(e.target).find('[name=city]').val(),
                                pesel: $(e.target).find('[name=pesel]').val()
                            }];
                        if(Meteor.userId()){
                            addIssueOsobowa(newUser);
                        }
                        else {
                            Meteor.call('serverCheckExistsUser', email, USERTYPE.DORADCA, USERTYPE.HONOROWY, function (error, ret) {
                                if (error) {
                                    throwError(error.reason);
                                }
                                else {
                                    if (ret == false) {
                                        addIssueOsobowa(newUser);
                                    }
                                    else {
                                        throwError('Istnieje już w systemie podany użytkownik!');
                                        document.getElementById("submitZwyczajny").disabled = false;
                                        return false;
                                    }
                                }
                            });
                        }
                    }
                    else{
                        throwError('Został już złożony wniosek na podany adres email!');
                        document.getElementById("submitZwyczajny").disabled = false;
                        return false;
                    }
                }
            });
        }
    },
    'reset form': function () {
        Router.go('home');
    },
    'click #statutBootbox':function(){
        bootbox.dialog({
            message: getRegulamin(),
            //TAP.i18n("_ addKwestiaForm.legend"),
            title: "Statut organizacji "+getNazwaOrganizacji(),
            buttons: {
                main: {
                    label: "Ok",
                    className: "btn-primary"
                }
            }
        });
    }
});

Template.czlonekZwyczajnyForm.helpers({
    'getLanguages':function(){
        return Languages.find({});
    },
    email: function () {
        return getEmail(this);
    },
    isNotEmpty: function () {
        return Meteor.userId() ? "disabled" : "";
    },
    nazwaOrganizacji:function(){
        return Parametr.findOne() ? Parametr.findOne().nazwaOrganizacji :"Aktywna Demokraca";
    }
});
getRegulamin=function(){
    return Parametr.findOne() ? Parametr.findOne().regulamin :"";
};
addIssueOsobowa=function(newUser){
    Meteor.call('serverCheckExistsUser', newUser[0].email, USERTYPE.CZLONEK, null, function (error, ret) {
        if (error) {
            throwError(error.reason);
        }
        else {
            if (ret == false) {
                var firstName = newUser[0].firstName;
                var lastName = newUser[0].lastName;
                Meteor.call("serverGenerateLogin", firstName, lastName, function (err, ret) {
                    if (!err) {

                        newUser[0].login = ret;
                        addUserDraft(newUser);
                    } else {
                        throwError(err.reason)
                    }
                });
            }
            else {
                throwError('Istnieje już w systemie podany użytkownik z pozycją, na którą aplikujesz!');
                document.getElementById("submitZwyczajny").disabled = false;
                return false;
            }
        }
    });
};
addUserDraft=function(newUser){
    Meteor.call('addUserDraft', newUser, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            }
            else {
                addKwestiaOsobowa(ret, newUser);
            }
        });
};
addKwestiaOsobowa=function(idUserDraft,newUser){
    var ZR=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"});
    var newZR=[{
        nazwa:ZR.nazwa,
        idZR:ZR._id,
        zespol:ZR.zespol
    }];
    Meteor.call('addZespolRealizacyjnyDraft', newZR, function (error,ret) {
        if (error) {
            throwError(error.reason);
        }
        else{
            var uwagi="";
            if(newUser[0].uwagi!=null)
                uwagi=newUser[0].uwagi;

            var daneAplikanta={
                fullName:newUser[0].firstName + " " + newUser[0].lastName,
                email:newUser[0].email,
                pesel:newUser[0].pesel,
                city:newUser[0].city,
                zip:newUser[0].zip,
                address:newUser[0].address,
                uwagi:uwagi
            };
            var newKwestia = [
                {
                    idUser: idUserDraft,
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: 'Aplikowanie- ' + newUser[0].firstName + " " + newUser[0].lastName,
                    wartoscPriorytetu: 0,
                    wartoscPriorytetuWRealizacji:0,
                    idTemat: Temat.findOne({})._id,
                    idRodzaj: Rodzaj.findOne({})._id,
                    idZespolRealizacyjny:ret,
                    dataGlosowania: null,
                    krotkaTresc: 'Aplikacja o przyjęcie do systemu jako ' + newUser[0].userType,
                    szczegolowaTresc: daneAplikanta,
                    isOption: false,
                    status: KWESTIA_STATUS.OSOBOWA,
                    typ:KWESTIA_TYPE.ACCESS_ZWYCZAJNY
                }];
            Meteor.call('addKwestiaOsobowa', newKwestia, function (error,ret) {
                if (error) {
                    throwError(error.reason);
                }
                else {
                    if(Meteor.userId())
                        Router.go("administracjaUserMain");
                    else
                        Router.go("home");
                    przyjecieWnioskuConfirmation(Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej,daneAplikanta.email,"członkowstwo");
                    addPowiadomienieAplikacjaIssueFunction(ret,newKwestia[0].dataWprowadzenia);
                    if(newUser[0].idUser!=null){//jezeli istnieje juz ten użtykownik,jest doradcą,to wyślij mu confirmation w powiad
                        addPowiadomienieAplikacjaRespondFunction(ret,newKwestia[0].dataWprowadzenia,NOTIFICATION_TYPE.APPLICATION_CONFIRMATION);
                    }
                    Meteor.call("sendApplicationConfirmation", idUserDraft,function(error){
                        if(!error) {
                            Meteor.call("sendEmailAddedIssue", ret, function(error) {
                                if(error){
                                    var emailError = {
                                        idIssue: ret,
                                        type: NOTIFICATION_TYPE.NEW_ISSUE
                                    };
                                    Meteor.call("addEmailError", emailError);
                                }
                            } );
                        }else{
                            var emailError = {
                                idIssue: ret,
                                idUserDraft: idUserDraft,
                                type: NOTIFICATION_TYPE.APPLICATION_CONFIRMATION
                            };
                            Meteor.call("addEmailError", emailError);
                        }
                    });
                }
            });
        }
    });


};

addPowiadomienieAplikacjaIssueFunction=function(idKwestia,dataWprowadzenia){
    var users=Users.find({'profile.userType':USERTYPE.CZLONEK});
    var idNadawca=null;
    if(Meteor.userId())
        idNadawca=Meteor.userId();
    users.forEach(function(user){
        var newPowiadomienie ={
            idOdbiorca: user._id,
            idNadawca: idNadawca,
            dataWprowadzenia: dataWprowadzenia,
            tytul: "",
            powiadomienieTyp: NOTIFICATION_TYPE.NEW_ISSUE,
            tresc: "",
            idKwestia:idKwestia,
            czyAktywny: true,
            czyOdczytany:false
        };
        Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
            if(error)
                throwError(error.reason);
        })
    });
};

addPowiadomienieAplikacjaRespondFunction=function(idKwestia,dataWprowadzenia,typ){
    var newPowiadomienie ={
        idOdbiorca: Meteor.userId(),
        idNadawca: null,
        dataWprowadzenia: dataWprowadzenia,
        tytul: "",
        powiadomienieTyp: typ,
        tresc: "",
        idKwestia:idKwestia,
        czyAktywny: true,
        czyOdczytany:false
    };
    Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
        if(error)
            throwError(error.reason);
    });
};