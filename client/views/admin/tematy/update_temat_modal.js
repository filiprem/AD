Template.updateTematModalInner.helpers({
    updateTemat: function() {
        return Session.get('tematInScope');
    }
});

Template.updateTematModalInner.events({
    'click input[type=submit]': function(e){
        e.preventDefault();
        var currentTematId = this._id;
        var formParent = e.target.parentNode.parentNode;
        var postProperties =
        {
            nazwaTemat: $(formParent).find('[name=nazwaTemat]').val(),
            opis: $(formParent).find('[name=opis]').val()
        };
        Temat.update(currentTematId, {$set: postProperties});
    }
});