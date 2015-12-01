Meteor.methods({
    addZespolRealizacyjnyDraft: function (newZespol) {

        var id = ZespolRealizacyjnyDraft.insert({
            nazwa: newZespol[0].nazwa,
            zespol:newZespol[0].zespol,
            idZR:newZespol[0].idZR
        });
        return id;
    },
    updateIdZespoluDraft: function (id, idZespol) {
        var id = Kwestia.update(id, {$set: {idZespolRealizacyjny: idZespol}}, {upsert: true});
        return id;
    },
    updateNazwaZRDraft: function (id, nazwaZespolu) {
        var id = ZespolRealizacyjnyDraft.update(id, {$set: {nazwa: nazwaZespolu}}, {upsert: true});
        return id;
    },
    removeZespolRealizacyjnyDraft:function(object){
        ZespolRealizacyjnyDraft.remove(object);
    },
    updateZespolRealizacyjnyDraft:function(id,data){
        console.log("update!");
        console.log(data);
        console.log(id);
        //var id = ZespolRealizacyjnyDraft.update(id, {$set: data}, {upsert: true});
        var id = ZespolRealizacyjnyDraft.update({_id:id}, {$set: {nazwa: data.nazwa,zespol:data.zespol,idZR:data.idZR}}, {upsert: true});
        console.log(id);
        return id;
    },
    updateCzlonkowieZRDraft: function (id, czlonkowie) {
        var id = ZespolRealizacyjnyDraft.update(id, {$set: {zespol: czlonkowie}}, {upsert: true});
        return id;
    },
    updateCzlonkowieNazwaZRDraft: function (id, czlonkowie,nazwa) {
        var id = ZespolRealizacyjnyDraft.update(id, {$set: {zespol: czlonkowie,nazwa:nazwa}}, {upsert: true});
        return id;
    },
    updateCzlonkowieNazwaIdZrZRDraft: function (id, czlonkowie,nazwa) {
        var id = ZespolRealizacyjnyDraft.update(id, {$set: {zespol: czlonkowie,nazwa:nazwa}}, {upsert: true});
        return id;
    },
    updateIdZRDraft:function (id, idZR) {
        var id = ZespolRealizacyjnyDraft.update(id, {$set: {idZR: idZR}}, {upsert: true});
        return id;
    }
});
