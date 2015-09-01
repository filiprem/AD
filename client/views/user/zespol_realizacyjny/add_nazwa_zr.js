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
        if ((nazwa.toLowerCase().trim() == z.toLowerCase().trim()) || nazwa == "") {
            GlobalNotification.error({
                title: 'Błąd',
                content: 'Uzupełnij nazwę ZR!',
                duration: 3 // duration the notification should stay in seconds
            });
        }
        else {
            var z = ZespolRealizacyjny.findOne({idKwestia: this._id});
            var zespolId = z._id;
            ZespolRealizacyjny.update(zespolId,
                {
                    $set: {
                        nazwa: nazwa
                    }
                });
            $("#addNazwa").modal("hide");
        }
    }
})