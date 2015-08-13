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
            var newKwestiaDraft = [
                {
                    idUser: Meteor.userId(),
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: kwestia.kwestiaNazwa,
                    wartoscPriorytetu: 0,
                    sredniaPriorytet: 0,
                    idTemat: kwestia.idTemat,
                    idRodzaj: kwestia.idRodzaj,
                    pulapPriorytetu:kwestia.pulapPriorytetu,
                    dataDyskusji: kwestia.dataDyskusji,
                    dataGlosowania: kwestia.dataGlosowania,
                    krotkaTresc: kwestia.krotkaTresc2,
                    szczegolowaTresc: kwestia.szczegolowaTresc,
                    idParent: idParentKwestii,
                    isOption: true
                }];
            Meteor.call('addKwestiaOpcja', newKwestiaDraft, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
                else {
                    //TO DO
                    //var pktAddKwestia=Parametr.findOne({});
                    //console.log(pktAddKwestia.pktDodanieKwestii);
                    //var actualUser= Meteor.userId();
                    //console.log(actualUser);
                    //var updateUserValue=Users.findOne({_id: actualUser}).profile.rADking;
                    //console.log(Number(updateUserValue));
                    //var newValue=Number(pktAddKwestia)+Number(updateUserValue);
                    //console.log(newValue);
                    //var newUserValue=Users.update({_id:actualUser},{$set:{rADking: newValue}});
                    //console.log(actualUser);
                    Session.set("kwestiaPreview",null);
                    Router.go('listKwestia');
                }
            });
        }
        else{
            var newKwestiaDraft = [
                {
                    idUser: Meteor.userId(),
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: kwestia.kwestiaNazwa,
                    wartoscPriorytetu: 0,
                    sredniaPriorytet: 0,
                    idTemat: kwestia.idTemat,
                    idRodzaj: kwestia.idRodzaj,
                    pulapPriorytetu:kwestia.pulapPriorytetu,
                    dataDyskusji: kwestia.dataDyskusji,
                    dataGlosowania: kwestia.dataGlosowania,
                    krotkaTresc: kwestia.krotkaTresc1+" "+kwestia.krotkaTresc2,
                    szczegolowaTresc: kwestia.szczegolowaTresc,
                    isOption: false
                }];
            Meteor.call('addKwestia', newKwestiaDraft, function (error, ret) {
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