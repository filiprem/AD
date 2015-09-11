Meteor.methods({
    // metody Kwestia GŁÓWNA
    addKwestia: function (newKwestia) {
        var z = ZespolRealizacyjnyDraft.insert({nazwa: "", zespol: []});

        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
            sredniaPriorytet: parseFloat(newKwestia[0].sredniaPriorytet),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: newKwestia[0].dataGlosowania,
            dataRealizacji: newKwestia[0].dataRealizacji,
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            isOption: false,
            numerUchwały: newKwestia[0].numerUchwały,

            //Marzena
            idZespolRealizacyjny: z
        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        return id;
    },
    //ta metoda ma dodatkowo idZlgaszajacego,
    //gdy tworzymy kwestię statusową, idUser: to osoba zgłaszajaca doradcę na honorowego
    //idZglaszającego- osoba zgłaszana
    addKwestiaStatusowa: function (newKwestia) {
        var z = ZespolRealizacyjnyDraft.insert({nazwa: "", zespol: []});

        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
            sredniaPriorytet: parseFloat(newKwestia[0].sredniaPriorytet),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: newKwestia[0].dataGlosowania,
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            isOption: false,
            idZgloszonego: newKwestia[0].idZgloszonego,
            isAnswerPositive:newKwestia[0].isAnswerPositive,
            dataRozpoczeciaOczekiwania:newKwestia[0].dataRozpoczeciaOczekiwania,

            idZespolRealizacyjny: z
        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        //var z = ZespolRealizacyjny.insert({idKwestia: id, nazwa: "", zespol: []});
        return id;
    },
    updateKwestia: function (id, kwestia) {
        Kwestia.update(id, {$set: kwestia}, {upsert: true});
    },

    updateKwestiaNoUpsert: function (id, kwestia) {
        Kwestia.update(id, {$set: kwestia}, {upsert: false});
    },
//// metoda Kwestia ADMINISTROWANA
 addKwestiaADMINISTROWANA: function (newKwestia) {
        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
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
            idParametru : newKwestia[0].idParametru,
            
           
        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        var z = ZespolRealizacyjnyDraft.insert({idKwestia: id, nazwa: "", zespol: []});
        return id;
    },
  /*  updateKwestia: function (id, kwestia) {
        Kwestia.update(id, {$set: kwestia}, {upsert: true});
    },

    updateKwestiaNoUpsert: function (id, kwestia) {
        Kwestia.update(id, {$set: kwestia}, {upsert: false});
    },*/
    //metody Kwestia OPCJA
    addKwestiaOpcja: function (newKwestiaOpcja) {
        var z = ZespolRealizacyjnyDraft.insert({idKwestia: id, nazwa: "", zespol: []});

        var id = Kwestia.insert({
            idUser: Meteor.userId(),
            dataWprowadzenia: newKwestiaOpcja[0].dataWprowadzenia,
            kwestiaNazwa: newKwestiaOpcja[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestiaOpcja[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
            sredniaPriorytet: parseFloat(newKwestiaOpcja[0].sredniaPriorytet),
            idTemat: newKwestiaOpcja[0].idTemat,
            idRodzaj: newKwestiaOpcja[0].idRodzaj,
            dataDyskusji: newKwestiaOpcja[0].dataDyskusji,
            dataGlosowania: newKwestiaOpcja[0].dataGlosowania,
            dataRealizacji: newKwestiaOpcja[0].dataRealizacji,
            czyAktywny: newKwestiaOpcja.czyAktywny = true,
            status: newKwestiaOpcja.status = KWESTIA_STATUS.DELIBEROWANA,
            krotkaTresc: newKwestiaOpcja[0].krotkaTresc,
            szczegolowaTresc: newKwestiaOpcja[0].szczegolowaTresc,
            glosujacy: [],
            isOption: true,
            idParent: newKwestiaOpcja[0].idParent,
            numerUchwały: newKwestiaOpcja[0].numerUchwały,

            //Marzena
            idZespolRealizacyjny: z
        });
        //var z = ZespolRealizacyjny.insert({idKwestia: id, nazwa: "", zespol: []});
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
    updateStatusKwestii: function (id, status) {
        var id = Kwestia.update(id, {$set: {status: status}}, {upsert: true});
        return id;
    },
    updateStatNrUchwDtRealIdZespolKwestii: function (id, status, numerUchwaly, dataRealizacji,idZR) {
        var id = Kwestia.update(id, {
            $set: {
                status: status,
                numerUchwaly: numerUchwaly,
                dataRealizacji: dataRealizacji,
                idZespolRealizacyjny:idZR
            }
        }, {upsert: true});
        return id;
    },
    updateStatusDataGlosowaniaKwestii: function (id, status, dataGlosowania) {
        var id = Kwestia.update(id, {
            $set: {
                status: status,
                dataGlosowania: dataGlosowania
            }
        }, {upsert: true});
        return id;
    },
    removeKwestia: function(id){
        Kwestia.update(id,{$set: {czyAktywny: false}}, {upsert: true});
    },
    updateStatIdZespolu:function(id,status,idZR){
        var id = Kwestia.update(id, {
            $set: {
                status: status,
                idZespolRealizacyjny:idZR
            }
        }, {upsert: true});
        return id;
    },
    updateStatusDataOczekwianiaKwestii: function (id, status,dataOczekiwania) {
        console.log("ten status");
        console.log(status);
        console.log(dataOczekiwania);
        var id = Kwestia.update(id, {$set: {status: status, dataRozpoczeciaOczekiwania:dataOczekiwania}}, {upsert: true});
        return id;
    }
});
