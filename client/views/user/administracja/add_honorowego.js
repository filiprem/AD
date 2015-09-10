Template.listDoradcyModal.helpers({
});

Template.listZespolRealizacyjnyModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'fullName', label: "Imię i nazwisko"},
                {key: 'zespol', label: "Skład Zespołu", tmpl: Template.doradcyTemplate}
            ]
        };
    },
    doradcyList: function(){
        var user=Users.find({$where:function(){
            this.profile.userType==USERTYPE.DORADCA && this._id != Meteor.userId();
        }});
    }
});

Template.doradcyTemplate.helpers({
    zespolR: function(){
        var tab = [];
        for(var i=0;i<this.zespol.length;i++){
            var z = this.zespol[i];
            if(z){
                var foundName = Users.findOne({_id: z}).profile.fullName;
                if(foundName){
                    tab.push(" "+foundName);
                }
            }
        }
        return tab;
    }
});
