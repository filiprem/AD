Template.listZespolRealizacyjnyModal.helpers({
});

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
                {key: 'zespol', label: "Skład Zespołu", tmpl: Template.zespolDoubleTemplate}
            ]
        };
    },
    ZRDoubleList: function(){
        var val=Session.get("zespolRealizacyjnyDouble");
        console.log("bum____________________________________________");
        console.log(val);
        return ZespolRealizacyjny.find({_id:val});
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
    'click #istniejacyZRButton':function(){
        //sprawdzam,czy mam uprawnienia
        console.log("KWESTYJKAAAA");//tu jest
        console.log(this._id);
        if(isUserInZRNotification(Session.get("zespolRealizacyjnyDouble"))==false){
            Meteor.call('updateIdZespolu',kwestia._id, newZR, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
            });
        }
        //Session.setPersistent("zespolRealizacyjnyDouble",null);
    },
    'click #nowyZRButton':function(){
        $('#addNazwa').modal('show');
        //Session.setPersistent("zespolRealizacyjnyDouble",null);
    }
});