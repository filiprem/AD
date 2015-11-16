Meteor.startup(function () {
    var rodzaj = {
        "_id": "qMqF9S9hjZFz4bRK7",
        "idTemat": "3TBYqrgpJiQQSDEbt",
        "nazwaRodzaj": "Przyjęcie"
        //"czasDyskusji": 7,
        //"czasGlosowania": 24
    };

    var rodzaj2= {
        "_id": "qMqF9S9hjZFz4bRK8",
        "idTemat": "3TBYqrgpJiQQSDEbt",
        "nazwaRodzaj": "Statutowe"
        //"czasDyskusji": 7,
        //"czasGlosowania": 24
    };

    if (Rodzaj.find().count() == 0) {

        Rodzaj.insert({
            _id:rodzaj._id,
            idTemat: rodzaj.idTemat,
            nazwaRodzaj: rodzaj.nazwaRodzaj,
            czasDyskusji: rodzaj.czasDyskusji,
            czasGlosowania: rodzaj.czasGlosowania
        });

        Rodzaj.insert({
            _id:rodzaj2._id,
            idTemat: rodzaj2.idTemat,
            nazwaRodzaj: rodzaj2.nazwaRodzaj,
            czasDyskusji: rodzaj2.czasDyskusji,
            czasGlosowania: rodzaj2.czasGlosowania
        });
    }
});