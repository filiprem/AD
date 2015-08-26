Meteor.startup(function(){
    var temat =
    {
        "_id": "3TBYqrgpJiQQSDEbt",
        "nazwaTemat": "Organizacyjne",
        "opis": "Organizacyjne"
    };
    
    if(Temat.find().count() == 0){
        Meteor.call('addTemat', temat, function (error, ret) {
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