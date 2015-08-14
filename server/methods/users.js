Meteor.methods({
    addUser: function(newUser) {
        if(Users.find({'emails.address': newUser[0].email}).count()>0)
        {
            throw new Meteor.Error(409, 'Użytkownik o adresie: '+newUser[0].email+' istnieje już  w systemie.');
        }
        else
        {
            var uID  =  Accounts.createUser({
                username: newUser[0].login,
                email: newUser[0].email,
                password: newUser[0].password,

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
                   // role: newUser[0].role,
                    roleDesc:  newUser[0].roleDesc,
                    language:newUser[0].language,
                    //roleDesc:  newUser[0].roleDesc,
                    rADking:newUser[0].rADking
                }
            });
        }

        Roles.addUsersToRoles(uID, "user");
    },

    updateUser: function(currentUserId,currentUser) {
        Users.update(currentUserId, {
            $set: currentUser},
            {upsert:true});
    },
    updateUserLanguage: function(currentUserId,value) {
        Users.update({_id:currentUserId}, {$set:{'profile.language': value}});
    },
    updateUserRanking: function(currentUserId,value) {
        console.log(currentUserId);
        console.log(value);
        Users.update({_id:currentUserId},{$set:{'profile.rADking': value}});
    },
    removeUser: function(id){
        Users.remove({_id: id});
    },

    updateUserLanguage: function(id,user) {
        Users.update({_id:id},{$set:{'profile.language':user.profile.language}});
    }
});
