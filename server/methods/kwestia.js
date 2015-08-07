Meteor.methods({
    // metody Kwestia
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
            idGlosujacy: newKwestia[0].idGlosujacy,
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
        Kwestia.update(idKwestia, {$set: kwestia}, {upsert: true});
    },

    // metody KwestiaDraft
    addKwestiaDraft: function(newKwestiaDraft){
        var id = KwestiaDraft.insert({
            userId: Meteor.userId(),
            dataWprowadzenia: newKwestiaDraft[0].dataWprowadzenia,
            kwestiaNazwa: newKwestiaDraft[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestiaDraft[0].wartoscPriorytetu),
            sredniaPriorytet: parseFloat(newKwestiaDraft[0].sredniaPriorytet),
            idTemat: newKwestiaDraft[0].idTemat,
            idRodzaj: newKwestiaDraft[0].idRodzaj,
            idGlosujacy: newKwestiaDraft[0].idGlosujacy,
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
    },

    // metody KwestiaSuspended -  zawieszone kwestie przeznaczone do dyskusji dygresyjnej
    addKwestiaSuspended: function(newKwestiaSuspended){
        var id = KwestiaSuspended.insert({
            idKwestia: newKwestiaSuspended[0].idKwestia,
            userId: newKwestiaSuspended[0].userId,
            uzasadnienie: newKwestiaSuspended[0].uzasadnienie,
            dataDodania: new Date(),
            czyAktywny: newKwestiaSuspended[0].czyAktywny
        });
        return id;
    },
    updateKwestiaSuspended: function(kwestiaSuspended){
        KwestiaSuspended.update(kwestiaSuspended[0]._id, {$set:{ uzasadnienie: kwestiaSuspended[0].uzasadnienie}});
        return kwestiaSuspended._id;
    },
    removeKwestiaSuspended: function(id){
        KwestiaSuspended.update(id, {$set:{ czyAktywny: false}});
        return KwestiaSuspended.findOne({_id:id}).idKwestia;
    },

    //metody KwestiaSuspendedPosts
    addKwestiaSuspendedPosts: function(newPost){
        var id = KwestiaSuspendedPosts.insert({
            kwestiaSuspendedId: newPost[0].kwestiaSuspendedId,
            post_message: newPost[0].post_message,
            userId: newPost[0].userId,
            userFullName:newPost[0].userFullName,
            addDate: newPost[0].addDate,
            isParent: newPost[0].isParent,
            czyAktywny: newPost[0].czyAktywny
        });
        return id;
    },
    addKwestiaSuspendedPostsAnswer: function(newPost){
        var id = KwestiaSuspendedPosts.insert({
            kwestiaSuspendedId: newPost[0].kwestiaSuspendedId,
            post_message: newPost[0].post_message,
            userId: newPost[0].userId,
            userFullName:newPost[0].userFullName,
            addDate: newPost[0].addDate,
            isParent: newPost[0].isParent,
            parentId: newPost[0].parentId,
            czyAktywny: newPost[0].czyAktywny
        });
        return id;
    }
});
