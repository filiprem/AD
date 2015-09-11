Template.editParametry.rendered = function () {
    $("#parametrFormEdit").validate({
        rules:{
            voteFrequency: {
                min: 0,
                number: true
            },
            voteQuantity: {
                min: 0,
                number: true
            }
        },
        messages: {
            nazwaOrganizacji: {
                required: fieldEmptyMessage()
            },
            terytorium: {
                required: fieldEmptyMessage()
            },
            kontakty: {
                required: fieldEmptyMessage()
            },
            regulamin: {
                required: fieldEmptyMessage()
            },
            voteFrequency: {
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
            },
            voteQuantity: {
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
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
            validationPlacementError(error, element);
        }
    })
};
Template.editParametry.events({
    'submit form': function (e) {
        e.preventDefault();
        var tab = [];
        var parameter = Parametr.findOne({id: this.id});

        var nazwaO = $(e.target).find('[name=nazwaOrganizacji]').val();
        if (nazwaO != Parametr.findOne({}).nazwaOrganizacji) {
            tab.push(setParamInfo("NAZWA ORGANIZACJI", parameter.nazwaOrganizacji, nazwaO));
        }
        var ter = $(e.target).find('[name=terytorium]').val();
        if (ter != parameter.terytorium) {
            tab.push(setParamInfo("TERYTORIUM", parameter.terytorium, ter));
        }
        var kont = $(e.target).find('[name=kontakty]').val();
        if (kont != parameter.kontakty) {
            tab.push(setParamInfo("KONTAKTY", parameter.kontakty, kont));
        }
        var reg = $(e.target).find('[name=regulamin]').val();
        if (reg != parameter.regulamin) {
            tab.push(setParamInfo("REGULAMIN", parameter.regulamin, reg));
        }
        var voteFreq = $(e.target).find('[name=voteFrequency]').val();
        if(voteFreq != parameter.voteFrequency) {
            tab.push(setParamInfo("CZESTOTLIWOSC GLOSOWANIA", parameter.voteFrequency, voteFreq));
        }
        var voteQuant = $(e.target).find('[name=voteQuantity]').val();
        if(voteQuant != parameter.voteQuantity) {
            tab.push(setParamInfo("ILOSC KWESTII", parameter.voteQuantity, voteQuant));
        }

        var newParametr = [
            {
                _id: this._id,
                nazwaOrganizacji: nazwaO,
                terytorium: ter,
                kontakty: kont,
                regulamin: reg,
                voteFrequency: voteFreq,
                voteQuantity: voteQuant
            }];
        if (tab.length > 0) {
            Session.setPersistent("tablica", tab);
            Session.set("parametryPreview", newParametr[0]);
            Router.go("previewParametr");
        }
        else {
            GlobalNotification.error({
                title: 'Błąd',
                content: 'Nie wprowadziłeś żadnych zmian!',
                duration: 3 // duration the notification should stay in seconds
            });
            //throwError("Nie wprowadziłeś żadnych zmian");
        }
    },
    'reset form': function () {
        Router.go('administracjaUserMain');
    }
});