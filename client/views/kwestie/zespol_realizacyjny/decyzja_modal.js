Template.decyzjaModal.helpers({
});

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
    ZRDoubleList: function(){//tutaj lista wwszystkich zespołów zatweirdzonych.,które mają taki sam zespół jak mój!
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
        console.log("KWESTYJKAAAA");//tu jest
        console.log(this._id);
        $("#listZespolRealizacyjnyDouble").modal("show");
        //if(isUserInZRNotification(Session.get("zespolRealizacyjnyDouble"))==false){//ttuaj chyba trzeba przekeić tamtą metodę z kwestii!!??cos tu nie działa!!!BD POTRZEBNE!
            //jeśli ma uprawnienia,to dać styl pusty
            //$("#modalBody").attr('disabled','disabled');

            //Meteor.call('updateIdZespolu',kwestia._id, newZR, function (error, ret) {
            //    if (error) {
            //        if (typeof Errors === "undefined")
            //            Log.error('Error: ' + error.reason);
            //        else {
            //            throwError(error.reason);
            //        }
            //    }
            //});
       // }
        //Session.setPersistent("zespolRealizacyjnyDouble",null);
    },
    'click #nowyZRButton':function(){
        $('#addNazwa').modal('show');
        //Session.setPersistent("zespolRealizacyjnyDouble",null);
    }
});