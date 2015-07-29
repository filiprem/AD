Template.editTematForm.helpers({
    tematToEdit:function(){
        return Session.get("tematInScope");
    }
});

Template.editTematForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var t = Session.get("tematInScope");
        var temat = {
                nazwaTemat: $(e.target).find('[name=nazwaTemat]').val(),
                opis: $(e.target).find('[name=opis]').val()
        };

        Meteor.call('updateTemat', t._id ,temat, function (error) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else {
                Router.go('listTemat');
            }
        });
    },
    'reset form': function(){
        Router.go('listTemat');
    }
})