Meteor.methods({
    addParametr: function(newParametr) {
        Parametr.insert({
            nazwaOrganizacji: newParametr[0].nazwaOrganizacji,
            terytorium: newParametr[0].terytorium,
            kontakty: newParametr[0].kontakty,
            regulamin: newParametr[0].regulamin
        });
    },
    updateParametr: function(id, parametr){
        Parametr.update(id, {$set: parametr}, {upsert: true});
    },
    removeParametr: function(id){
        Parametr.remove({_id: id});
    }
});