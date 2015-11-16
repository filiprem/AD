Template.editParametry.rendered = function () {
    $("#parametrFormEdit").validate({
        rules:{
            voteDuration: {
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
            voteDuration: {
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
            },
            voteQuantity: {
                required: fieldEmptyMessage(),
                min: positiveNumberMessage()
            },
            czasWyczekiwaniaKwestiiSpec:{
                required:fieldEmptyMessage(),
                min:positiveNumberMessage()
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
        var voteDur = $(e.target).find('[name=voteDuration]').val();
        if(voteDur != parameter.voteDuration) {
            tab.push(setParamInfo("CZAS GLOSOWANIA", parameter.voteDuration, voteDur));
        }
        var czasWyczekiwaniaKwestiiSpec = $(e.target).find('[name=czasWyczekiwaniaKwestiiSpec]').val();
        if(czasWyczekiwaniaKwestiiSpec != parameter.czasWyczekiwaniaKwestiiSpecjalnej) {
            tab.push(setParamInfo("CZAS WYCZEKIWANIA KWESTII I KOMENTARZY SPECJALNYCH", parameter.czasWyczekiwaniaKwestiiSpecjalnej, czasWyczekiwaniaKwestiiSpec));
        }
        var voteQuant = $(e.target).find('[name=voteQuantity]').val();
        if(voteQuant != parameter.voteQuantity) {
            tab.push(setParamInfo("LICZBA KWESTII GŁOSOWANYCH   ", parameter.voteQuantity, voteQuant));
        }

        var addIssuePause=$(e.target).find('[name=addIssuePause]').val();
        if(addIssuePause != parameter.addIssuePause) {
            tab.push(setParamInfo("CZĘSTOTLIWOŚĆ DODANIA KWESTII", parameter.addIssuePause, addIssuePause));
        }

        var addCommentPause=$(e.target).find('[name=addCommentPause]').val();
        if(addCommentPause != parameter.addCommentPause) {
            tab.push(setParamInfo("CZĘSTOTLIWOŚĆ DODANIA KOMENTARZA", parameter.addCommentPause, addCommentPause));
        }

        var addReferencePause=$(e.target).find('[name=addReferencePause]').val();
        if(addReferencePause != parameter.addReferencePause) {
            tab.push(setParamInfo("CZĘSTOTLIWOŚĆ DODANIA ODNIESIENIA", parameter.addReferencePause, addReferencePause));
        }

        var newParametr = [
            {
                _id: this._id,
                nazwaOrganizacji: nazwaO,
                terytorium: ter,
                kontakty: kont,
                regulamin: reg,
                voteDuration: voteDur,
                voteQuantity: voteQuant,
                czasWyczekiwaniaKwestiiSpecjalnej:czasWyczekiwaniaKwestiiSpec,
                addIssuePause:addIssuePause,
                addCommentPause:addCommentPause,
                addReferencePause:addReferencePause
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