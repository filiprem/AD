Template.profileEdit.rendered = function () {
    $("#profileForm").validate({
        rules: {
            email: {
                email: true
            }
        },
        messages: {
            email: {
                required: fieldEmptyMessage(),
                email: validEmailMessage()
            },
            name: {
                required: fieldEmptyMessage(),
            },
            surname: {
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
Template.profileEdit.helpers({
    email: function () {
        return getEmail(this);
    },

    isSelected: function (gender) {
        var gen = this.profile.gender;
        if (gen == gender)
            return "checked";
        else
            return "";
    }
});

Template.profileEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentUserId = this._id;
        var userType=Users.findOne({_id:currentUserId}).profile.userType;
        if (isNotEmpty($(e.target).find('[name=name]').val(), 'imię') &&
            isNotEmpty($(e.target).find('[name=surname]').val(), 'nazwisko') &&
            isEmail($(e.target).find('[name=email]').val())) {
            var object = {
                address: $(e.target).find('[name=email]').val()
            };
            var array = [];
            array.push(object);
            var userProperties = {
                emails: array,
                profile: {
                    firstName: $(e.target).find('[name=name]').val(),
                    lastName: $(e.target).find('[name=surname]').val(),
                    fullName: $(e.target).find('[name=name]').val() + ' ' + $(e.target).find('[name=surname]').val(),
                    profession: $(e.target).find('[name=profession]').val(),
                    address: $(e.target).find('[name=address]').val(),
                    zip: $(e.target).find('[name=zipcode]').val(),
                    gender: $(e.target).find('[name=genderRadios]:checked').val(),
                    phone: $(e.target).find('[name=phone]').val(),
                    web: $(e.target).find('[name=website]').val(),
                    userType:userType
                }
            };
            Meteor.call('updateUser', currentUserId, userProperties, function (error) {
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
                    Router.go('manage_account');
                }
            });
        }
        else {
            return false;
        }
    }
});