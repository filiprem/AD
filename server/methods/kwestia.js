Meteor.methods({
                // metody Kwestia GŁÓWNA
                addKwestia: function(newKwestia) {
                    var id = Kwestia.insert({
                        idUser: Meteor.userId(),
                        dataWprowadzenia: newKwestia[0].dataWprowadzenia,
                        kwestiaNazwa: newKwestia[0].kwestiaNazwa,
                        wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
                        sredniaPriorytet: parseFloat(newKwestia[0].sredniaPriorytet),
                        idTemat: newKwestia[0].idTemat,
                        idRodzaj: newKwestia[0].idRodzaj,
                        dataDyskusji: newKwestia[0].dataDyskusji,
                        dataGlosowania: moment(newKwestia[0].dataGlosowania).format(),
                        czyAktywny: newKwestia[0].czyAktywny=true,
                        status: newKwestia[0].status,
                        krotkaTresc: newKwestia[0].krotkaTresc,
                        szczegolowaTresc: newKwestia[0].szczegolowaTresc,
                        glosujacy: [],
                        isOption: false,
                        sugerowanyTemat: newKwestia[0].sugerowanyTemat,
            sugerowanyRodzaj: newKwestia[0].sugerowanyRodzaj
        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        return id;
    },
    updateKwestia: function (id, kwestia) {
        Kwestia.update(id, {$set: kwestia}, {upsert: true});
    },

    updateKwestiaNoUpsert: function (id, kwestia) {
        Kwestia.update(id, {$set: kwestia}, {upsert: false});
    },

    //metody Kwestia OPCJA
    addKwestiaOpcja: function(newKwestiaOpcja) {
        var id = Kwestia.insert({
            idUser: Meteor.userId(),
            dataWprowadzenia: newKwestiaOpcja[0].dataWprowadzenia,
            kwestiaNazwa: newKwestiaOpcja[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestiaOpcja[0].wartoscPriorytetu),
            sredniaPriorytet: parseFloat(newKwestiaOpcja[0].sredniaPriorytet),
            idTemat: newKwestiaOpcja[0].idTemat,
            idRodzaj: newKwestiaOpcja[0].idRodzaj,
            dataDyskusji: newKwestiaOpcja[0].dataDyskusji,
            dataGlosowania: moment(newKwestiaOpcja[0].dataGlosowania).format(),
            czyAktywny: newKwestiaOpcja.czyAktywny=true,
            status: newKwestiaOpcja.status="deliberowana",
            krotkaTresc: newKwestiaOpcja[0].krotkaTresc,
            szczegolowaTresc: newKwestiaOpcja[0].szczegolowaTresc,
            glosujacy: [],
            isOption: true,
            idParent: newKwestiaOpcja[0].idParent
        });
        return id;
    },
    updateKwestiaRating: function (id, obj) {
        var id = Kwestia.update(id,
            {$set: {
                wartoscPriorytetu:  obj[0].wartoscPriorytetu,
                glosujacy:  obj[0].glosujacy}
            }, {upsert: true});
        return id;
    }
});
