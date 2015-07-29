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
                    first_name: newUser[0].firstName,
                    last_name: newUser[0].lastName,
                    full_name: newUser[0].firstName + ' ' + newUser[0].lastName,
                    profession: newUser[0].profession,
                    address: newUser[0].address,
                    zip: newUser[0].zip,
                    dateOfBirth: newUser[0].dateOfBirth,
                    gender: newUser[0].gender,
                    phone: newUser[0].phone,
                    web: newUser[0].web,
                    role: newUser[0].role,
                    role_desc:  newUser[0].role_desc
                }
            });
        }
        Roles.addUsersToRoles(uID, newUser[0].role);
    },

    updateUser: function(currentUserId,currentUser) {
        Users.update(currentUserId, {$set: currentUser}, {upsert:true});
    },

    addGlosujacy: function(newGlosujacy) {
        Glosujacy.insert({
            glosujacy_id: newGlosujacy[0].glosujacy_id,
            user_id: newGlosujacy[0].user_id,
            obecny_priorytet: newGlosujacy[0].obecny_priorytet
        });
    }
});
