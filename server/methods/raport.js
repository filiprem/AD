Meteor.methods({
    addRaportMethod: function(newRaport){
        Raport.insert({
            //terminyGlosowan: newRaport[0].terminyGlosowan,
            //uzytkownicy: newRaport[0].uzytkownicy,
            //realizacja: newRaport[0].realizacja
            idAutor:newRaport.idAutor,
            autorFullName:newRaport.autorFullName,
            dataUtworzenia:newRaport.dataUtworzenia,
            idKwestia:newRaport.idKwestia,
            idPost:newRaport.idPost,
            tytul:newRaport.tytul,
            opis:newRaport.opis,
            czyAktywny:true
        });
    },
    updateRaport: function(id, raport){
        Raport.update(id, {$set: raport}, {upsert: true});
    },
    removeRaport: function(id){
        Raport.remove({_id: id});
    }
});