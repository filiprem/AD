Template.editUserForm.rendered = function () {
    $('#test1').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    $("#userForm").validate({
        rules: {
            password: {
                minlength: 6,
            },
            email: {
                email: true
            }
        },
        messages: {
            email: {
                required: fieldEmptyMessage(),
                email: validEmailMessage()
            },
            firstName: {
                required: fieldEmptyMessage(),
            },
            lastName: {
                required: fieldEmptyMessage(),
            }
        },
        highlight: function (element) {
            var id_attr = "#" + $(element).attr("id") + "1";
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            $(id_attr).removeClass('glyphicon-ok').addClass('glyphicon-remove');
        },
        unhighlight: function (element) {
            var id_attr = "#" + $(element).attr("id") + "1";
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            $(id_attr).removeClass('glyphicon-remove').addClass('glyphicon-ok');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.length) {
                error.insertAfter(element);
            } else {
                error.insertAfter(element);
            }
        }
    })
};

Template.editUserForm.helpers({
    userToEdit: function () {
        return Session.get("userInScope");
    },
    email: function () {
        var usr = Session.get("userInScope");
        if (usr.emails && usr.emails.length)
            return usr.emails[0].address;

        if (usr.services) {
            //Iterate through services
            for (var serviceName in usr.services) {
                var serviceObject = usr.services[serviceName];
                //If an 'id' isset then assume valid service
                if (serviceObject.id) {
                    if (serviceObject.email) {
                        return serviceObject.email;
                    }
                }
            }
        }
        return "";
    },
    dateB: function () {
        return this.profile.dateOfBirth;
    },
    roles: function () {
        return Session.get("userInScope").roles;
    },
    isSelected: function (gender) {
        var gen = this.profile.gender;
        if (gen == gender)
            return "checked";
        else
            return "";
    }
});

Template.editUserForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var usr = Session.get("userInScope");
        var usrId = usr._id;
        var object = {
            address: $(e.target).find('[name=email]').val()
        };
        var array = [];
        array.push(object);
        var userProperties = {
            emails: array,
            profile: {
                firstName: $(e.target).find('[name=firstName]').val(),
                lastName: $(e.target).find('[name=lastName]').val(),
                fullName: $(e.target).find('[name=firstName]').val() + ' ' + $(e.target).find('[name=lastName]').val(),
                address: $(e.target).find('[name=address]').val(),
                zip: $(e.target).find('[name=zipCode]').val(),
                phone: $(e.target).find('[name=phone]').val(),
                dateOfBirth: $(e.target).find('[name=dateOfBirth]').val(),
                web: $(e.target).find('[name=web]').val(),
                gender: $(e.target).find('[name=genderRadios]:checked').val(),
                roleDesc: $(e.target).find('[name=uwagiStatus]').val()
            }
        };
        Meteor.call('updateUser', usrId, userProperties, function (error) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    if (error.error === 409)
                        throwError(error.reason);
                }
            }
            else {
                Router.go('listUsers');
            }
        });
    },
    'reset form': function () {
        Router.go('listUsers');
    }
});