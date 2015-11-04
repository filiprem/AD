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
            voteDuration:params.voteDuration,
            voteQuantity:params.voteQuantity,
            czasWyczekiwaniaKwestiiSpecjalnej:params.czasWyczekiwaniaKwestiiSpecjalnej,
            addIssuePause:params.addIssuePause,
            addCommentPause:params.addCommentPause,
            addReferencePause:params.addReferencePause
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

                    var dane = "";
                   
                    danezfor.forEach(function(i){
                        dane = dane + i.paramName + "  zostanie zmieniony z : "+
                            i.initialValue + " na : "+i.newValue+ " \r\n "});
                    
                     console.log(dane);

                     var newKwestia = [
                    {
                        idUser: Meteor.userId(),
                        dataWprowadzenia: new Date(),
                        kwestiaNazwa: 'Propozycja zmiany parametrów globalnych  przez ' +Meteor.user().profile.firstName +"  "+ Meteor.user().profile.lastName ,
                        wartoscPriorytetu: 0,
                        dataGlosowania: null,
                        krotkaTresc: 'Propozycja zmiany parametrów globalnych' ,
                        szczegolowaTresc: dane,
                        isOption: false,
                        status: KWESTIA_STATUS.ADMINISTROWANA,
                        idParametr : id,
                        typ:KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE
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
      
                        Router.go("administracjaUserMain");
                      
                    }
                }); 
                Session.set("tablica", null);
                Router.go('administracjaUserMain');
            }
           
           
        });
         
		  
    },
    'reset form': function () {
        Session.set("tablica", null);
        Router.go('listParametr');
    }
});