Meteor.startup(function () {
    var rodzaj = {
        "_id": "qMqF9S9hjZFz4bRK7",
        "idTemat": "3TBYqrgpJiQQSDEbt",
        "nazwaRodzaj": "Przyjêcie",
        "czasDyskusji": 7,
        "czasGlosowania": 24
    }

    if (Rodzaj.find().count() == 0) {
        Meteor.call('addRodzaj', rodzaj, function (error, ret) {
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