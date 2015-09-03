Template.listZespolRealizacyjnyModal.helpers({
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
                {key: 'nazwa', label: "Nazwa Zespołu"},
                {key: 'zespol', label: "Skład Zespołu", tmpl: Template.zespolTemplate},
                {key: 'options', label: "", tmpl: Template.zespolOptionsTemplate}
            ]
        };
    },
    ZRList: function(){//tutaj lista wszystkich zespołow juz zatweirdzonych
        var kwestie = Kwestia.find({
            $where: function () {
                return (this.status==KWESTIA_STATUS.GLOSOWANA);
            }
        });
        var arrayZespol=[];
        console.log(kwestie.count());
        kwestie.forEach(function(kwestia){
            arrayZespol.push(kwestia.idZespolRealizacyjny);
        });

        return ZespolRealizacyjny.find({
            _id:{$in: arrayZespol}
            });
    }
});

Template.zespolTemplate.helpers({
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

Template.listZespolRealizacyjnyModalInner.events({
    'click #anulujButton':function(){
        //Session.setPersistent("IdKwestiaModal",null);
    },
    'click #powolajZR': function () {
        //jezeli jest w zepsole,powolaj
        if(isUserInZRNotification(this._id)==false) {//jezeli jestem w  takowym zespole
            powolajZRFunction(Session.get("idKwestia"),this._id);
        }
        //if(isUserInZRNotification(this._id)==false){
        //    console.log(Session.get("IdKwestia"));
        //    var newZR=this._id;
        //
        //    ///usuniecie starego zespołu
        //    var kwestia=Kwestia.findOne({_id:Session.get("IdKwestia")});
        //    if(kwestia){
        //        var zespol=ZespolRealizacyjny.findOne({_id:kwestia.idZespolRealizacyjny});
        //        if(zespol) {
        //            Meteor.call('removeZespolRealizacyjny', zespol, function (error, ret) {
        //                if (error) {
        //                    if (typeof Errors === "undefined")
        //                        Log.error('Error: ' + error.reason);
        //                    else {
        //                        throwError(error.reason);
        //                    }
        //                }
        //                else{
        //                    Meteor.call('updateIdZespolu',kwestia._id, newZR, function (error, ret) {
        //                        if (error) {
        //                            if (typeof Errors === "undefined")
        //                                Log.error('Error: ' + error.reason);
        //                            else {
        //                                throwError(error.reason);
        //                            }
        //                        }
        //                        else{
        //                            $("#listZespolRealizacyjny").modal("hide");
        //                            //Session.setPersistent("IdKwestiaModal",null);
        //                        }
        //                    });
        //                }
        //            });
        //        }
        //    }
        //}

        //badam wybrany zespól.jeżeli ten co go wybral,nie jest w wybranym zespole->alert

       // $("#listZespolRealizacyjny").modal("hide");

        //modal sie zamknie
        //pojaw sie nowy bootbox,
        //wpiszemy nazwę zespołu, beda wypisani członkowie.ok,ok
        //zupdetują sie wyświetleni,nadpiszemy aktualny zespół realizacyjny? i do widzenia

    }
});