Template.addKwestiaForm.created = function(){
    this.rodzajRV = new ReactiveVar();
}

Template.addKwestiaForm.rendered = function(){
    $('#test2').datetimepicker({sideBySide: true});
    $('#test3').datetimepicker({sideBySide: true});

    if(Session.get("kwestiaPreview")) {
        var item = Session.get("kwestiaPreview");
        var rodzaj = Rodzaj.findOne({_id: item.rodzaj_id});
        var self = Template.instance();
        self.rodzajRV.set(rodzaj.nazwaRodzaj);
    }
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
            var item = Temat.findOne({_id: item.temat_id});

            return item._id == id ? true : false;
        }
        else
            return false;
    },
    isSelectedRodzaj: function(id) {
        if(Session.get("kwestiaPreview")) {
            var item = Session.get("kwestiaPreview");
            var item = Rodzaj.findOne({_id: item.rodzaj_id});
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
        var pulapPriorytetu = null;

        var newKwestiaDraft = [
            {
                userId: Meteor.userId(),
                dataWprowadzenia: new Date(),
                kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
                wartoscPriorytetu: 0,
                sredniaPriorytet: 0,
                temat_id: $(e.target).find('[name=tematy]').val(),
                rodzaj_id: $(e.target).find('[name=rodzaje]').val(),
               // pulapPriorytetu: pulapPriorytetu,
                dataDyskusji: new Date(),
                dataGlosowania: d,
                krotkaTresc1:$(e.target).find('[name=tresc]').val(),
                krotkaTresc2: $(e.target).find('[name=krotkaTresc]').val(),
                szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val(),
                isOption: false
            }];

        if(newKwestiaDraft[0].rodzaj_id!='default') {
            newKwestiaDraft[0].pulapPriorytetu = Rodzaj.findOne({_id: newKwestiaDraft[0].rodzaj_id}).pulapPriorytetu;
            if (
                isNotEmpty(newKwestiaDraft[0].kwestiaNazwa, 'nazwa kwestii') &&
                isNotEmpty(newKwestiaDraft[0].temat_id, 'temat') &&
                isNotEmpty(newKwestiaDraft[0].rodzaj_id, 'rodzaj') &&
                isNotEmpty(newKwestiaDraft[0].krotkaTresc1, 'krótka treść') &&
                isNotEmpty(newKwestiaDraft[0].krotkaTresc2, 'krótka treść cd') &&
                isNotEmpty(newKwestiaDraft[0].szczegolowaTresc, 'opis z uzasadnieniem') &&
                isNotEmpty(newKwestiaDraft[0].dataDyskusji.toString(), 'data dyskusji') &&
                isNotEmpty(newKwestiaDraft[0].dataGlosowania.toString(), 'data głosowania')
            ) {
                Session.set("kwestiaPreview", newKwestiaDraft[0]);
                Router.go('previewKwestia');
            }
        }
        else
        {
            isNotEmpty('', 'rodzaj')
        }
    },
    'reset form': function(){
        Router.go('listKwestia');
    }
});