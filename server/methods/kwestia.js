Meteor.methods({
    //poprawiæ aby z draftu robi³o kwestiê po zatwierdzeniu przez uzytkownika
    addKwestia: function(newKwestia) {
        var id = KwestiaDraft.insert({
            userId: Meteor.userId(),
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            sredniaPriorytet: parseFloat(newKwestia[0].sredniaPriorytet),
            temat_id: newKwestia[0].temat_id,
            rodzaj_id: newKwestia[0].rodzaj_id,
            pulapPriorytetu:newKwestia[0].pulapPriorytetu,
            glosujacy_id: newKwestia[0].glosujacy_id,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: moment(newKwestia[0].dataGlosowania).format(),
            czyAktywny: newKwestia.czyAktywny=true,
            status: newKwestia.status="deliberowana",
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
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
