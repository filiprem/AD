Meteor.methods({
    addParametr: function(newParametr) {
        Parametr.insert({
            nazwaOrganizacji: newParametr[0].nazwaOrganizacji,
            terytorium: newParametr[0].terytorium,
            kontakty: newParametr[0].kontakty,
            regulamin: newParametr[0].regulamin,
            pktDodanieKwestii: newParametr[0].pktDodanieKwestii,
            pktDodanieKomentarza: newParametr[0].pktDodanieKomentarza,
            pktDodanieOdniesienia: newParametr[0].pktDodanieOdniesienia,
            pktNadaniePriorytetu: newParametr[0].pktNadaniePriorytetu,
            pktAwansKwestii: newParametr[0].pktAwansKwestii,
            pktUdzialWZespoleRealizacyjnym: newParametr[0].pktUdzialWZespoleRealizacyjnym,
            pktZlozenieRaportuRealizacyjnego: newParametr[0].pktZlozenieRaportuRealizacyjnego,
            pktWycofanieKwestiiDoArchiwum: newParametr[0].pktWycofanieKwestiiDoArchiwum,
            pktWycofanieKwestiiDoKosza: newParametr[0].pktWycofanieKwestiiDoKosza,
            pktWyjscieZZespoluRealizacyjnego: newParametr[0].pktWyjscieZZespoluRealizacyjnego,
            pktBrakUdzialuWGlosowaniu: newParametr[0].pktBrakUdzialuWGlosowaniu,
        });
    },
    updateParametr: function(id, parametr){
        Parametr.update({_id:id}, {$set: parametr}, {upsert: true});
    },
    removeParametr: function(id){
        Parametr.remove({_id: id});
    }
});