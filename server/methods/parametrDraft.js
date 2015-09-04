Meteor.methods({
    addParametrDraft: function(newParametr) {
        var id = ParametrDraft.insert({
            nazwaOrganizacji: newParametr.nazwaOrganizacji,
            terytorium: newParametr.terytorium,
            kontakty: newParametr.kontakty,
            regulamin: newParametr.regulamin,
           
    
        });
        return id;
    },
    updateParametrDraft: function(id, parametr){
        ParametrDraft.update({_id:id}, {$set: parametr}, {upsert: true});
    },
    removeParametrDraft: function(id){
        ParametrDraft.remove({_id: id});
    }
});