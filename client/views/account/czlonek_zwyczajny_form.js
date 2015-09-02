Template.czlonekZwyczajnyForm.rendered = function () {
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    $("#userForm").validate({
        rules: {
            email: {
                email: true,
                checkExistsEmail: true,
                checkExistsEmailDraft: true
            },
            confirmPassword: {
                equalTo: "#inputPassword"
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
            profession: {
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
                idUser: idUser
            }];
        //-- generowanie loginu dla użytkownika
        newUser[0].login = generateLogin(newUser[0].firstName, newUser[0].lastName);

        Meteor.call('addUserDraft', newUser, function (error, ret) {
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
                var idUserDraft = ret;
                var dataG = new Date();
                var d = dataG.setDate(dataG.getDate() + 7);
                var daneAplikanta = "DANE APLIKANTA: \r\n " +
                    newUser[0].firstName + ", " + newUser[0].lastName + " \r\n " +
                    newUser[0].email + ", \r\n " +
                    newUser[0].profession + ", \r\n " +
                    newUser[0].address +
                    newUser[0].zip + ", \r\n " +
                    newUser[0].phone + ", \r\n " +
                    newUser[0].dateOfBirth + ", \r\n " +
                    newUser[0].uwagi
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
                Meteor.call('addKwestia', newKwestia, function (error) {
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
                        bootbox.dialog({
                            message: "Twój wniosek o przyjęcie do systemu jako " + newUser[0].userType + " został przyjęty. O wyniku zostaniesz poinformowany drogą mailową",
                            title: "Uwaga",
                            buttons: {
                                main: {
                                    label: "Ok",
                                    className: "btn-primary",
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    'reset form': function () {
        Router.go('home');
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
        return Meteor.userId() ? "readonly" : "";
    }
});