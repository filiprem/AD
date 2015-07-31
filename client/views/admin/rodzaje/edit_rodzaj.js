Template.editRodzajForm.rendered = function(){
    //setTematy();
};

Template.editRodzajForm.helpers({
    rodzajToEdit: function(){
        return Session.get("rodzajInScope");
    },
    tematToList: function(){
        return Temat.find({});
    },
    isSelected: function(id) {
        var r = Session.get("rodzajInScope");
        var item = Temat.findOne({_id: r.temat_id});
        if(item._id==id)
            return true;
        else
            return false;
    }
});

Template.editRodzajForm.events({
    'submit form': function(e){
        e.preventDefault();
        var r = Session.get("rodzajInScope");
        var rodzaj = {
            temat_id: $(e.target).find('[name=tematy]').val(),
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
                Kwestia.find({rodzaj_id: r._id}).forEach(function(doc){
                    var id = Kwestia.update({_id: doc._id},{$set:{pulapPriorytetu:Rodzaj.findOne({_id: r._id}).pulapPriorytetu}});
                    if(!id)
                        console.log("Update kwestii "+doc._id+" nie zosta³ wykonany pomyœlnie");
                });
                Router.go('listRodzaj');
            }
        });
    },
    'reset form': function(){
        Router.go('listRodzaj');
    }
});