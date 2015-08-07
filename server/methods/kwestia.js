Meteor.methods({
    // metody Kwestia
    addKwestia: function(newKwestia) {
        var id = Kwestia.insert({
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
    }
});
