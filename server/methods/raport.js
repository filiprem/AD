Meteor.methods({
    addRaportMethod: function(newRaport){
        var id=Raport.insert({
            //terminyGlosowan: newRaport[0].terminyGlosowan,
            //uzytkownicy: newRaport[0].uzytkownicy,
            //realizacja: newRaport[0].realizacja
            idAutor:newRaport.idAutor,
            autorFullName:newRaport.autorFullName,
            dataUtworzenia:moment(newRaport.dataUtworzenia).format(),
            idKwestia:newRaport.idKwestia,
            idPost:newRaport.idPost,
            tytul:newRaport.tytul,
            opis:newRaport.opis,
            czyAktywny:true
        });
        Posts.update({_id:newRaport.idPost},{$set:{idRaport:id}});
        return id;
    },
    updateRaport: function(id, raport){
        Raport.update(id, {$set: raport}, {upsert: true});
    },
    removeRaport: function(id){
        Raport.remove({_id: id});
    }
});