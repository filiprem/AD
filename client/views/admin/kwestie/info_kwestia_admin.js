Template.infoKwestiaAdminModalInner.helpers({
    kwestiaInScope: function() {
        return Session.get('kwestiaInScope');

    }
});

Template.infoKwestiaAdminModalInner.events({
    'click input[type=submit]': function(e){
        e.preventDefault();

    }
});