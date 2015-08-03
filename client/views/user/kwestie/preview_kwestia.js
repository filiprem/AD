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

        var newKwestiaDraft = [
            {
                userId: Meteor.userId(),
                dataWprowadzenia: new Date(),
                kwestiaNazwa: kwestia.kwestiaNazwa,
                wartoscPriorytetu: 0,
                sredniaPriorytet: 0,
                temat_id: kwestia.temat_id,
                rodzaj_id: kwestia.rodzaj_id,
                pulapPriorytetu:kwestia.pulapPriorytetu,
                dataDyskusji: kwestia.dataDyskusji,
                dataGlosowania: kwestia.dataGlosowania,
                krotkaTresc: kwestia.krotkaTresc1+" "+kwestia.krotkaTresc2,
                szczegolowaTresc: kwestia.szczegolowaTresc
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
});