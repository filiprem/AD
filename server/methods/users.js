Meteor.methods({
    addUser: function(newUser) {
        var uID  =  Accounts.createUser({
            username: newUser[0].login,
            email: newUser[0].email,
            password: newUser[0].password,

            profile: {
                firstName: newUser[0].firstName,
                lastName: newUser[0].lastName,
                fullName: newUser[0].firstName + ' ' + newUser[0].lastName,
                address: newUser[0].address,
                zip: newUser[0].zip,
                roleDesc:  newUser[0].roleDesc,
                language:newUser[0].language,
                rADking:newUser[0].rADking,
                userType:newUser[0].userType,
                city:newUser[0].city,
                pesel:newUser[0].pesel,
                czyAktywny:true
            }
        });

        Roles.addUsersToRoles(uID, "user");
        return uID;
    },

    updateUser: function(currentUserId,currentUser) {
        Users.update(currentUserId,
          {
            $set: {
              "profile.firstName": currentUser.profile.firstName,
              "profile.lastName": currentUser.profile.lastName,
              "profile.fullName": currentUser.profile.firstName + ' ' + currentUser.profile.lastName,
              "profile.address": currentUser.profile.address,
              "profile.zip": currentUser.profile.zip,
              "profile.city": currentUser.profile.city,
            }
          }
        );
    },
    updateUserLanguage: function(currentUserId,value) {
        Users.update({_id:currentUserId}, {$set:{'profile.language': value}});
    },
    updateUserRanking: function(currentUserId,value) {
        Users.update({_id:currentUserId},{$set:{'profile.rADking': value}});
    },
    updateUserType: function(currentUserId,value) {
        Users.update({_id:currentUserId},{$set:{'profile.userType': value}});
    },
    removeUser: function(id){
        Users.remove({_id: id});
    },
    updateUserLanguage: function(id,user) {
        Users.update({_id:id},{$set:{'profile.language':user.profile.language}});
    },
    sendMessageToUser: function(newEmail) {
        var id=Message.insert({
            idSender: newEmail[0].idSender,
            idReceiver: newEmail[0].idReceiver,
            createdAt: newEmail[0].createdAt,
            subject: newEmail[0].subject,
            content: newEmail[0].content
        });
        return id;
    },
    rewriteFromDraftToUser: function(currentUserId,fields) {
        Users.update({_id:currentUserId}, {$set: {
            'profile.address': fields.address,
            'profile.zip': fields.zip,
            'profile.language': fields.language,
            'profile.userType': fields.userType,
            'profile.rADking': fields.rADking,
            'profile.pesel': fields.pesel
        }});
    }
});
