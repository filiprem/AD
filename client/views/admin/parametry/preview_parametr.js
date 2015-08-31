Template.previewParametr.helpers({
    parameters: function () {
        return Session.get("tablica");
    }
});
Template.previewParametr.events({
    'click #save': function (e) {
        e.preventDefault();
        var params = Session.get("parametryPreview");

        var updateParam =
        {
            nazwaOrganizacji: params.nazwaOrganizacji,
            terytorium: params.terytorium,
            kontakty: params.kontakty,
            regulamin: params.regulamin,

            pktDodanieKwestii: params.pktDodanieKwestii,
            pktDodanieKomentarza: params.pktDodanieKomentarza,
            pktDodanieOdniesienia: params.pktDodanieOdniesienia,
            pktNadaniePriorytetu: params.pktNadaniePriorytetu,
            pktAwansKwestii: params.pktAwansKwestii,
            pktUdzialWZespoleRealizacyjnym: params.pktUdzialWZespoleRealizacyjnym,
            pktZlozenieRaportuRealizacyjnego: params.pktZlozenieRaportuRealizacyjnego,
            pktWycofanieKwestiiDoArchiwum: params.pktWycofanieKwestiiDoArchiwum,
            pktWycofanieKwestiiDoKosza: params.pktWycofanieKwestiiDoKosza,
            pktWyjscieZZespoluRealizacyjnego: params.pktWyjscieZZespoluRealizacyjnego,
            pktBrakUdzialuWGlosowaniu: params.pktBrakUdzialuWGlosowaniu,
            okresSledzeniaWatkuPrzenoszacego: params.okresSledzeniaWatkuPrzenoszacego
        };

        Meteor.call('updateParametr', params._id, updateParam, function (error) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            } else {
                Session.set("tablica", null);
                Router.go('listParametr');
            }
        });
    },
    'reset form': function () {
        Session.set("tablica", null);
        Router.go('listParametr');
    }
});