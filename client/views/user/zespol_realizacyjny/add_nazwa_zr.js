Template.addNazwaModal.events({
    'click #zapiszButton': function (e) {
        e.preventDefault();
        var nazwa = document.getElementById('nazwaZR').value;
        if(nazwa == "Zespół Realizacyjny ds. "){
            throwError("Uzupełnij nazwę ZR!");
        }
        else{
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