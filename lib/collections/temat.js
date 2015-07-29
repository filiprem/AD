Temat = new Mongo.Collection('temat');

Temat.allow({
    insert: function(){
        return true;
    },
    update: function () {
        return true;
    },
    remove: function(){
        return true;
    }
});

Meteor.methods({
    addTemat: function(newTemat) {
        Temat.insert({
            nazwaTemat: newTemat[0].nazwaTemat,
            opis: newTemat[0].opis
        });
    },
    updateTemat: function(tematId, temat){
        Temat.update(tematId, {$set: temat}, {upsert:true});
    }
});
