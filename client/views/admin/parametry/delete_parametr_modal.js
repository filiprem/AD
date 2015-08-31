Template.deleteParametrModalInner.helpers({
    parametrInScope: function () {
        return Session.get('parametrInScope');
    }
});

Template.deleteParametrModalInner.events({
    'click .btn-danger': function (e) {
        e.preventDefault();
        var currentParametrId = this._id;
        Parametr.remove(currentParametrId);
        $("#deleteparametr").modal("hide");
    }
});