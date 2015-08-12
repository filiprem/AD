Template.editKwestiaForm.rendered = function(){};

Template.editKwestiaForm.helpers({
    kwestiaToEdit: function(){
        return Session.get("kwestiaInScope");
    },
    tematToList: function(){
        return Temat.find({});
    },
    rodzajToList: function(){
        return Rodzaj.find({});
    },
    isSelectedTemat: function(id, tematId) {
        var r = Session.get("kwestiaInScope");
        var item = Temat.findOne({_id: r.idTemat});
        if(item){
            if(item._id==id)
                return true;
            else
                return false;
        }
    },
    isSelectedRodzaj: function(id){
        var r=Session.get("kwestiaInScope");
        var item=Rodzaj.findOne({_id: r.idRodzaj});
        if(item){
            if(item._id==id)
                return true;
            else
                return false;
        }
    }
});

Template.editKwestiaForm.events({
    'reset form': function(){
        Router.go('listKwestia');
    },
    'submit form': function(e){
        e.preventDefault();
        var eventForm = $(e.target);
        var kwestia = Session.get("kwestiaInScope");
        var kwestiaId = kwestia._id;
        var nazwa = eventForm.find('[name=kwestiaNazwa]').val();
        var temat = eventForm.find('[name=tematy]').val();
        var rodzaj = eventForm.find('[name=rodzaje]').val();
        var krotkaTresc = eventForm.find('[name=krotkaTresc]').val();
        var szczegolowaTresc = eventForm.find('[name=szczegolowaTresc]').val();
        var pulapPriorytetu = Rodzaj.findOne({_id:rodzaj}).pulapPriorytetu;

        var kw = {
            kwestiaNazwa: nazwa,
            idTemat: temat,
            idRodzaj: rodzaj,
            pulapPriorytetu:pulapPriorytetu,
            krotkaTresc: krotkaTresc,
            szczegolowaTresc: szczegolowaTresc
        }
        var id = Kwestia.update({_id: kwestiaId},{$set:kw});
        if(id){
            Router.go('listKwestia');
        }
        else{}
    },
    'reset form': function(){
        Router.go('listKwestia');
    }
});