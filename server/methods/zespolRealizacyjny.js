Meteor.methods({
    addZespolRealizacyjny: function (newZespol) {

        var id = ZespolRealizacyjny.insert({
            nazwa: newZespol[0].nazwa,
            zespol:newZespol[0].zespol,
            kwestie:newZespol[0].kwestie,
            czyAktywny:newZespol[0].czyAktywny
        });
        return id;
    },
    //updateZespolRealizacyjny: function (id, obj) {
    //    var id = ZespolRealizacyjny.update(id,
    //        {
    //            $set: {
    //                zespol: obj
    //            }
    //        });
    //    return id;
    //},
    updateIdZespolu: function (id, idZespol) {
        var id = Kwestia.update(id, {$set: {idZespolRealizacyjny: idZespol}}, {upsert: true});
        return id;
    },
    updateNazwaZR: function (id, nazwaZespolu) {
        var id = ZespolRealizacyjny.update(id, {$set: {nazwa: nazwaZespolu}}, {upsert: true});
        return id;
    },
    removeZespolRealizacyjny:function(object){
        ZespolRealizacyjny.remove(object);
    },
    updateZespolRealizacyjny:function(id,data){
        var id = ZespolRealizacyjny.update(id, {$set: data}, {upsert: true});
        return id;
    },
    updateCzlonkowieZR: function (id, czlonkowie) {
        var id = ZespolRealizacyjny.update(id, {$set: {zespol: czlonkowie}}, {upsert: true});
        return id;
    },
    updateKwestieZR:function (id, kwestie) {
        var id = ZespolRealizacyjny.update(id, {$set: {kwestie: kwestie}}, {upsert: true});
        return id;
    },
});
