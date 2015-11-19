Meteor.methods({
    // metody Kwestia G��WNA
    addPowiadomienie: function (newPowiadomienie) {
        var id = Powiadomienie.insert({
            idOdbiorca: newPowiadomienie.idOdbiorca,
            dataWprowadzenia: newPowiadomienie.dataWprowadzenia,
            tytul: newPowiadomienie.tytul,
            powiadomienieTyp: newPowiadomienie.powiadomienieTyp,
            tresc: newPowiadomienie.tresc,
            idNadawca: newPowiadomienie.idNadawca,
            idKwestia:newPowiadomienie.idKwestia,
            idUserDraft:newPowiadomienie.idUserDraft,
            uzasadnienie:newPowiadomienie.uzasadnienie,
            czyAktywny: true,
            czyOdczytany:newPowiadomienie.czyOdczytany
        });
        return id;
    },
    setOdczytanePowiadomienie:function(id,czyOdczytany){
        Powiadomienie.update(id, {$set: {czyOdczytany: czyOdczytany}}, {upsert: true});
    }
});