Rodzaj = new Mongo.Collection('rodzaj');

Rodzaj.allow({
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
    addRodzaj: function(newRodzaj) {
        Rodzaj.insert({
            temat_id: newRodzaj[0].temat_id,
            nazwaRodzaj: newRodzaj[0].nazwaRodzaj,
            czasDyskusji: newRodzaj[0].czasDyskusji,
            czasGlosowania: newRodzaj[0].czasGlosowania,
            pulapPriorytetu: newRodzaj[0].pulapPriorytetu
        });
    }
});
