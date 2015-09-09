Meteor.startup(function(){
    var ZR =[
    {
        "nazwa": "Zespół Realizacyjny ds. Osób",
        "zespol": [],
        "kwestie":[],
        "czyAktywny":true
    }];

    if(ZespolRealizacyjny.find().count() == 0){
        Meteor.call('addZespolRealizacyjny', ZR, function (error, ret) {
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