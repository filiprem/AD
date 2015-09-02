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
                var z = ZespolRealizacyjny.findOne({idKwestia: this._id});
                var text="Zespół realizacyjny ds.";
                var zespolId = z._id;
                ZespolRealizacyjny.update(zespolId,
                    {
                        $set: {
                            nazwa: text+nazwa
                        }
                    });
                $("#addNazwa").modal("hide");
            }
        }
    }
});