Meteor.methods({
    addParametr: function(newParametr) {
        Parametr.insert({
            nazwaOrganizacji: newParametr[0].nazwaOrganizacji,
            terytorium: newParametr[0].terytorium,
            kontakty: newParametr[0].kontakty,
            regulamin: newParametr[0].regulamin,
            voteFrequency: newParametr[0].voteFrequency,
            voteQuantity: newParametr[0].voteQuantity
        });
    },
    updateParametr: function(id, parametr){
        Parametr.update({_id:id}, {$set: parametr}, {upsert: true});
    },
    removeParametr: function(id){
        Parametr.remove({_id: id});
    }
});