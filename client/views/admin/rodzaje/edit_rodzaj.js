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

        var czasD=$(e.target).find('[name=czasDyskusji]').val();
        if(czasD == '' || czasD == '0')
            czasD=7;
        var czasG=$(e.target).find('[name=czasGlosowania]').val();
        if(czasG == '' || czasG == '0')
            czasG=24;

        var rodzaj = {
            temat_id: $(e.target).find('[name=tematy]').val(),
            nazwaRodzaj: $(e.target).find('[name=nazwaRodzaj]').val(),
            czasDyskusji: czasD,
            czasGlosowania:czasG,
            pulapPriorytetu: $(e.target).find('[name=pulapPriorytetu]').val()
        };
        if (isNotEmpty(rodzaj.nazwaRodzaj,'nazwa rodzaju') &&
            isPositiveNumber(rodzaj.czasDyskusji,'czas dyskusji') &&
            isNumeric(rodzaj.czasGlosowania,'czas głosowania') &&
            isNotEmpty(rodzaj.pulapPriorytetu,'pułap priorytetu')) {
            Meteor.call('updateRodzaj', r._id, rodzaj, function (error) {
                if (error) {
                    // optionally use a meteor errors package
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
                else {
                    Kwestia.find({rodzaj_id: r._id}).forEach(function (doc) {
                        var id = Kwestia.update({_id: doc._id}, {$set: {pulapPriorytetu: Rodzaj.findOne({_id: r._id}).pulapPriorytetu}});
                        if (!id){
                            //console.log("Update kwestii " + doc._id + " nie zosta� wykonany pomy�lnie");
                        }
                    });
                    Router.go('listRodzaj');
                }
            });
        }
    },
    'reset form': function(){
        Router.go('listRodzaj');
    }
});