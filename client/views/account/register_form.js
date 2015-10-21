Template.registerForm.rendered = function () {
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
                email: true,
                checkExistsAnyEmail: true
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
        // uzupełnienie tymczasowej tablicy danymi z formularza
        var newUser = [
            {
                email: $(e.target).find('[name=email]').val(),
                login: "",
                firstName: $(e.target).find('[name=firstName]').val(),
                lastName: $(e.target).find('[name=lastName]').val(),
                password: $(e.target).find('[name=password]').val(),
                confirm_password: $(e.target).find('[name=confirmPassword]').val(),
                profession: $(e.target).find('[name=profession]').val(),
                address: $(e.target).find('[name=address]').val(),
                zip: $(e.target).find('[name=zipCode]').val(),
                role: 'user',
                userType: USERTYPE.CZLONEK,
                uwagi: $(e.target).find('[name=uwagi]').val(),
                language: $(e.target).find('[name=language]').val(),
                city:$(e.target).find('[name=city]').val(),
                pesel:$(e.target).find('[name=pesel]').val(),
                rADking:0

            }];
        //-- generowanie loginu dla użytkownika
        newUser[0].login = generateLogin(newUser[0].firstName, newUser[0].lastName);
        newUser[0].fullName=newUser[0].firstName+" "+newUser[0].lastName;

        console.log("ten user");
        console.log(newUser[0]);
        Meteor.call('addUser', newUser, function (error,ret) {
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
                var addedUser=ret;
                Meteor.loginWithPassword(newUser[0].login, newUser[0].password, function (err) {
                    if (err) {
                        throwError('Niepoprawne dane logowania.');
                    } else {
                        var zespol=ZespolRealizacyjny.findOne();
                        if(zespol) {
                            if(zespol.zespol.length<3) {
                                var ZR=zespol.zespol.slice();
                                ZR.push(addedUser);

                                if(zespol.zespol.length==0){
                                    Meteor.call('updateCzlonkowieZRProtector', zespol._id, ZR, addedUser, function (error, ret) {
                                        if (error) {
                                            // optionally use a meteor errors package
                                            if (typeof Errors === "undefined")
                                                Log.error('Error: ' + error.reason);
                                            else {
                                                //if(error.error === 409)
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
                                                //if(error.error === 409)
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
        var users = Users.find();
        return !!users && users.count() <= 4 ? true : false;
    },
    'getLanguages':function(){
        return Languages.find({});
    }
})