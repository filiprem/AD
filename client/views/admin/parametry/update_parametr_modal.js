//Template.updateParametrModalInner.helpers({
//    updateParametr: function() {
//        return Session.get('parametrInScope');
//    }
//});
//
//Template.updateParametrModalInner.events({
//    'click input[type=submit]': function(e){
//        e.preventDefault();
//        var currentParametrId = this._id;
//        var formParent = e.target.parentNode.parentNode;
//        var postProperties =
//        {
//            nazwaOrganizacji: $(formParent).find('[name=nazwaOrganizacji]').val(),
//            terytorium: $(formParent).find('[name=terytorium]').val(),
//            kontakty: $(formParent).find('[name=kontakty]').val(),
//            regulamin: $(formParent).find('[name=regulamin]').val()
//        };
//        Parametr.update(currentParametrId, {$set: postProperties});
//    }
//});