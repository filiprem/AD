Meteor.startup(function () {
    var rodzaj = {
        "_id": "qMqF9S9hjZFz4bRK7",
        "idTemat": "3TBYqrgpJiQQSDEbt",
        "nazwaRodzaj": "Przyjęcie",
        "czasDyskusji": 7,
        "czasGlosowania": 24
    }

    if (Rodzaj.find().count() == 0) {

        Rodzaj.insert({
            _id:rodzaj._id,
            idTemat: rodzaj.idTemat,
            nazwaRodzaj: rodzaj.nazwaRodzaj,
            czasDyskusji: rodzaj.czasDyskusji,
            czasGlosowania: rodzaj.czasGlosowania
        });
    }
});