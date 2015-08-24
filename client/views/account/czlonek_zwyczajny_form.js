Template.czlonekZwyczajnyForm.rendered = function () {
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    $("#userForm").validate({
        rules: {
            password: {
                minlength: 6
            },
            czasGlosowania: {
                min: 0.01,
                number: true
            },
            email: {
                email: true
            },
            confirmPassword: {
                equalTo: "#inputPassword"
            }
        },
        messages: {
            role: {
                required: fieldEmptyMesssage()
            },
            email: {
                required: fieldEmptyMesssage(),
                email: validEmailMessage()
            },
            firstName: {
                required: fieldEmptyMesssage()
            },
            lastName: {
                required: fieldEmptyMesssage()
            },
            profession:{
                required:fieldEmptyMesssage()
            },
            phone:{
                required:fieldEmptyMesssage()
            },
            dateOfBirth:{
                required:fieldEmptyMesssage()
            },
            address:{
                required:fieldEmptyMesssage()
            },
            zipCode:{
                required:fieldEmptyMesssage()
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
        // uzupe³nienie tymczasowej tablicy danymi z formularza
        var newUser = [
            {
                email: $(e.target).find('[name=email]').val(),
                login: "",
                password: $(e.target).find('[name=password]').val(),
                confirm_password: $(e.target).find('[name=confirmPassword]').val(),
                firstName: $(e.target).find('[name=firstName]').val(),
                lastName: $(e.target).find('[name=lastName]').val(),
                profession: $(e.target).find('[name=profession]').val(),
                phone: $(e.target).find('[name=phone]').val(),
                dateOfBirth: $(e.target).find('[name=dateOfBirth]').val(),
                address: $(e.target).find('[name=address]').val(),
                zip: $(e.target).find('[name=zipCode]').val(),
                web: $(e.target).find('[name=web]').val(),
                gender: $(e.target).find('[name=genderRadios]:checked').val(),
                role: 'admin',
                roleDesc: $(e.target).find('[name=uwagiStatus]').val(),
                rADking: 0,
                //roleDesc: $(e.target).find('[name=uwagiStatus]').val(),
                language: $(e.target).find('[name=language]').val()
            }];
        //-- generowanie loginu dla u¿ytkownika
        newUser[0].login = generateLogin(newUser[0].firstName, newUser[0].lastName);
        //Meteor.call('addUser', newUser, function (error) {
        //    if (error) {
        //        // optionally use a meteor errors package
        //        if (typeof Errors === "undefined")
        //            Log.error('Error: ' + error.reason);
        //        else {
        //            //if(error.error === 409)
        //            throwError(error.reason);
        //        }
        //    }
        //    else {//je¿eli poprawne dane
        //        Meteor.loginWithPassword(newUser[0].login, newUser[0].password, function(err) {
        //            if (err) {
        //                throwError('Niepoprawne dane logowania.');
        //            } else {
        //                if(Meteor.loggingIn()) {
        //                    Router.go('home');
        //                }
        //                bootbox.dialog({
        //                    message: "Twój login: "+newUser[0].login,
        //                    title: "Witaj "+newUser[0].firstName,
        //                    buttons: {
        //                        main: {
        //                            label: "Ok",
        //                            className: "btn-primary"
        //                        }
        //                    }
        //                });
        //            }
        //        });
        //    }
        //});
    },
    'reset form': function () {
        Router.go('home');
    }
});