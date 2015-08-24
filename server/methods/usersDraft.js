Meteor.methods({
    addUserDraft: function(newUser) {
        if((UsersDraft.find({'emails.address': newUser[0].email}).count()>0) || (Users.find({'emails.address': newUser[0].email}).count()>0))
        {
            throw new Meteor.Error(409, 'U¿ytkownik o adresie: '+newUser[0].email+' istnieje ju¿  w systemie.');
        }
        else
        {
         var id= UsersDraft.insert({
                username: newUser[0].login,
                email: newUser[0].email,
                profile: {
                    firstName: newUser[0].firstName,
                    lastName: newUser[0].lastName,
                    fullName: newUser[0].firstName + ' ' + newUser[0].lastName,
                    profession: newUser[0].profession,
                    address: newUser[0].address,
                    zip: newUser[0].zip,
                    dateOfBirth: newUser[0].dateOfBirth,
                    gender: newUser[0].gender,
                    phone: newUser[0].phone,
                    web: newUser[0].web,
                    language:newUser[0].language,
                    userType:newUser[0].userType
                }
            });
            return id;
        }

    },

    updateUserDraft: function(currentUserId,currentUser) {
        UsersDraft.update(currentUserId, {
                $set: currentUser},
            {upsert:true});
    },
    removeUserDraft: function(id){
        UsersDraft.remove({_id: id});
    }
});
