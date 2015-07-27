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
    'submit form': function(){
    }
});