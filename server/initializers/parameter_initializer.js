Meteor.startup(function () {
    var globalParameters = [
        {
            "nazwaOrganizacji": "Aktywna Demokracja",
            "terytorium": "Polska",
            "kontakty": "Warszawa ul. Miła",
            "regulamin": "brak regulaminu",
            //"voteFrequency": 7,
            "voteQuantity": 3,
            "voteDuration":2
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