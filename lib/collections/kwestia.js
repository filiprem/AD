Kwestia = new Mongo.Collection('kwestia');

Kwestia.allow({
    insert: function(){
        return true;
    },
    update: function () {
        return true;
    },
    remove: function(){
        return true;
    }
});

Meteor.methods({
    addKwestia: function(newKwestia) {
        Kwestia.insert({
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            priorytet: parseInt(newKwestia[0].priorytet),
            sredniaPriorytet: parseFloat(newKwestia[0].sredniaPriorytet),
            temat_id: newKwestia[0].temat_id,
            rodzaj_id: newKwestia[0].rodzaj_id,
            glosujacy_id: newKwestia[0].glosujacy_id,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: moment(newKwestia[0].dataGlosowania).format(),
            //historia: newKwestia[0].historia,
            czyAktywny: newKwestia.czyAktywny=true,
            status: newKwestia.status="deliberowana",
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: []
        });
    }
});
