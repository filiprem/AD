Template.editRodzajForm.rendered = function(){
    //setTematy();
};

Template.editRodzajForm.helpers({
    rodzajToEdit: function(){
        return Session.get("rodzajInScope");
    },
    tematName: function(){
        var r = Session.get("rodzajInScope");
        if(r){
            var t = r.temat_id;
            var item = Temat.findOne({_id: t});
            if(item){
                return item.nazwaTemat;
            }
        }
    }
});

Template.editRodzajForm.events({
    'submit form': function(e){
        e.preventDefault();
        var r = Session.get("rodzajInScope");
        var rodzaj = {
            //temat_id: $(e.target).find('[name=tematy]').val(),
            nazwaRodzaj: $(e.target).find('[name=nazwaRodzaj]').val(),
            czasDyskusji: $(e.target).find('[name=czasDyskusji]').val(),
            czasGlosowania: $(e.target).find('[name=czasGlosowania]').val(),
            pulapPriorytetu: $(e.target).find('[name=pulapPriorytetu]').val()
        };

        Meteor.call('updateRodzaj', r._id ,rodzaj, function (error) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else {
                Router.go('listRodzaj');
            }
        });
    },
    'reset form': function(){
        Router.go('listRodzaj');
    }
});