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
    },

    // metody KwestiaDraft
    addKwestiaDraft: function(newKwestiaDraft){
        var id = KwestiaDraft.insert({
            userId: Meteor.userId(),
            dataWprowadzenia: newKwestiaDraft[0].dataWprowadzenia,
            kwestiaNazwa: newKwestiaDraft[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestiaDraft[0].wartoscPriorytetu),
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
    },

    // metody KwestiaSuspension -  zawieszone kwestie przeznaczone do dyskusji dygresyjnej
    addKwestiaSuspension: function(newKwestiaSuspension){
        var id = KwestiaSuspension.insert({
            kwestia_id: newKwestiaSuspension[0].kwestia_id,
            user_id: newKwestiaSuspension[0].user_id,
            uzasadnienie: newKwestiaSuspension[0].uzasadnienie,
            dataDodania: new Date(),
            czyAktywny: newKwestiaSuspension[0].czyAktywny
        });
        return id;
    },
    updateKwestiaSuspension: function(kwestiaSuspension){
        KwestiaSuspension.update(kwestiaSuspension[0]._id, {$set:{ uzasadnienie: kwestiaSuspension[0].uzasadnienie}});
        return kwestiaSuspension._id;
    },
    removeKwestiaSuspension: function(id){
        KwestiaSuspension.update(id, {$set:{ czyAktywny: false}});
        return KwestiaSuspension.findOne({_id:id}).kwestia_id;
    },

    //metody KwestiaSuspensionPosts
    addKwestiaSuspensionPosts: function(newPost){
        var id = KwestiaSuspensionPosts.insert({
            kwestia_suspension_id: newPost[0].kwestia_suspension_id,
            post_message: newPost[0].post_message,
            user_id: newPost[0].user_id,
            user_full_name:newPost[0].user_full_name,
            add_date: newPost[0].add_date,
            isParent: newPost[0].isParent,
            czyAktywny: newPost[0].czyAktywny
        });
        return id;
    },
    addKwestiaSuspensionPostsAnswer: function(newPost){
        var id = KwestiaSuspensionPosts.insert({
            kwestia_suspension_id: newPost[0].kwestia_suspension_id,
            post_message: newPost[0].post_message,
            user_id: newPost[0].user_id,
            user_full_name:newPost[0].user_full_name,
            add_date: newPost[0].add_date,
            isParent: newPost[0].isParent,
            parentId: newPost[0].parentId,
            czyAktywny: newPost[0].czyAktywny
        });
        return id;
    }
});
