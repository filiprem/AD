Template.listZespolRealizacyjnyModal.helpers({
});
Template.listZespolRealizacyjnyDoubleModalInner.rendered=function(){
};
Template.listZespolRealizacyjnyDoubleModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'nazwa', label: "Nazwa Zespołu"},
                {key: 'zespol', label: "Skład Zespołu", tmpl: Template.zespolDoubleTemplate},
                {key: 'options', label: "", tmpl: Template.zespolDoubleTemplateOptions}
            ]
        };
    },
    ZRDoubleList: function(){
        var val=Session.get("zespolRealizacyjnyDouble");
        return ZespolRealizacyjny.find({
            _id: {$in:val}
        });

        Session.setPersistent('zespolRealizacyjnyDouble', null);
    }
});

Template.zespolDoubleTemplate.helpers({
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

Template.zespolOptionsTemplate.helpers({
});

Template.listZespolRealizacyjnyDoubleModalInner.events({
    'click #powrotButton':function(){
        $("#decyzjaModalId").modal("show");
    },
    'click #przyjmijZR':function(){
        if(isUserInZRNotification(this._id)==false) {//jezeli jestem w  takowym zespole
            powolajZRFunction(Session.get("idKwestia"),this._id);
        }
    }
});