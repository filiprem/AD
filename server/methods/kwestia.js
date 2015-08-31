Meteor.methods({
    // metody Kwestia GŁÓWNA
    addKwestia: function (newKwestia) {
        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            sredniaPriorytet: parseFloat(newKwestia[0].sredniaPriorytet),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: moment(newKwestia[0].dataGlosowania).format(),
            dataRealizacji: newKwestia[0].dataRealizacji,
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            isOption: false,
            sugerowanyTemat: newKwestia[0].sugerowanyTemat,
            sugerowanyRodzaj: newKwestia[0].sugerowanyRodzaj,
            numerUchwały: newKwestia[0].numerUchwały

        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        var z = ZespolRealizacyjny.insert({idKwestia: id, nazwa: "", zespol: []});
        return id;
    },
    //ta metoda ma dodatkowo idZlgaszajacego,
    //gdy tworzymy kwestię statusową, idUser: to osoba zgłaszajaca doradcę na honorowego
    //idZglaszającego- osoba zgłaszana
    addKwestiaStatusowa: function (newKwestia) {
        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            sredniaPriorytet: parseFloat(newKwestia[0].sredniaPriorytet),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: moment(newKwestia[0].dataGlosowania).format(),
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            isOption: false,
            sugerowanyTemat: newKwestia[0].sugerowanyTemat,
            sugerowanyRodzaj: newKwestia[0].sugerowanyRodzaj,
            idZgloszonego:newKwestia[0].idZgloszonego
        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        var z = ZespolRealizacyjny.insert({idKwestia: id, nazwa: "", zespol: []});
        return id;
    },
    updateKwestia: function (id, kwestia) {
        Kwestia.update(id, {$set: kwestia}, {upsert: true});
    },

    updateKwestiaNoUpsert: function (id, kwestia) {
        Kwestia.update(id, {$set: kwestia}, {upsert: false});
    },

    //metody Kwestia OPCJA
    addKwestiaOpcja: function (newKwestiaOpcja) {
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
            dataRealizacji: newKwestiaOpcja[0].dataRealizacji,
            czyAktywny: newKwestiaOpcja.czyAktywny = true,
            status: newKwestiaOpcja.status = KWESTIA_STATUS.DELIBEROWANA,
            krotkaTresc: newKwestiaOpcja[0].krotkaTresc,
            szczegolowaTresc: newKwestiaOpcja[0].szczegolowaTresc,
            glosujacy: [],
            isOption: true,
            idParent: newKwestiaOpcja[0].idParent,
            numerUchwały: newKwestiaOpcja[0].numerUchwały
        });
        var z = ZespolRealizacyjny.insert({idKwestia: id, nazwa: "", zespol: []});
        return id;
    },
    updateKwestiaRating: function (id, obj) {
        var id = Kwestia.update(id,
            {
                $set: {
                    wartoscPriorytetu: obj[0].wartoscPriorytetu,
                    glosujacy: obj[0].glosujacy
                }
            }, {upsert: true});
        return id;
    },
    setGlosujacyTab: function (id, obj) {
        var id = Kwestia.update(id, {$set: {glosujacy: obj}}, {upsert: true});
        return id;
    },
    updateWartoscPriorytetu: function (id, obj) {
        var id = Kwestia.update(id, {$set: {wartoscPriorytetu: obj}}, {upsert: true});
        return id;
    },
    updateZespolRealizacyjny: function(id, obj){
        var id = ZespolRealizacyjny.update(id,
            {
                $set: {
                    zespol: obj
                }
        });
        return id;
    },
    updateStatusKwestii:function(id,status){
        var id = Kwestia.update(id, {$set: {status: status}}, {upsert: true});
        return id;
    }
});
