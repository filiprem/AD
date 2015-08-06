Template.addRodzajForm.rendered = function(){
};

Template.addRodzajForm.helpers({
    tematToList: function(){
        return Temat.find({});
    }
})

Template.addRodzajForm.events({
    'submit form': function (e) {
        e.preventDefault();

        var czasD=$(e.target).find('[name=czasDyskusji]').val();
        if(czasD == '' || czasD == '0')
            czasD=7;
        var czasG=$(e.target).find('[name=czasGlosowania]').val();
        if(czasG == '' || czasG == '0')
            czasG=24;

        var newRodzaj = [
            {
                temat_id: $(e.target).find('[name=tematy]').val(),
                nazwaRodzaj: $(e.target).find('[name=nazwaRodzaj]').val(),
                czasDyskusji: czasD,
                czasGlosowania: czasG,
                pulapPriorytetu: $(e.target).find('[name=pulapPriorytetu]').val()
            }];
        if (isNotEmpty(newRodzaj[0].temat_id,'temat') &&
            isNotEmpty(newRodzaj[0].nazwaRodzaj,'nazwa rodzaju') &&
            isPositiveNumber(newRodzaj[0].czasDyskusji,'czas dyskusji') &&
            isNumeric(newRodzaj[0].czasGlosowania,'czas głosowania') &&
            isNotEmpty(newRodzaj[0].pulapPriorytetu,'pułap priorytetu')) {
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
    },
    'reset form': function(){
        Router.go('listRodzaj');
    }
});