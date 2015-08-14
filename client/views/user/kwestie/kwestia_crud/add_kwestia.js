Template.addKwestiaForm.created = function(){
    this.rodzajRV = new ReactiveVar();
}

Template.addKwestiaForm.rendered = function(){
    //$('#test2').datetimepicker({sideBySide: true});
    //$('#test3').datetimepicker({sideBySide: true});

    if(Session.get("kwestiaPreview")) {
        var item = Session.get("kwestiaPreview");
        var rodzaj = Rodzaj.findOne({_id: item.idRodzaj});
        var self = Template.instance();
        self.rodzajRV.set(rodzaj.nazwaRodzaj);
    }
    $("#kwestiaForm").validate({
        rules: {
            kwestiaNazwa:{
                checkExistsNazwaKwestii:true
            }
        },
        messages:{
            kwestiaNazwa:{
                required:fieldEmptyMesssage()
            },
            tematy:{
                required:fieldEmptyMesssage()
            },
            rodzaje:{
                required:fieldEmptyMesssage()
            },
            tresc:{
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

Template.addKwestiaForm.helpers({
    tematToList: function(){
        return Temat.find({}).fetch();
    } ,
    rodzajToList: function(){
        return Rodzaj.find({}).fetch();
    },
    tresc: function(){
        var self = Template.instance();
        if(self.rodzajRV.get()=="Uchwała"){
            return "Wnioskuję podjęcie uchwały: ";
        }
    },
    krotkaTrescValidator:function(tresc){
        if(tresc && stringContains(tresc,"Wnioskuję podjęcie uchwały:"))
            tresc = tresc.replace("Wnioskuję podjęcie uchwały: ", "");

        return tresc;
    },
    isSelectedTemat: function(id) {
        if(Session.get("kwestiaPreview")){
            var item = Session.get("kwestiaPreview");
            var item = Temat.findOne({_id: item.idTemat});

            return item._id == id ? true : false;
        }
        else
            return false;
    },
    isSelectedRodzaj: function(id) {
        if(Session.get("kwestiaPreview")) {
            var item = Session.get("kwestiaPreview");
            var item = Rodzaj.findOne({_id: item.idRodzaj});
            if (item._id == id)
                return true;
            else
                return false;
        }
        else return false;
    }
});

Template.addKwestiaForm.events({
    'change [name=rodzaje]': function() {
        var self = Template.instance();
        var rodzajId = $('[name=rodzaje]').val();
        if(rodzajId!="default"){
            var r = Rodzaj.findOne({_id: rodzajId});
            self.rodzajRV.set(r.nazwaRodzaj);
        }else{
            self.rodzajRV.set(rodzajId);
        }
    },
    'submit form': function (e) {
        e.preventDefault();

        var dataG =  new Date();
        var d = dataG.setDate(dataG.getDate()+7);

        var newKwestia = [
            {
                idUser: Meteor.userId(),
                dataWprowadzenia: new Date(),
                kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
                wartoscPriorytetu: 0,
                sredniaPriorytet: 0,
                idTemat: $(e.target).find('[name=tematy]').val(),
                idRodzaj: $(e.target).find('[name=rodzaje]').val(),
                dataDyskusji: new Date(),
                dataGlosowania: d,
                krotkaTresc: $(e.target).find('[name=krotkaTresc]').val(),
                szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val(),
                isOption: false,
                sugerowanyTemat : $(e.target).find('[name=sugerowanyTemat]').val(),
                sugerowanyRodzaj : $(e.target).find('[name=sugerowanyRodzaj]').val(),
            }];

                Session.set("kwestiaPreview", newKwestia[0]);
                Router.go('previewKwestia');
    },
    'reset form': function(){
        Router.go('listKwestia');
    }
});