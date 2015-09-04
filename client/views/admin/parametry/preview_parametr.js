Template.previewParametr.helpers({
    parameters: function () {
        return Session.get("tablica");
    }
});
Template.previewParametr.events({
    'click #save': function (e) {
        e.preventDefault();
        var params = Session.get("parametryPreview");
     
        var addParamDraft =
        {
            nazwaOrganizacji: params.nazwaOrganizacji,
            terytorium: params.terytorium,
            kontakty: params.kontakty,
            regulamin: params.regulamin,

          /*  pktDodanieKwestii: params.pktDodanieKwestii,
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
            okresSledzeniaWatkuPrzenoszacego: params.okresSledzeniaWatkuPrzenoszacego*/
        };

        Meteor.call('addParametrDraft', addParamDraft, function (error,ret) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            } else {
                  var id = ret ;
                  var danezfor = Session.get("tablica");
                 
                 /* var dane = "ZMIANY parametrów : " + "Z : " + danezfor. + " NA : " +
                    addParamDraft.nazwaOrganizacji + " \r\n " +
                    addParamDraft.terytorium + ", \r\n " +
                    addParamDraft.kontakty + ", \r\n " +
                    addParamDraft.regulamin*/
                    var dane = "";
                   
                        danezfor.forEach(function(i){ dane = dane + i.paramName + "  zostanie zmieniony z : "+ i.initialValue + " na : "+i.newValue+ " \r\n "})
                    
                     console.log(dane);
                        var dataG = new Date();
         var d = dataG.setDate(dataG.getDate() + 7);
         var newKwestia = [
                    {
                        idUser: Meteor.userId(),
                        dataWprowadzenia: new Date(),
                        kwestiaNazwa: 'Propozycja zmiany parametrów globalnych  przez ' +Meteor.user().profile.firstName +"  "+ Meteor.user().profile.lastName ,
                        wartoscPriorytetu: 0,
                        sredniaPriorytet: 0,
                        //idTemat: Temat.findOne({})._id,
                        //idRodzaj: Rodzaj.findOne({})._id,
                        dataDyskusji: new Date(),
                        dataGlosowania: d,
                        krotkaTresc: 'Propozycja zmiany parametrów globalnych' ,
                        szczegolowaTresc: dane,
                        isOption: false,
                        status: KWESTIA_STATUS.ADMINISTROWANA,
                        idParametru : id
                    }];
            var idKwesti = Meteor.call('addKwestiaADMINISTROWANA', newKwestia, function (error) {
                  
                    if (error) {
                           
                        // optionally use a meteor errors package
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else {
                            //if(error.error === 409)
                            throwError(error.reason);
                        }
                    }
                    else { 
      
                        Router.go("home");
                      
                    }
                }); 
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