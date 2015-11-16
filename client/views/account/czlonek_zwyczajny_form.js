Template.czlonekZwyczajnyForm.rendered = function () {
    $("#userForm").validate({
        rules: {
            email: {
                email: true,
                checkExistsEmail: USERTYPE.CZLONEK,
                checkExistsEmail2: USERTYPE.DORADCA,
                checkExistsEmailDraft: true
            },
            confirmPassword: {
                equalTo: "#inputPassword"
            },
            pesel:{
                exactlength: 11,
                peselValidation:true
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
        //sprawdzam,czy jest meteor.user
        //jeżeli jest,to znaczy,że : tworze nowego drafta,z akutanym userId.po akceptacji kwestii: jeżeli userId jest,to po tym userID przepisuję dane do usera,userDraft usuwam
        // jeżeli nie ma,to znaczy,że nowy draft->i dane są przepisywane do usera, po akceptacji kwestii:stworzony nowy użytkownik,userDraftUsunięty
        //kwestia ta sama z draftem zawsze!

        var idUser = null;
        if (Meteor.userId())
            idUser = Meteor.userId();
        var newUser = [
            {
                email: $(e.target).find('[name=email]').val(),
                login: "",
                firstName: $(e.target).find('[name=firstName]').val(),
                lastName: $(e.target).find('[name=lastName]').val(),
                address: $(e.target).find('[name=address]').val(),
                zip: $(e.target).find('[name=zipCode]').val(),
                role: 'user',
                userType: USERTYPE.CZLONEK,
                uwagi: $(e.target).find('[name=uwagi]').val(),
                language: $(e.target).find('[name=language]').val(),
                isExpectant: false,
                idUser: idUser,
                city:$(e.target).find('[name=city]').val(),
                pesel:$(e.target).find('[name=pesel]').val()
            }];
        //-- generowanie loginu dla użytkownika
        newUser[0].login = generateLogin(newUser[0].firstName, newUser[0].lastName);

        //var found=checkExistsUser(newUser[0].email,USERTYPE.DORADCA,USERTYPE.HONOROWY);
        //if(found==true){
        //    aplikujConfirmation("członkiem zwyczajnym",newUser);
        //}
        addUserDraft(newUser);

        console.log("Dodany członek: ");
        console.log(newUser[0]);
    },
    'reset form': function () {
        Router.go('home');
    },
    'click #statutBootbox':function(){
        bootbox.dialog({
            message: getRegulamin(),
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
        return Meteor.userId() ? "readonly" : "";
    },
    nazwaOrganizacji:function(){
        return Parametr.findOne() ? Parametr.findOne().nazwaOrganizacji :"Aktywna Demokraca";
    }
});
getRegulamin=function(){
    return Parametr.findOne() ? Parametr.findOne().regulamin :"";
};
addUserDraft=function(newUser){
    console.log("add user draft");
    console.log(newUser);
    Meteor.call('addUserDraft', newUser, function (error, ret) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            }
            else {
                //do poprawienia
                var user = UsersDraft.findOne({_id: ret});
                addKwestiaOsobowa(ret, newUser,user);

            }
        });
};
addKwestiaOsobowa=function(idUserDraft,newUser,user){
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
        else{
            console.log("ret:");
            console.log(ret);
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
                    sredniaPriorytet: 0,
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
            console.log("add kwestia");
            console.log(newKwestia);
            Meteor.call('addKwestiaOsobowa', newKwestia, function (error,ret) {
                if (error) {
                    console.log(error.reason);
                }
                else {
                    if(Meteor.userId())
                        Router.go("administracjaUserMain");
                    else
                        Router.go("home");
                    przyjecieWnioskuConfirmation(Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej,daneAplikanta.email,"członkowstwo");
                    Meteor.call("sendApplicationConfirmation", user,function(error){
                        if(!error)
                            Meteor.call("sendEmailAddedIssue", ret);
                    });
                    //addZR(ret,newUser[0].email);
                }
            });
        }
    });


};