Template.deleteTematModalInner.helpers({
    tematInScope: function() {
        return Session.get('tematInScope');
    }
});

Template.deleteTematModalInner.events({
    'click .btn-danger': function(e) {
        e.preventDefault();
        var currentTematId = this._id;
        Temat.remove(currentTematId);
        $("#deletetemat").modal("hide");
}});