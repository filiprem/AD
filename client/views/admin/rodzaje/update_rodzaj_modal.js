//Template.updateRodzajModalInner.rendered = function(){
//    setTematy();
//};
//
//Template.updateRodzajModalInner.helpers({
//    updateRodzaj: function() {
//        return Session.get('rodzajInScope');
//    }
//});
//
//Template.updateRodzajModalInner.events({
//    'click input[type=submit]': function(e){
//        e.preventDefault();
//        var currentRodzajId = this._id;
//        var formParent = e.target.parentNode.parentNode;
//        var postProperties =
//            {
//                idTemat: $(formParent).find('[name=tematy]').val(),
//                nazwaRodzaj: $(formParent).find('[name=nazwaRodzaj]').val(),
//                czasDyskusji: $(formParent).find('[name=czasDyskusji]').val(),
//                czasGlosowania: $(formParent).find('[name=czasGlosowania]').val(),
//                pulapPriorytetu: $(formParent).find('[name=pulapPriorytetu]').val()
//            };
//        Rodzaj.update(currentRodzajId, {$set: postProperties});
//    }
//});