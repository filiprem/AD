Template.addKwestiaOpcjaForm.rendered = function(){

    //if(Session.get("kwestiaPreview")) {
    //    var item = Session.get("kwestiaPreview");
    //    var rodzaj = Rodzaj.findOne({_id: item.idRodzaj});
    //    var self = Template.instance();
    //    self.rodzajRV.set(rodzaj.nazwaRodzaj);
    // }
    $("#kwestiaOpcjaForm").validate({
        rules: {
            kwestiaNazwa:{
                checkExistsNazwaKwestii:true
            }
        },
        messages:{
            kwestiaNazwa:{
                required:fieldEmptyMesssage()
            },
            krotkaTresc:{
                required:fieldEmptyMesssage()
            },
            szczegolowaTresc:{
                required:fieldEmptyMesssage()
            }
        },
        highlight: function(element) {
            highlightFunction(element);
        },
        unhighlight: function(element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.length) {
                error.insertAfter(element);
            } else {
                error.insertAfter(element);
            }
        }
    })
};
Template.addKwestiaOpcjaForm.helpers({
    rodzajNazwa:function(){
        return Rodzaj.findOne({_id:this.idRodzaj}).nazwaRodzaj;
    },
    tematNazwa:function(){
        return Temat.findOne({_id:this.idTemat}).nazwaTemat;
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
            idTemat: this.idTemat,
            idRodzaj: this.idRodzaj,
            // pulapPriorytetu: pulapPriorytetu,
            dataDyskusji: new Date(),
            dataGlosowania: d,
            //krotkaTresc1:$(e.target).find('[name=tresc]').val(),
            krotkaTresc: $(e.target).find('[name=krotkaTresc]').val(),
            szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val(),
            idParent: idParentKwestii,
            isOption: true
        }];
        Session.set("kwestiaPreviewOpcja", newKwestiaOpcja[0]);
        Session.set("actualKwestiaId",newKwestiaOpcja[0]);
        Router.go('previewKwestiaOpcja');
    },
    'click #anuluj':function(){
        Router.go("informacjeKwestia",{_id:Session.get("idKwestia")});
    }
});