Template.previewKwestiaOpcja.helpers({
    getTematName:function(id){
        return Temat.findOne({_id:id}).nazwaTemat;
    },
    getRodzajName:function(id){
        return Rodzaj.findOne({_id:id}).nazwaRodzaj;
    }
});

Template.previewKwestiaOpcja.events({
    'click #cancel':function(){
        Session.set("kwestiaPreviewOpcja",null);
        Session.set("actualKwestiaId",null);
        Router.go("listKwestia");
    },
    'click #save': function(e){
        e.preventDefault();

        var kwestia = Session.get("kwestiaPreviewOpcja");
        console.log(kwestia);
        var idParentKwestii = Session.get("idKwestia");
        var newKwestiaOpcja = [{
            idUser: Meteor.userId(),
            dataWprowadzenia: new Date(),
            kwestiaNazwa: kwestia.kwestiaNazwa,
            wartoscPriorytetu: 0,
            sredniaPriorytet: 0,
            idTemat: kwestia.idTemat,
            idRodzaj: kwestia.idRodzaj,
            dataDyskusji: kwestia.dataDyskusji,
            dataGlosowania: kwestia.dataGlosowania,
            krotkaTresc: kwestia.krotkaTresc,
            szczegolowaTresc: kwestia.szczegolowaTresc,
            idParent: idParentKwestii,
            isOption: true
        }];
        Meteor.call('addKwestiaOpcja', newKwestiaOpcja, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else {
                var userKwestia= Meteor.userId();
                var newValue=0;
                var pktAddKwestia=Parametr.findOne({});
                newValue=Number(pktAddKwestia.pktDodanieKwestii)+getUserRadkingValue(userKwestia);

                Meteor.call('updateUserRanking', userKwestia,newValue, function (error) {
                    if (error)
                    {
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else {
                            throwError(error.reason);
                        }
                    }
                });

                Session.set("kwestiaPreviewOpcja",null);
                Session.set("actualKwestiaId",null);
                Router.go('listKwestia');
            }
        });
    }
});