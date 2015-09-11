Template.czlonekZwyczajnyForm.rendered = function () {
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
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
            identityCard:{
                exactlength:9,
                identityCardValidation:true
            },
            zipCode:{
                kodPocztowyValidation:true
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
            phone: {
                required: fieldEmptyMessage()
            },
            dateOfBirth: {
                required: fieldEmptyMessage()
            },
            address: {
                required: fieldEmptyMessage()
            },
            zipCode: {
                required: fieldEmptyMessage()
            },
            identityCard:{
                required:fieldEmptyMessage()
            },
            pesel:{
                required:fieldEmptyMessage()
            },
            city:{
                required:fieldEmptyMessage()
            },
            statutConfirmation:{
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

Template.czlonekZwyczajnyForm.events({
    'submit form': function (e) {
        e.preventDefault();
        //sprawdzam,czy jest meteor.user
        //jeżeli jest,to znaczy,że : tworze nowego drafta,z akutanym userId.po akceptacji kwestii: jeżeli userId jest,to po tym userID przepisuję dane do usera,userDraft usuwam
        // jeżeli nie ma,to znaczy,że nowy draft->i dane są przepisywane do usera, po akceptacji kwestii:stworzony nowy użytkownik,userDraftUsunięty
        //kwestia ta sama z draftem zawsze!

        var idUser = null;
        if (Meteor.userId()) {
            idUser = Meteor.userId();
        }
        var newUser = [
            {
                email: $(e.target).find('[name=email]').val(),
                login: "",
                firstName: $(e.target).find('[name=firstName]').val(),
                lastName: $(e.target).find('[name=lastName]').val(),
                profession: $(e.target).find('[name=profession]').val(),
                phone: $(e.target).find('[name=phone]').val(),
                dateOfBirth: $(e.target).find('[name=dateOfBirth]').val(),
                address: $(e.target).find('[name=address]').val(),
                zip: $(e.target).find('[name=zipCode]').val(),
                web: $(e.target).find('[name=web]').val(),
                gender: $(e.target).find('[name=genderRadios]:checked').val(),
                role: 'user',
                userType: USERTYPE.CZLONEK,
                uwagi: $(e.target).find('[name=uwagi]').val(),
                language: $(e.target).find('[name=language]').val(),
                isExpectant: false,
                idUser: idUser,
                city:$(e.target).find('[name=city]').val(),
                identityCard:$(e.target).find('[name=identityCard]').val(),
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
    isSelected: function (gender) {
        var gen = this.profile.gender;
        if (gen) {
            if (gen == gender)
                return "checked";
            else
                return "";
        }
        return "";
    },
    email: function () {
        return getEmail(this);
    },
    isNotEmpty: function () {
        console.log(this._id);

        return Meteor.userId() ? "readonly" : "";
    },
    nazwaOrganizacji:function(){
        return Parametr.findOne() ? Parametr.findOne().nazwaOrganizacji :"Aktywna Demokraca";
    }
});
getRegulamin=function(){
    return Parametr.findOne() ? Parametr.findOne().regulamin :"";
};
aplikujConfirmation=function(userType,user){
    bootbox.dialog({
        message: "Czy na pewno chcesz być "+userType+" ?",
        title: "Uwaga",
        buttons: {
            success: {
                label: "Ok",
                className: "btn-success",
                callback: function () {
                    //dodaj usera
                    addUserDraft(user);
                }
            },
            danger: {
                label: "Nie, rezygnuję",
                className: "btn-danger"
            }
        }
    });
};
addUserDraft=function(newUser){
    Meteor.call('addUserDraft', newUser, function (error, ret) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            }
            else
                addKwestiaOsobowa(ret,newUser);
        });
};
addKwestiaOsobowa=function(idUserDraft,newUser){
    var dataG = new Date();
    var d = dataG.setDate(dataG.getDate() + 7);
    var web="";
    if(newUser[0].web!=null)
        web=newUser[0].web;
    var uwagi="";
    if(newUser[0].uwagi!=null)
        uwagi=newUser[0].uwagi;

    var daneAplikanta = "DANE APLIKANTA: \r\n " +
        newUser[0].firstName + ", " + newUser[0].lastName + " \r\n " +
        newUser[0].email + ", \r\n " +
        newUser[0].identityCard + ", \r\n " +
        newUser[0].pesel + ", \r\n " +
        newUser[0].city + ", \r\n " +
        newUser[0].zip + ", \r\n " +
        newUser[0].address + ", \r\n " +
        newUser[0].phone + ", \r\n " +
        newUser[0].dateOfBirth + ", \r\n " +
        web + ", \r\n " +
        uwagi;
    var newKwestia = [
        {
            idUser: idUserDraft,
            dataWprowadzenia: new Date(),
            kwestiaNazwa: 'Aplikowanie- ' + newUser[0].firstName + " " + newUser[0].lastName,
            wartoscPriorytetu: 0,
            sredniaPriorytet: 0,
            idTemat: Temat.findOne({})._id,
            idRodzaj: Rodzaj.findOne({})._id,
            dataDyskusji: new Date(),
            dataGlosowania: d,
            krotkaTresc: 'Aplikacja o przyjęcie do systemu jako ' + newUser[0].userType,
            szczegolowaTresc: daneAplikanta,
            isOption: false,
            status: KWESTIA_STATUS.OSOBOWA
        }];
    Meteor.call('addKwestia', newKwestia, function (error,ret) {
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
            addZR(ret,newUser[0].email);
        }
    });
};
addZR=function(idKwestii,email){
    var zr=ZespolRealizacyjny.findOne({});
    var kwestia=Kwestia.findOne({_id:idKwestii});
    var myZRDraft=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
    var ZRdataToUpdate={
        nazwa:zr.nazwa,
        zespol:zr.zespol
    };
    Meteor.call('updateZespolRealizacyjnyDraft', myZRDraft._id,ZRdataToUpdate, function (error,ret) {
        if (error) {
            // optionally use a meteor errors package
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else
                throwError(error.reason);
        }
        else {
            if(Meteor.userId())
                Router.go("administracjaUserMain");
            else
                Router.go("home");
            przyjecieWnioskuConfirmation(email,"doradztwo");
        }
    });
};