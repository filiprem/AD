Meteor.methods({
    addRodzaj: function (newRodzaj) {
        Rodzaj.insert({
            idTemat: newRodzaj[0].idTemat,
            nazwaRodzaj: newRodzaj[0].nazwaRodzaj,
            czasDyskusji: newRodzaj[0].czasDyskusji,
            czasGlosowania: newRodzaj[0].czasGlosowania,
            pulapPriorytetu: newRodzaj[0].pulapPriorytetu
        });
    },
    updateRodzaj: function (idRodzaj, rodzaj) {
        Rodzaj.update(idRodzaj, {$set: rodzaj}, {upsert: true});
    },
    removeRodzaj: function(id){
        Rodzaj.remove({_id: id});
    }
});
