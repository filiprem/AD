Template.previewKwestia.helpers({
    draftKwestii: function(){
        var id = Session.get("draftId");
        var d = KwestiaDraft.findOne({_id: id});
        console.log(Session.get("draftId"));
        return d;
    }

});

Template.previewKwestia.events({
    
});