Meteor.startup(function () {
    var globalParameters = [
        {
            "nazwaOrganizacji": "Aktywna Demokracja",
            "terytorium": "Polska",
            "kontakty": "Warszawa ul. Miła",
            "regulamin": "brak regulaminu",
            "pktDodanieKwestii": 10,
            "pktDodanieKomentarza": 5,
            "pktDodanieOdniesienia": 2,
            "pktNadaniePriorytetu": 1,
            "pktAwansKwestii": 20,
            "pktUdzialWZespoleRealizacyjnym": 10,
            "pktZlozenieRaportuRealizacyjnego": 5,
            "pktWycofanieKwestiiDoArchiwum": -20,
            "pktWycofanieKwestiiDoKosza": -40,
            "pktWyjscieZZespoluRealizacyjnego": -30,
            "pktBrakUdzialuWGlosowaniu": -30,
            "rodzajCzasDyskusji": 7,
            "rodzajCzasGlosowania": 48
        }
    ];
    if (Parametr.find().count() == 0) {
        Meteor.call('addParametr', globalParameters, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
        });
    }
});