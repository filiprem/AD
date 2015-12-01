Template.decyzjaModal.helpers({
});
Template.decyzjaModalInner.rendered=function(){
    $('#nowyZRButton').css("visibility", "visible");
    $('#istniejacyZRButton').css("visibility", "visible");
};
Template.decyzjaModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'nazwa', label: "Nazwa Zespołu"},
                {key: 'zespol', label: "Skład Zespołu", tmpl: Template.zespolDoubleTemplatee}
            ]
        };
    },
    ZRDoubleList: function(){
        var val=Session.get("zespolRealizacyjnyDouble");
        if(val) {
            return ZespolRealizacyjny.find({
                _id: {$in: val}
            });

            Session.setPersistent('zespolRealizacyjnyDouble', null);
        }
    }
});

Template.zespolDoubleTemplatee.helpers({
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


Template.decyzjaModalInner.events({
    'click #istniejacyZRButton':function(){
        //sprawdzam,czy mam uprawnienia
        $('#nowyZRButton').css("visibility", "hidden");
        $('#istniejacyZRButton').css("visibility", "hidden");
        $("#listZespolRealizacyjnyDouble").modal("show");
        $('#nowyZRButton').css("visibility", "visible");
        $('#istniejacyZRButton').css("visibility", "visible");
    },
    'click #nowyZRButton':function(){
        $('#nowyZRButton').css("visibility", "hidden");
        $('#istniejacyZRButton').css("visibility", "hidden");
        $('#addNazwa').modal('show');
        $('#nowyZRButton').css("visibility", "visible");
    }
});