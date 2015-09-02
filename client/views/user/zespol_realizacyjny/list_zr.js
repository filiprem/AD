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
    ZRList: function(){//i tam,gdzie status==glosowana!!!bo w innym wypadku,moze się zmienić!!!
        console.log("TUUUUUU: "+this._id);
        Session.setPersistent("IdKwestiaModal",this._id);
        var idZRKwestia=Kwestia.findOne({_id:this._id}).idZespolRealizacyjny;
        return ZespolRealizacyjny.find({
            $where:function(){
            return ((this._id!=idZRKwestia)&&(this.zespol.slice().length>=3))
        }});
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
        if(isUserInZRNotification(this._id)==false){
            //to niżej
            //mamy idZespolu
            //to suwamy ten zespół i pobieramy id tamtego
            console.log(Session.get("IdKwestiaModal"));
            var newZR=this._id;

            ///usuniecie starego zespołu
            var kwestia=Kwestia.findOne({_id:Session.get("IdKwestiaModal")});
            if(kwestia){
                var zespol=ZespolRealizacyjny.findOne({_id:kwestia.idZespolRealizacyjny});
                if(zespol) {
                    Meteor.call('removeZespolRealizacyjny', zespol, function (error, ret) {
                        if (error) {
                            if (typeof Errors === "undefined")
                                Log.error('Error: ' + error.reason);
                            else {
                                throwError(error.reason);
                            }
                        }
                        else{
                            Meteor.call('updateIdZespolu',kwestia._id, newZR, function (error, ret) {
                                if (error) {
                                    if (typeof Errors === "undefined")
                                        Log.error('Error: ' + error.reason);
                                    else {
                                        throwError(error.reason);
                                    }
                                }
                                else{
                                    $("#listZespolRealizacyjny").modal("hide");
                                    //Session.setPersistent("IdKwestiaModal",null);
                                }
                            });
                        }
                    });
                }
            }
        }

        //badam wybrany zespól.jeżeli ten co go wybral,nie jest w wybranym zespole->alert

       // $("#listZespolRealizacyjny").modal("hide");

        //modal sie zamknie
        //pojaw sie nowy bootbox,
        //wpiszemy nazwę zespołu, beda wypisani członkowie.ok,ok
        //zupdetują sie wyświetleni,nadpiszemy aktualny zespół realizacyjny? i do widzenia

    }
});