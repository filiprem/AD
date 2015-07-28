Template.addRodzajForm.rendered = function(){
    setTematy();
};

Template.addRodzajForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var newRodzaj = [
            {
                temat_id: $(e.target).find('[name=tematy]').val(),
                nazwaRodzaj: $(e.target).find('[name=nazwaRodzaj]').val(),
                czasDyskusji: $(e.target).find('[name=czasDyskusji]').val(),
                czasGlosowania: $(e.target).find('[name=czasGlosowania]').val(),
                pulapPriorytetu: $(e.target).find('[name=pulapPriorytetu]').val()
            }];
        if (isNotEmpty(newRodzaj[0].temat_id) &&
            isNotEmpty(newRodzaj[0].nazwaRodzaj) &&
            isNotEmpty(newRodzaj[0].czasDyskusji) &&
            isNotEmpty(newRodzaj[0].czasGlosowania) &&
            isNotEmpty(newRodzaj[0].pulapPriorytetu)) {
            Meteor.call('addRodzaj', newRodzaj, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else
                {
                    Router.go('listRodzaj');
                }
            });
        }
    }
});