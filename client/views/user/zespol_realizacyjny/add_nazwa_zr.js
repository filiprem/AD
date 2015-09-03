Template.addNazwaModalInner.rendered = function () {
    $("addNazwa").validate({
        rules:{
            nazwaZR: {
                checkExistsNazwaZespoluRealizacyjnego : true
            }
        },
        messages: {
            nazwaZR: {
                required: fieldEmptyMessage()
            }
        },
        highlight: function (element) {
            highlightFunction(element);
        },
        unhighlight: function (element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.length) {
                error.insertAfter(element);
            } else {
                error.insertAfter(element);
            }
        }
    });
};

Template.addNazwaModal.events({
    'click #zapiszButton': function (e) {
        console.log("SIEMAAA");
        console.log(this._id);
        var idKwestia=this._id;
        e.preventDefault();
        var nazwa = document.getElementById('nazwaZR').value;
        var zespoly = ZespolRealizacyjny.find({}).fetch();
        var z = "Zespół Realizacyjny ds. ";
        if (nazwa.toLowerCase().trim() =="") {
            GlobalNotification.error({
                title: 'Błąd',
                content: 'Uzupełnij nazwę ZR!',
                duration: 3 // duration the notification should stay in seconds
            });
        }
        else {
            var found=false;
            var text="Zespół realizacyjny ds. "+nazwa;
            zespoly.forEach(function(zespol){
                if (_.isEqual(zespol.nazwa.toLowerCase().trim(), text.toLowerCase().trim()))
                    found = true;
            });
            if(found==true){
                GlobalNotification.error({
                    title: 'Błąd',
                    content: 'Istnieje już ZR o podanej nazwie!',
                    duration: 3 // duration the notification should stay in seconds
                });
            }
            else {
                var text="Zespół realizacyjny ds."+nazwa;
                var kwestia=Kwestia.findOne({_id:idKwestia});
                if(kwestia) {
                    Meteor.call('updateNazwaZR', kwestia.idZespolRealizacyjny, text, function (error, ret) {
                        if (error) {
                            if (typeof Errors === "undefined")
                                Log.error('Error: ' + error.reason);
                            else {
                                throwError(error.reason);
                            }
                        }
                        else {
                            $("#addNazwa").modal("hide");
                            var zespol=ZespolRealizacyjny.findOne({_id:kwestia.idZespolRealizacyjny});
                            if(zespol) {
                                var tablicaZR=zespol.zespol.slice();
                                tablicaZR.push(Meteor.userId());
                                console.log("tablica ZRRRR");
                                console.log(tablicaZR);
                                Meteor.call('updateZespolRealizacyjny', zespol._id, tablicaZR, function (error, ret) {
                                    if (error) {
                                        if (typeof Errors === "undefined")
                                            Log.error('Error: ' + error.reason);
                                        else {
                                            throwError(error.reason);
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    }
});