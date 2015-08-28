Meteor.methods({
    // metody Kwestia G£ÓWNA
    addPowiadomienie: function (newPowiadomienie) {
        var id = Powiadomienie.insert({
            idUser: newPowiadomienie[0].idUser,
            dataWprowadzenia: newPowiadomienie[0].dataWprowadzenia,
            tytul: newPowiadomienie[0].tytul,
            powiadomienieTyp: newPowiadomienie[0].powiadomienieTyp,
            tresc: newPowiadomienie[0].tresc,
            idNadawcy: newPowiadomienie[0].idNadawcy,
            czyAktywny: newPowiadomienie[0].czyAktywny = true,
            czyOdczytany:newPowiadomienie[0].czyOdczytany
        });
        return id;
    }
});