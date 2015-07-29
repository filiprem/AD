Template.addTematForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var newTemat = [
            {
                nazwaTemat: $(e.target).find('[name=nazwaTemat]').val(),
                opis: $(e.target).find('[name=opis]').val()
            }];
        if (isNotEmpty(newTemat[0].nazwaTemat) &&
            isNotEmpty(newTemat[0].opis)) {
            Meteor.call('addTemat', newTemat, function (error) {
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
        }
    },
    'reset form': function(){
        Router.go('listTemat');
    }
});