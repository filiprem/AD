Template.editKwestiaForm.rendered = function(){
    setTematy();
    setRodzaje();
};

Template.editKwestiaForm.helpers({
    kwestiaToEdit: function(){
        return Session.get("kwestiaInScope");
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

        var kw = {
            kwestiaNazwa: nazwa,
            temat_id: temat,
            rodzaj_id: rodzaj,
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