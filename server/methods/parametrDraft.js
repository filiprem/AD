Meteor.methods({
    addParametrDraft: function(newParametr) {
        var id = ParametrDraft.insert({
            nazwaOrganizacji: newParametr.nazwaOrganizacji,
            terytorium: newParametr.terytorium,
            kontakty: newParametr.kontakty,
            regulamin: newParametr.regulamin,
            voteDuration:newParametr.voteDuration,
            voteQuantity:newParametr.voteQuantity,
            czasWyczekiwaniaKwestiiSpecjalnej:newParametr.czasWyczekiwaniaKwestiiSpecjalnej,
            addIssuePause:newParametr.addIssuePause,
            addCommentPause:newParametr.addCommentPause,
            addReferencePause:newParametr.addReferencePause,
            czyAktywny:true
        });
        return id;
    },
    updateParametrDraft: function(id, parametr){
        ParametrDraft.update({_id:id}, {$set: parametr}, {upsert: true});
    },
    removeParametrDraft: function(id){
        ParametrDraft.remove({_id: id});
    },
    setActivityParametrDraft:function(id,czyAktywny){
        ParametrDraft.update(id, {$set: {czyAktywny: czyAktywny}}, {upsert: true});
    }
});