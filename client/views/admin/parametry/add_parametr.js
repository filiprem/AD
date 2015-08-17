Template.addParametrForm.rendered = function () {
    $("#parametrForm").validate({
        messages: {
            nazwaOrganizacji: {
                required: fieldEmptyMesssage()
            },
            terytorium: {
                required: fieldEmptyMesssage()
            },
            kontakty: {
                required: fieldEmptyMesssage()
            },
            regulamin: {
                required: fieldEmptyMesssage()
            },
            dodanieKwestii: {
                min: negativeNumberMessage()
            },
            dodanieKomentarza: {
                min: negativeNumberMessage()
            },
            dodanieOdniesienia: {
                min: negativeNumberMessage()
            },
            nadaniePriorytetu: {
                min: negativeNumberMessage()
            },
            awansKwestii: {
                min: negativeNumberMessage()
            },
            udzialWZespole: {
                min: negativeNumberMessage()
            },
            zlozenieRaportu: {
                min: negativeNumberMessage()
            },
            nadaniePriorytetu: {
                min: negativeNumberMessage()
            },
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
            validationPlacementError(error, element);
        }
    })
};
Template.addParametrForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var newParametr = [
            {
                nazwaOrganizacji: $(e.target).find('[name=nazwaOrganizacji]').val(),
                terytorium: $(e.target).find('[name=terytorium]').val(),
                kontakty: $(e.target).find('[name=kontakty]').val(),
                regulamin: $(e.target).find('[name=regulamin]').val(),

                pktDodanieKwestii: setValueIfEmptyField($(e.target).find('[name=dodanieKwestii]').val(), 10),
                pktDodanieKomentarza: setValueIfEmptyField($(e.target).find('[name=dodanieKomentarza]').val(), 5),
                pktDodanieOdniesienia: setValueIfEmptyField($(e.target).find('[name=dodanieOdniesienia]').val(), 2),
                pktNadaniePriorytetu: setValueIfEmptyField($(e.target).find('[name=nadaniePriorytetu]').val(), 1),
                pktAwansKwestii: setValueIfEmptyField($(e.target).find('[name=awansKwestii]').val(), 20),
                pktUdzialWZespoleRealizycjnym: setValueIfEmptyField($(e.target).find('[name=udzialWZespole]').val(), 10),
                pktZlozenieRaportuRealizacyjnego: setValueIfEmptyField($(e.target).find('[name=zlozenieRaportu]').val(), 5),
                //pktOtrzymaniePriorytetu//tego nie
                pktWycofanieKwestiiDoArchiwum: setValueIfEmptyField($(e.target).find('[name=wycofanieKwestiiDoArchwium]').val(), -20),
                pktWycofanieKwestiiDoKosza: setValueIfEmptyField($(e.target).find('[name=wycofanieKwestiiDoKosza]').val(), -40),
                pktWyjscieZZespoluRealizacyjnego: setValueIfEmptyField($(e.target).find('[name=wyjscieZZespolu]').val(), -30),
                pktBrakUdzialuWGlosowaniu: setValueIfEmptyField($(e.target).find('[name=brakUdzialuWGlosowaniu]').val(), -30)
            }];
        Meteor.call('addParametr', newParametr, function (error) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            } else {
                Router.go('listParametr');
            }
        });
    },
    'reset form': function () {
        Router.go('listParametr');
    }
});