Template.editUserForm.helpers({
    userToEdit: function(){
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
    dateB: function(){
        var d = this.profile.dateOfBirth;
        return moment(d).format("DD-MM-YYYY");
    }
});

Template.editUserForm.events({
   'click #clickme': function(e){
       e.preventDefault();
       var usr = Session.get("userInScope");
       var usrId = usr._id;
       var userProperties = {
           emails: {
               0: { address: $(e.target).find('[name=email]').val() }
           },
           profile: {
               firstName: $(e.target).find('[name=firstName]').val(),
               lastName: $(e.target).find('[name=lastName]').val(),
               full_name: $(e.target).find('[name=firstName]').val() + ' ' + $(e.target).find('[name=lastName]').val(),
               profession: $(e.target).find('[name=profession]').val(),
               address: $(e.target).find('[name=address]').val(),
               zip: $(e.target).find('[name=zipCode]').val(),
               phone: $(e.target).find('[name=phone]').val(),
               web: $(e.target).find('[name=web]').val()
           }
       };
       console.log(userProperties)
       console.log(usrId)
       console.log($(e.target).find('[name=firstName]').val());
       //Meteor.call('updateUser',usrId, userProperties, function (error) {
       //    if (error) {
       //        // optionally use a meteor errors package
       //        if (typeof Errors === "undefined")
       //            Log.error('Error: ' + error.reason);
       //        else {
       //            if(error.error === 409)
       //                throwError(error.reason);
       //        }
       //    }
       //    else {
       //        Router.go('listUsers');
       //    }
       //});
   }
});