Template.addParametrForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var newParametr = [
            {
                nazwaOrganizacji: $(e.target).find('[name=nazwaOrganizacji]').val(),
                terytorium: $(e.target).find('[name=terytorium]').val(),
                kontakty: $(e.target).find('[name=kontakty]').val(),
                regulamin: $(e.target).find('[name=regulamin]').val()
            }];
        console.log("O to co jest w regulaminie:"+newParametr[0].regulamin);
        if (isNotEmpty(newParametr[0].nazwaOrganizacji,'nazwa organizacji') &&
            isNotEmpty(newParametr[0].terytorium,'terytorium') &&
            isNotEmpty(newParametr[0].kontakty,'kontakty') &&
            isNotEmpty(newParametr[0].regulamin,'regulamin')) {
            Meteor.call('addParametr', newParametr, function (error) {
                if (error) {
                    // optionally use a meteor errors package
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }else
                {
                    Router.go('listParametr');
                }
            });
        }
    },
    'reset form': function(){
        Router.go('listParametr');
    }
});