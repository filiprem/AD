Template.addUserForm.rendered = function () {
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    $("#userForm").validate({
        rules: {
            password:{
                minlength:6
            },
            czasGlosowania:{
                min: 0.01,
                number:true
            },
            email:{
                email: true
            },
            confirmPassword:{
                equalTo: "#inputPassword"
            }
        },
        messages:{
            role:{
                required:fieldEmptyMesssage()
            },
            email:{
                required:fieldEmptyMesssage(),
                email:validEmailMessage()
            },
            firstName:{
                required:fieldEmptyMesssage()
            },
            lastName:{
                required:fieldEmptyMesssage()
            },
            password:{
                required:fieldEmptyMesssage(),
                minlength:minLengthMessage(6)
            },
            confirmPassword:{
                equalTo:equalToMessage()
            }
        },
        highlight: function(element) {
            highlightFunction(element);
        },
        unhighlight: function(element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            validationPlacementError(error,element);
        }
    })
};

Template.addUserForm.events({
    'submit form': function (e) {
        e.preventDefault();
        // uzupełnienie tymczasowej tablicy danymi z formularza
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
                language: $(e.target).find('[name=language]').val()
            }];
            // sprawdzamy, czy rola istnieje,
            // jeżeli nie to dodajemy nową.
            //Meteor.call('addRole', newUser[0].role, function (error) {
            //    if (error) {
            //        // optionally use a meteor errors package
            //        if (typeof Errors === "undefined")
            //            Log.error('Error: ' + error.reason);
            //        else {
            //            if(error.error !== 422)
            //            throwError(error.reason);
            //        }
            //    }
            //});
            //-- generowanie loginu dla użytkownika
            newUser[0].login = generateLogin(newUser[0].firstName, newUser[0].lastName);
            Meteor.call('addUser', newUser, function (error) {
                if (error)
                {
                    // optionally use a meteor errors package
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        //if(error.error === 409)
                        throwError(error.reason);
                    }
                }
                else {
                    Router.go('listUsers');
                }
            });
    },
    'reset form': function(){
        Router.go('listUsers');
    }
});