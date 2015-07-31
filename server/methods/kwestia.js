Meteor.methods({
    //poprawić aby z draftu robiło kwestię po zatwierdzeniu przez uzytkownika
    addKwestia: function(newKwestia) {
        var id = KwestiaDraft.insert({
            userId: Meteor.userId(),
            dataWprowadzenia: newKwestiaDraft[0].dataWprowadzenia,
            kwestiaNazwa: newKwestiaDraft[0].kwestiaNazwa,
            priorytet: parseInt(newKwestiaDraft[0].priorytet),
            sredniaPriorytet: parseFloat(newKwestiaDraft[0].sredniaPriorytet),
            temat_id: newKwestiaDraft[0].temat_id,
            rodzaj_id: newKwestiaDraft[0].rodzaj_id,
            glosujacy_id: newKwestiaDraft[0].glosujacy_id,
            dataDyskusji: newKwestiaDraft[0].dataDyskusji,
            dataGlosowania: moment(newKwestiaDraft[0].dataGlosowania).format(),
            czyAktywny: newKwestiaDraft.czyAktywny=true,
            status: newKwestiaDraft.status="deliberowana",
            krotkaTresc: newKwestiaDraft[0].krotkaTresc,
            szczegolowaTresc: newKwestiaDraft[0].szczegolowaTresc,
            glosujacy: []
        });
        return id;
    },
    updateKwestia: function (kwestiaId, kwestia) {
        Kwestia.update(kwestiaId, {$set: kwestia}, {upsert: true});
    },
    addKwestiaDraft: function(newKwestiaDraft){
        var id = KwestiaDraft.insert({
            userId: Meteor.userId(),
            dataWprowadzenia: newKwestiaDraft[0].dataWprowadzenia,
            kwestiaNazwa: newKwestiaDraft[0].kwestiaNazwa,
            priorytet: parseInt(newKwestiaDraft[0].priorytet),
            sredniaPriorytet: parseFloat(newKwestiaDraft[0].sredniaPriorytet),
            temat_id: newKwestiaDraft[0].temat_id,
            rodzaj_id: newKwestiaDraft[0].rodzaj_id,
            glosujacy_id: newKwestiaDraft[0].glosujacy_id,
            dataDyskusji: newKwestiaDraft[0].dataDyskusji,
            dataGlosowania: moment(newKwestiaDraft[0].dataGlosowania).format(),
            czyAktywny: newKwestiaDraft.czyAktywny=true,
            status: newKwestiaDraft.status="deliberowana",
            krotkaTresc: newKwestiaDraft[0].krotkaTresc,
            szczegolowaTresc: newKwestiaDraft[0].szczegolowaTresc,
            glosujacy: []
        });
        return id;
    },
    updateKwestiaDraft: function(kwestiaDraft){
        var page = PagesDraft.findOne({_id: kwestiaDraft._id});
        KwestiaDraft.upsert({_id: kwestiaDraft._id}, kwestiaDraft);
        return kwestiaDraft._id;
    }
});
