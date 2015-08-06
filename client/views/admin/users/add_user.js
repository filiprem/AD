Template.addUserForm.rendered = function () {
    $('#test1').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    setRoles();
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
                first_name: $(e.target).find('[name=firstName]').val(),
                last_name: $(e.target).find('[name=lastName]').val(),
                profession: $(e.target).find('[name=profession]').val(),
                phone: $(e.target).find('[name=phone]').val(),
                date_of_birth: $(e.target).find('[name=dateOfBirth]').val(),
                address: $(e.target).find('[name=address]').val(),
                zip: $(e.target).find('[name=zipCode]').val(),
                web: $(e.target).find('[name=web]').val(),
                gender: $(e.target).find('[name=genderRadios]:checked').val(),
                role: $(e.target).find('[name=role]').val(),
                role_desc: $(e.target).find('[name=uwagiStatus]').val()
            }];
        if (isNotEmpty(newUser[0].role,'rola') &&
            isNotEmpty(newUser[0].first_name,'imię') &&
            isNotEmpty(newUser[0].last_name,'nazwisko') &&
            isNotEmpty(newUser[0].password,'hasło') &&
            isEmail(newUser[0].email) &&
            isValidPassword(newUser[0].password) &&
            areValidPasswords(newUser[0].password, newUser[0].confirm_password)) {
            // sprawdzamy, czy rola istnieje,
            // jeżeli nie to dodajemy nową.
            Meteor.call('addRole', newUser[0].role, function (error) {
                if (error) {
                    // optionally use a meteor errors package
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        if(error.error !== 422)
                        throwError(error.reason);
                    }
                }
            });
            //-- generowanie loginu dla użytkownika
            newUser[0].login = generateLogin(newUser[0].first_name, newUser[0].last_name);
            Meteor.call('addUser', newUser, function (error) {
                if (error)
                {
                    // optionally use a meteor errors package
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        if(error.error === 409)
                        throwError(error.reason);
                    }
                }
                else {
                    Router.go('listUsers');
                }
            });
        } else {
            return false;
        }
    },
    'reset form': function(){
        Router.go('listUsers');
    }
});