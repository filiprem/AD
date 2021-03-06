Template.registerForm.rendered = function () {
    var users=Users.find({'profile.userType':USERTYPE.CZLONEK});
    if(users.count()>=5)
        document.getElementById("submitRegistration").disabled = false;
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    $("#userForm").validate({
        rules: {
            password: {
                minlength: 6
            },
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
            password: {
                required: fieldEmptyMessage(),
                minlength: minLengthMessage(6)
            },
            confirmPassword: {
                equalTo: equalToMessage()
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
            language:{
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
            if(element.attr("name") == "statutConfirmation")
                error.insertAfter(document.getElementById("statutConfirmationSpan"));
            else
                validationPlacementError(error, element);
        }
    })
};

Template.registerForm.events({
    'submit form': function (e) {
        e.preventDefault();
        if ($('#userForm').valid()) {
            document.getElementById("submitRegistration").disabled = true;
            // uzupełnienie tymczasowej tablicy danymi z formularza
            var firstName = $(e.target).find('[name=firstName]').val();
            var lastName = $(e.target).find('[name=lastName]').val();
            var email = $(e.target).find('[name=email]').val();
            Meteor.call('serverCheckExistsUser', email, USERTYPE.CZLONEK, null, function (error, ret) {
                if (error) {
                    throwError(error.reason);
                }
                else {
                    if (ret == false) {
                        Meteor.call("serverCheckExistsUserDraft", email, function (error, ret) {
                            if (error) {
                                throwError(error.reason);
                            }
                            else {
                                if (ret == false) {
                                    Meteor.call("serverGenerateLogin", firstName, lastName, function (err, ret) {
                                        if (!err) {
                                            var newUser = [
                                                {
                                                    email: email,
                                                    login: "",
                                                    firstName: firstName,
                                                    lastName: lastName,
                                                    password: $(e.target).find('[name=password]').val(),
                                                    confirm_password: $(e.target).find('[name=confirmPassword]').val(),
                                                    address: $(e.target).find('[name=address]').val(),
                                                    zip: $(e.target).find('[name=ZipCode]').val(),
                                                    role: 'user',
                                                    userType: USERTYPE.CZLONEK,
                                                    uwagi: $(e.target).find('[name=uwagi]').val(),
                                                    language: $(e.target).find('[name=language]').val(),
                                                    city: $(e.target).find('[name=city]').val(),
                                                    pesel: $(e.target).find('[name=pesel]').val(),
                                                    rADking: 0

                                                }];
                                            //-- generowanie loginu dla użytkownika
                                            newUser[0].login = ret; //generateLogin(newUser[0].firstName, newUser[0].lastName);
                                            newUser[0].fullName = newUser[0].firstName + " " + newUser[0].lastName;

                                            var users=Users.find({'profile.userType':USERTYPE.CZLONEK});
                                            if(users.count()<5) {
                                                Meteor.call('addUser', newUser, function (error, ret) {
                                                    if (error) {
                                                        // optionally use a meteor errors package
                                                        if (typeof Errors === "undefined")
                                                            Log.error('Error: ' + error.reason);
                                                        else {
                                                            //if(error.error === 409)
                                                            throwError(error.reason);
                                                        }
                                                    }
                                                    else {//jeżeli poprawne dane
                                                        var addedUser = ret;
                                                        Meteor.loginWithPassword(newUser[0].login, newUser[0].password, function (err) {
                                                            if (err) {
                                                                throwError('Niepoprawne dane logowania.');
                                                            } else {
                                                                var zespol = ZespolRealizacyjny.findOne({_id: "jjXKur4qC5ZGPQkgN"});
                                                                if (zespol) {
                                                                    if (zespol.zespol.length < 3) {
                                                                        var ZR = zespol.zespol.slice();
                                                                        ZR.push(addedUser);

                                                                        if (zespol.zespol.length == 0) {
                                                                            Meteor.call('updateCzlonkowieZRProtector', zespol._id, ZR, addedUser, function (error, ret) {
                                                                                if (error) {
                                                                                    // optionally use a meteor errors package
                                                                                    if (typeof Errors === "undefined")
                                                                                        Log.error('Error: ' + error.reason);
                                                                                    else {
                                                                                        throwError(error.reason);
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                        else {
                                                                            Meteor.call('updateCzlonkowieZR', zespol._id, ZR, function (error, ret) {
                                                                                if (error) {
                                                                                    // optionally use a meteor errors package
                                                                                    if (typeof Errors === "undefined")
                                                                                        Log.error('Error: ' + error.reason);
                                                                                    else {
                                                                                        throwError(error.reason);
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                }
                                                                if (Meteor.loggingIn()) {
                                                                    Router.go('home');
                                                                }
                                                                bootbox.dialog({
                                                                    message: "Twój login: " + newUser[0].login,
                                                                    title: "Witaj " + newUser[0].firstName,
                                                                    buttons: {
                                                                        main: {
                                                                            label: "Ok",
                                                                            className: "btn-primary"
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });

                                                    }
                                                });
                                            }
                                            else{
                                                bootbox.alert("Przepraszamy! Rejestracja nie możliwa z powodu osiągnięcia limitu osób, które mogą się zarejestrować samodzielnie.Aby aplikować kliknij dołącz.")
                                            }
                                        } else {
                                            throwError(err.reason)
                                        }
                                    });
                                }
                                else {
                                    throwError('Został już złożony wniosek na podany adres email!');
                                    document.getElementById("submitRegistration").disabled = false;
                                    return false;
                                }
                            }
                        });
                    }
                    else {
                        throwError('Istnieje już w systemie podany użytkownik!');
                        document.getElementById("submitRegistration").disabled = false;
                        return false;
                    }
                }
            });
        }
    },
    'reset form': function () {
        Router.go('listUsers');
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

Template.registerForm.helpers({
    'lessThanFiveUsers': function () {
        var users = Users.find({'profile.userType':USERTYPE.CZLONEK});
        //var users=Users.find();
        return !!users && users.count() < 5 ? true : false;
    },
    'getLanguages':function(){
        return Languages.find({});
    }
})