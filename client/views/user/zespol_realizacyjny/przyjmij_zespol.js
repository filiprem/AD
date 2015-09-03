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
                {key: 'zespol', label: "Skład Zespołu", tmpl: Template.zespolDoubleTemplate},
                {key: 'options', label: "", tmpl: Template.zespolDoubleTemplateOptions}
            ]
        };
    },
    ZRDoubleList: function(){
        var val=Session.get("zespolRealizacyjnyDouble");
        console.log("bum____________________________________________");
        console.log(val);

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
    'click #powolajZR':function(){
        console.log("to będzie tutaaaaj");
        console.log(this._id);
        if(isUserInZRNotification(this._id)==false) {//jezeli jestem w  takowym zespole
            powolajZRFunction(Session.get("idKwestia"),this._id);
            //console.log(Session.get("idKwestia"));
            //var kwestia=Kwestia.findOne({_id:Session.get("idKwestia")});
            //if(kwestia){
            //    var zespolWybrany=ZespolRealizacyjny.findOne({_id:this._id});
            //    if(zespolWybrany) {
            //        var myZR=ZespolRealizacyjny.findOne({_id:kwestia.idZespolRealizacyjny});
            //        if(myZR) {
            //            var myNewZR = {
            //                nazwa: zespolWybrany.nazwa,
            //                zespol: zespolWybrany.zespol
            //            };
            //
            //            Meteor.call('updateZespolRealizacyjny',myZR._id, myNewZR, function (error, ret) {
            //                if (error) {
            //                    if (typeof Errors === "undefined")
            //                        Log.error('Error: ' + error.reason);
            //                    else {
            //                        throwError(error.reason);
            //                    }
            //                }
            //                else{
            //                    $("#listZespolRealizacyjnyDouble").modal("hide");
            //                }
            //            });
            //        }
            //
            //    }
            //}
        }
        //Session.setPersistent("zespolRealizacyjnyDouble",null);
    }
});