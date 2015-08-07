Meteor.methods({
    // metody Kwestia GŁÓWNA
    addKwestia: function(newKwestia) {
        var id = Kwestia.insert({
            userId: Meteor.userId(),
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            sredniaPriorytet: parseFloat(newKwestia[0].sredniaPriorytet),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            pulapPriorytetu:newKwestia[0].pulapPriorytetu,
            //idGlosujacy: newKwestia[0].idGlosujacy,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: moment(newKwestia[0].dataGlosowania).format(),
            czyAktywny: newKwestia.czyAktywny=true,
            status: newKwestia.status="deliberowana",
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            isOption: false
        });
        return id;
    },
    updateKwestia: function (kwestiaId, kwestia) {
        Kwestia.update(idKwestia, {$set: kwestia}, {upsert: true});
    },

    //metody Kwestia OPCJA
    addKwestiaOpcja: function(newKwestiaOpcja) {
        var id = Kwestia.insert({
            userId: Meteor.userId(),
            dataWprowadzenia: newKwestiaOpcja[0].dataWprowadzenia,
            kwestiaNazwa: newKwestiaOpcja[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestiaOpcja[0].wartoscPriorytetu),
            sredniaPriorytet: parseFloat(newKwestiaOpcja[0].sredniaPriorytet),
            idTemat: newKwestiaOpcja[0].idTemat,
            idRodzaj: newKwestiaOpcja[0].idRodzaj,
            pulapPriorytetu:newKwestiaOpcja[0].pulapPriorytetu,
            //glosujacy_id: newKwestiaOpcja[0].glosujacy_id,
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
    //updateKwestiaDraft: function(kwestiaDraft){
    //    var page = PagesDraft.findOne({_id: kwestiaDraft._id});
    //    KwestiaDraft.upsert({_id: kwestiaDraft._id}, kwestiaDraft);
    //    return kwestiaDraft._id;
    //},

    //// metody KwestiaSuspended -  zawieszone kwestie przeznaczone do dyskusji dygresyjnej
    //addKwestiaSuspended: function(newKwestiaSuspended){
    //    var id = KwestiaSuspended.insert({
    //        kwestia_id: newKwestiaSuspended[0].kwestia_id,
    //        user_id: newKwestiaSuspended[0].user_id,
    //        uzasadnienie: newKwestiaSuspended[0].uzasadnienie,
    //        dataDodania: new Date(),
    //        czyAktywny: newKwestiaSuspended[0].czyAktywny
    //    });
    //    return id;
    //},
    //updateKwestiaSuspended: function(kwestiaSuspended){
    //    KwestiaSuspended.update(kwestiaSuspended[0]._id, {$set:{ uzasadnienie: kwestiaSuspended[0].uzasadnienie}});
    //    return kwestiaSuspended._id;
    //},
    //removeKwestiaSuspended: function(id){
    //    KwestiaSuspended.update(id, {$set:{ czyAktywny: false}});
    //    return KwestiaSuspended.findOne({_id:id}).kwestia_id;
    //},
    //
    ////metody KwestiaSuspendedPosts
    //addKwestiaSuspendedPosts: function(newPost){
    //    var id = KwestiaSuspendedPosts.insert({
    //        kwestia_suspended_id: newPost[0].kwestia_suspended_id,
    //        post_message: newPost[0].post_message,
    //        user_id: newPost[0].user_id,
    //        user_full_name:newPost[0].user_full_name,
    //        add_date: newPost[0].add_date,
    //        isParent: newPost[0].isParent,
    //        czyAktywny: newPost[0].czyAktywny
    //    });
    //    return id;
    //},
    //addKwestiaSuspendedPostsAnswer: function(newPost){
    //    var id = KwestiaSuspendedPosts.insert({
    //        kwestia_suspended_id: newPost[0].kwestia_suspended_id,
    //        post_message: newPost[0].post_message,
    //        user_id: newPost[0].user_id,
    //        user_full_name:newPost[0].user_full_name,
    //        add_date: newPost[0].add_date,
    //        isParent: newPost[0].isParent,
    //        parentId: newPost[0].parentId,
    //        czyAktywny: newPost[0].czyAktywny
    //    });
    //    return id;
    //}
});
