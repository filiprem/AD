Template.editUserForm.rendered = function () {
    $('#test1').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
};

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
        return this.profile.date_of_birth;
    },
    roles: function(){
        return Session.get("userInScope").roles;
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

Template.editUserForm.events({
   'submit form': function(e){
       e.preventDefault();
       var usr = Session.get("userInScope");
       var usrId = usr._id;
       var object = {
           address:$(e.target).find('[name=email]').val()
       };
       var array = [];
       array.push(object);
       var userProperties = {
           emails :array,
           profile: {
               first_name: $(e.target).find('[name=firstName]').val(),
               last_name: $(e.target).find('[name=lastName]').val(),
               full_name: $(e.target).find('[name=firstName]').val() + ' ' + $(e.target).find('[name=lastName]').val(),
               profession: $(e.target).find('[name=profession]').val(),
               address: $(e.target).find('[name=address]').val(),
               zip: $(e.target).find('[name=zipCode]').val(),
               phone: $(e.target).find('[name=phone]').val(),
               date_of_birth: $(e.target).find('[name=dateOfBirth]').val(),
               web: $(e.target).find('[name=web]').val(),
               gender: $(e.target).find('[name=genderRadios]:checked').val(),
               role_desc: $(e.target).find('[name=uwagiStatus]').val()
           }
       };
       console.log(userProperties)
       console.log(usrId)

   Meteor.call('updateUser',usrId, userProperties, function (error) {
       if (error) {
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
    //console.log("Ajdik: "+ usrId);
   //Meteor.users.update(usrId, { $set: userProperties });

   },
    'reset form': function(){
        Router.go('listUsers');
    }
});