Meteor.methods({
    addUserDraft: function(newUser) {
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
                language:newUser[0].language,
                userType:newUser[0].userType,
                uwagi:newUser[0].uwagi,
                idUser:newUser[0].idUser,
                isExpectant:newUser[0].isExpectant,
                city:newUser[0].city,
                pesel:newUser[0].pesel,
                czyAktywny:true,
                dataWprowadzenia:new Date(),
                czyZrealizowany:false,
                linkAktywacyjny:null
            }
        });
        return id;

    },

    updateUserDraft: function(currentUserId,currentUser) {
        UsersDraft.update(currentUserId, {
                $set: currentUser},
            {upsert:true});
    },
    //removeUserDraft: function(id){
    //    UsersDraft.update({_id:id},{$set:{'profile.czyAktywny': false,czyZrealizowany:false}});
    //},
    removeUserDraft: function(id){
        UsersDraft.update({_id:id},{$set:{'profile.czyAktywny': false,czyZrealizowany:true}});
    },
    setZrealizowanyUserDraft:function(id,realization){
        UsersDraft.update({_id:id},{$set:{czyZrealizowany:realization}});
    },
    setZrealizowanyActivationHashUserDraft:function(id,activationLink,realization){
        UsersDraft.update({_id:id},{$set:{linkAktywacyjny:activationLink,czyZrealizowany:realization}});
    }
});
