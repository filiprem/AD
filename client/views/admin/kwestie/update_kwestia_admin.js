Template.updateKwestiaAdminModalInner.helpers({
    updateKwestia: function() {
        return Session.get('kwestiaInScope');
    }
});

Template.updateKwestiaAdminModalInner.events({
    'click input[type=submit]': function(e){
        e.preventDefault();
    }
});