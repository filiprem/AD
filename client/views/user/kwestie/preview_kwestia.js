Template.previewKwestia.helpers({
    getTematName:function(id){
        return Temat.findOne({_id:id}).nazwaTemat;
    },
    getRodzajName:function(id){
        return Rodzaj.findOne({_id:id}).nazwaRodzaj;
    }
});

Template.previewKwestia.events({
    'click #cancel':function(){
        Session.set("kwestiaPreview",null);
        Router.go("listKwestia");
    },
    'click #save': function(e){
        e.preventDefault();

        var kwestia = Session.get("kwestiaPreview");
        var idParentKwestii = Session.get("idKwestia");
        if(kwestia.idParent){
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
                    Session.set("kwestiaPreview",null);
                    Router.go('listKwestia');
                }
            });
        } else {
            var status = KWESTIA_STATUS.KATEGORYZOWANA;
            var newKwestia = [{
                    idUser: Meteor.userId(),
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: kwestia.kwestiaNazwa,
                    wartoscPriorytetu: 0,
                    sredniaPriorytet: 0,
                    idTemat: kwestia.idTemat,
                    idRodzaj: kwestia.idRodzaj,
                    dataDyskusji: kwestia.dataDyskusji,
                    dataGlosowania: kwestia.dataGlosowania,
                    status: status,
                    krotkaTresc: kwestia.krotkaTresc,
                    szczegolowaTresc: kwestia.szczegolowaTresc,
                    isOption: false,
                    sugerowanyTemat:kwestia.sugerowanyTemat,
                    sugerowanyRodzaj:kwestia.sugerowanyRodzaj
                }];
            Meteor.call('addKwestia', newKwestia, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
                else {
                    Session.set("kwestiaPreview",null);
                    Router.go('listKwestia');
                }
            });
        }
    }
});