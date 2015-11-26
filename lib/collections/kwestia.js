Kwestia = new Mongo.Collection('kwestia');

if (Meteor.isServer) {
    //ReactiveTable.publish("KwestiaList", Kwestia, {
    //    "czyAktywny": true,
    //
    //    });

    ReactiveTable.publish("KwestiaList", Kwestia, {
        "czyAktywny": true,
        "status":{$in:["deliberowana","statusowa","administrowana","osobowa"]}
        });

    ReactiveTable.publish("GlosowanieList", Kwestia, {
        "czyAktywny": true,
        "status":"glosowana"
    });
}