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
        Router.go("listKwestia");
    },
    'click #save': function(e){
        e.preventDefault();

        var kwestia = Session.get("kwestiaPreviewOpcja");
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
                Session.set("kwestiaPreviewOpcja",null);
                Router.go('listKwestia');
            }
        });
    }
});