Meteor.startup(function () {
    var globalParameters = [
        {
            "nazwaOrganizacji": "Aktywna Demokracja",
            "terytorium": "Polska",
            "kontakty": "Warszawa ul. Miła",
            "regulamin": "brak regulaminu",
            //"voteFrequency": 7,
            "czasWyczekiwaniaKwestiiSpecjalnej":2,
            "voteQuantity": 3,
            "voteDuration":1,
            "addIssuePause":60,
            "addCommentPause":2,
            "addReferencePause":1,
            "okresSkladaniaRR":1
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