Template.deleteRodzajModalInner.helpers({
    rodzajInScope: function() {
        return Session.get('rodzajInScope');
    }
});

Template.deleteRodzajModalInner.events({
    'click .btn-danger': function(e) {
        e.preventDefault();
        var currentRodzajId = this._id;
        Rodzaj.remove(currentRodzajId);
        $("#deleterodzaj").modal("hide");
    }});