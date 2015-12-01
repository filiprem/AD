Meteor.methods({
    // metody Kwestia GŁÓWNA
    addKwestia:function(newKwestia){
        var z = ZespolRealizacyjnyDraft.insert({nazwa: "", zespol: []});
        var issueNumber = "";
        Meteor.call('generateNextIssueNumber', function (error, ret) {
            if (error) {
                console.log(error.reason);
            } else {
                issueNumber = ret;
            }
        });
        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
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
            glosujacyWRealizacji:[],
            isOption: false,
            numerUchwały: newKwestia[0].numerUchwały,
            typ:newKwestia[0].typ,

            //Marzena
            idZespolRealizacyjny: z,
            issueNumber: issueNumber
        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        return id;
    },
    addKwestiaOsobowa: function (newKwestia) {
        var issueNumber = "";
        Meteor.call('generateNextIssueNumber', function (error, ret) {
            if (error) {
                console.log(error.reason);
            } else {
                issueNumber = ret;
            }
        });
        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
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
            glosujacyWRealizacji:[],
            isOption: false,
            numerUchwały: newKwestia[0].numerUchwały,
            idZespolRealizacyjny: newKwestia[0].idZespolRealizacyjny,
            typ:newKwestia[0].typ,
            issueNumber: issueNumber
        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        return id;
    },
    //ta metoda ma dodatkowo idZlgaszajacego,
    //gdy tworzymy kwestię statusową, idUser: to osoba zgłaszajaca doradcę na honorowego
    //idZglaszającego- osoba zgłaszana
    addKwestiaStatusowa: function (newKwestia) {
        var issueNumber = "";
        Meteor.call('generateNextIssueNumber', function (error, ret) {
            if (error) {
                console.log(error.reason);
            } else {
                issueNumber = ret;
            }
        });
        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            //dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: newKwestia[0].dataGlosowania,
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            glosujacyWRealizacji:[],
            isOption: false,
            idZglaszajacego: newKwestia[0].idZglaszajacego,
            isAnswerPositive:newKwestia[0].isAnswerPositive,
            dataRozpoczeciaOczekiwania:newKwestia[0].dataRozpoczeciaOczekiwania,
            typ:newKwestia[0].typ,
            idZespolRealizacyjny: newKwestia[0].idZespolRealizacyjny,
            issueNumber: issueNumber
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
     var issueNumber = "";
     Meteor.call('generateNextIssueNumber', function (error, ret) {
         if (error) {
             console.log(error.reason);
         } else {
             issueNumber = ret;
         }
     });
        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            startGlosowania:newKwestia[0].startGlosowania,
            dataGlosowania: null,
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            //glosujacyWRealizacji:[],
            idParametr : newKwestia[0].idParametr,
            typ:newKwestia[0].typ,
            issueNumber: issueNumber
        });
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
        var issueNumber = "";
        Meteor.call('generateNextIssueNumber', function (error, ret) {
            if (error) {
                console.log(error.reason);
            } else {
                issueNumber = ret;
            }
        });

        var id = Kwestia.insert({
            idUser: Meteor.userId(),
            dataWprowadzenia: newKwestiaOpcja[0].dataWprowadzenia,
            kwestiaNazwa: newKwestiaOpcja[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestiaOpcja[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestiaOpcja[0].wartoscPriorytetuWRealizacji),
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
            glosujacyWRealizacji:[],
            isOption: true,
            idParent: newKwestiaOpcja[0].idParent,
            numerUchwały: newKwestiaOpcja[0].numerUchwały,
            idZespolRealizacyjny: z,
            typ:newKwestiaOpcja[0].typ,
            issueNumber: issueNumber
        });
        //var z = ZespolRealizacyjny.insert({idKwestia: id, nazwa: "", zespol: []});
        return id;
    },
    addKwestiaOsobowaOpcja: function (newKwestia) {
        var issueNumber = "";
        Meteor.call('generateNextIssueNumber', function (error, ret) {
            if (error) {
                console.log(error.reason);
            } else {
                issueNumber = ret;
            }
        });

        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
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
            glosujacyWRealizacji:[],
            isOption: true,
            numerUchwały: newKwestia[0].numerUchwały,
            idZespolRealizacyjny: newKwestia[0].idZespolRealizacyjny,
            idParent: newKwestia[0].idParent,
            typ:newKwestia[0].typ,
            issueNumber: issueNumber
        });
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
    updateKwestiaWRealizacjiRating: function (id, obj) {
        var id = Kwestia.update(id,
            {
                $set: {
                    wartoscPriorytetuWRealizacji: obj[0].wartoscPriorytetuWRealizacji,
                    glosujacyWRealizacji: obj[0].glosujacyWRealizacji
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
    updateIdZR: function (id, idZespolRealizacyjny) {
        var id = Kwestia.update(id, {$set: {idZespolRealizacyjny: idZespolRealizacyjny}}, {upsert: true});
        return id;
    },
    updateStatusNrUchwalyDataRealizacjiiKwestii: function (id, status,numerUchwaly,data) {
        var id = Kwestia.update(id, {$set: {status: status,numerUchwaly:numerUchwaly,dataRealizacji:data}}, {upsert: true});
        return id;
    },
    updateStatNrUchwDtRealIdZespolKwestiiNazwa: function (id, status, numerUchwaly, dataRealizacji,idZR,kwestiaNazwa) {
        var id = Kwestia.update(id, {
            $set: {
                kwestiaNazwa:kwestiaNazwa,
                status: status,
                numerUchwaly: numerUchwaly,
                dataRealizacji: dataRealizacji,
                idZespolRealizacyjny:idZR,
                listaDatRR:[moment(new Date()).format()]
            }
        }, {upsert: true});
        return id;
    },
    updateStatNrUchwDtRealIdZespolKwestii: function (id, status, numerUchwaly, dataRealizacji,idZR) {
        var id = Kwestia.update(id, {
            $set: {
                status: status,
                numerUchwaly: numerUchwaly,
                dataRealizacji: dataRealizacji,
                idZespolRealizacyjny:idZR,
                listaDatRR:[moment(new Date()).format()]
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
    updateStatusDataGlosowaniaKwestiiFinal: function (id, status, dataGlosowania,start) {
        var id = Kwestia.update(id, {
            $set: {
                status: status,
                dataGlosowania: dataGlosowania,
                startGlosowania:start
            }
        }, {upsert: true});
        return id;
    },
    removeKwestia: function(id){
        Kwestia.update(id,{$set: {czyAktywny: false}}, {upsert: true});
    },
    removeKwestiaSetReason: function(id,reason){
        Kwestia.update(id,{$set: {czyAktywny: false,reason:reason}}, {upsert: true});
    },
    removeKwestiaSetReasonAnswer: function(id,reason,answer){
        Kwestia.update(id,{$set: {czyAktywny: false,reason:reason,isAnswerPositive:answer}}, {upsert: true});
    },
    setAnswerKwestiaOczekujaca:function(id,answer){
        Kwestia.update(id,{$set: {isAnswerPositive:answer}}, {upsert: true});
    },
    setAnswerKwestiaOczekujacaNrUchwDataRealizacji:function(id,answer,nrUch,dataRealizacji){
        Kwestia.update(id,{$set: {isAnswerPositive:answer,numerUchwaly:nrUch,dataRealizacji:dataRealizacji}}, {upsert: true});
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
    },
    addConstZR:function(id,zespol){//,{$unset:{idZespolRealizacyjny:''}}
        var id = Kwestia.update(id, {$set: {zespol: zespol}});
        return id;
    },
    updateKwestiaCzasLobbowana:function(id,lobbowana){//,{$unset:{idZespolRealizacyjny:''}}
        var id = Kwestia.update(id, {$set: {lobbowana:lobbowana}});
        return id;
    },
    updateReportsIssue:function(id,reports){
        var id = Kwestia.update(id, {$set: {raporty:reports}});
    },
    updateDeadlineNextRR:function(id,checkArrayRR){
        Kwestia.update(id, {$set: {listaDatRR:checkArrayRR}});
    }
});
