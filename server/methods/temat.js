Meteor.methods({
    addTemat: function(newTemat) {
        Temat.insert({
            nazwaTemat: newTemat[0].nazwaTemat,
            opis: newTemat[0].opis
        });
    },
    updateTemat: function(tematId, temat){
        Temat.update(tematId, {$set: temat}, {upsert:true});
    },
    removeTemat: function(id){
        Rodzaj.remove({_id: id});
    }
});