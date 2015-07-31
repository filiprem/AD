Meteor.methods({
    addRodzaj: function (newRodzaj) {
        Rodzaj.insert({
            temat_id: newRodzaj[0].temat_id,
            nazwaRodzaj: newRodzaj[0].nazwaRodzaj,
            czasDyskusji: newRodzaj[0].czasDyskusji,
            czasGlosowania: newRodzaj[0].czasGlosowania,
            pulapPriorytetu: newRodzaj[0].pulapPriorytetu
        });
    },
    updateRodzaj: function (rodzajId, rodzaj) {
        Rodzaj.update(rodzajId, {$set: rodzaj}, {upsert: true});
    },
    removeRodzaj: function(id){
        Rodzaj.remove({_id: id});
    }
});
