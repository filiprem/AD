Template.profileEdit.helpers({
    email: function () {
        return getEmail(this);
    },

    isSelected: function(gender)
    {
        var gen=this.profile.gender;
        if(gen==gender)
            return "checked";
        else
            return "";
    }
});

Template.profileEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentUserId = this._id;
        if( isNotEmpty($(e.target).find('[name=name]').val(),'imię') &&
            isNotEmpty($(e.target).find('[name=surname]').val(),'nazwisko') &&
            isEmail($(e.target).find('[name=email]').val()))
        {
            var object = {
                address:$(e.target).find('[name=email]').val()
            };
            var array = [];
            array.push(object);
            var userProperties = {
                emails: array,
                profile: {
                    first_name: $(e.target).find('[name=name]').val(),
                    last_name: $(e.target).find('[name=surname]').val(),
                    full_name: $(e.target).find('[name=name]').val() + ' ' + $(e.target).find('[name=surname]').val(),
                    profession: $(e.target).find('[name=profession]').val(),
                    address: $(e.target).find('[name=address]').val(),
                    zip: $(e.target).find('[name=zipcode]').val(),
                    gender: $(e.target).find('[name=genderRadios]:checked').val(),
                    phone: $(e.target).find('[name=phone]').val(),
                    web: $(e.target).find('[name=website]').val()
                }
            };
            //Users.update(currentUserId, {$set: userProperties}, function(error) {
            //if (error) {
            // display the error to the user
            //alert(error.reason);
            //} else {
            //    Router.go('manage_account');
            //}
            //});
            Meteor.call('updateUser',currentUserId, userProperties, function (error) {
                if (error)
                {
                    // optionally use a meteor errors package
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        if(error.error === 409)
                            throwError(error.reason);
                    }
                }
                else
                {
                    Router.go('manage_account');
                }
            });
        }
        else
        {
            return false;
        }
    }
});

//alert(Users.profile.gender);