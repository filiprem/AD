Meteor.methods({
    addRaport: function(newRaport){
        Raport.insert({
            //terminyGlosowan: newRaport[0].terminyGlosowan,
            //uzytkownicy: newRaport[0].uzytkownicy,
            //realizacja: newRaport[0].realizacja
            idAutor:newRaport.idAutor,
            autorFullName:newRaport.autorFullName,
            dataUtworzenia:newRaport.dataUtworzenia,
            idKwestia:newRaport.idKwestia,
            tytul:newRaport.tytul,
            opis:newRaport.opis
        });
    },
    updateRaport: function(id, raport){
        Raport.update(id, {$set: raport}, {upsert: true});
    },
    removeRaport: function(id){
        Raport.remove({_id: id});
    }
});