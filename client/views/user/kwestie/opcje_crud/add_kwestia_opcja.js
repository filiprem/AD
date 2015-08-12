Template.addKwestiaOpcjaForm.rendered = function () {
};

Template.addKwestiaOpcjaForm.helpers({
    tematToList: function () {
        return Temat.find({});
    },
    rodzajToList: function () {
        return Rodzaj.find({});
    },
    isSelectedTemat: function (id, tematId) {
        var r = Session.get("idKwestia");
        var k = Kwestia.findOne({_id: r});
        var item = Temat.findOne({_id: k.idTemat});
        if (item._id == id)
            return true;
        else
            return false;
    },
    isSelectedRodzaj: function (id) {
        var r = Session.get("idKwestia");
        var k = Kwestia.findOne({_id: r});
        var item = Rodzaj.findOne({_id: k.idRodzaj});
        if (item._id == id)
            return true;
        else
            return false;
    },
    krotkaTrescValidator:function(tresc){
        if(tresc && stringContains(tresc,"Wnioskuję podjęcie uchwały:"))
            tresc = tresc.replace("Wnioskuję podjęcie uchwały: ", "");

        return tresc;
    }
});

Template.addKwestiaOpcjaForm.events({
    'submit form': function(e){
        e.preventDefault();
        var eventForm = $(e.target);

        var idParentKwestii = Session.get("idKwestia");

        var dataG =  new Date();
        var d = dataG.setDate(dataG.getDate()+7);
        //var pulapPriorytetu = null;

        var newKwestiaOpcja = [{
            idUser: Meteor.userId(),
                dataWprowadzenia: new Date(),
                kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
                wartoscPriorytetu: 0,
                sredniaPriorytet: 0,
                idTemat: $(e.target).find('[name=tematy]').val(),
                idRodzaj: $(e.target).find('[name=rodzaje]').val(),
                // pulapPriorytetu: pulapPriorytetu,
                dataDyskusji: new Date(),
                dataGlosowania: d,
                //krotkaTresc1:$(e.target).find('[name=tresc]').val(),
                krotkaTresc2: $(e.target).find('[name=krotkaTresc]').val(),
                szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val(),
                idParent: idParentKwestii,
                isOption: true
            }];
        Session.set("kwestiaPreview", newKwestiaOpcja[0]);
        Router.go('previewKwestia');
    }
});