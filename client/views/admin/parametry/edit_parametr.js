Template.editParametry.rendered = function () {
    $("#parametrFormEdit").validate({
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
            dodanieKwestii: {
                min: negativeNumberMessage(),
                required: fieldEmptyMessage()
            },
            dodanieKomentarza: {
                min: negativeNumberMessage(),
                required: fieldEmptyMessage()
            },
            dodanieOdniesienia: {
                min: negativeNumberMessage(),
                required: fieldEmptyMessage()
            },
            nadaniePriorytetu: {
                min: negativeNumberMessage(),
                required: fieldEmptyMessage()
            },
            awansKwestii: {
                min: negativeNumberMessage(),
                required: fieldEmptyMessage()
            },
            udzialWZespole: {
                min: negativeNumberMessage(),
                required: fieldEmptyMessage()
            },
            zlozenieRaportu: {
                min: negativeNumberMessage(),
                required: fieldEmptyMessage()
            },
            wyjscieZZespolu: {
                max: positiveNumberMessage(),
                required: fieldEmptyMessage()
            },
            wycofanieKwestiiDoKosza: {
                max: positiveNumberMessage(),
                required: fieldEmptyMessage()
            },
            wycofanieKwestiiDoArchiwum: {
                max: positiveNumberMessage(),
                required: fieldEmptyMessage()
            },
            brakUdzialuWGlosowaniu: {
                max: positiveNumberMessage(),
                required: fieldEmptyMessage()
            },
            okresSledzeniaWatkuPrzenoszacego: {
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
        // var dodKwestii = $(e.target).find('[name=dodanieKwestii]').val();
        // if (dodKwestii != parameter.pktDodanieKwestii) {
        //     tab.push(setParamInfo("DODANIE KWESTII", parameter.pktDodanieKwestii, dodKwestii));
        // }
        // var dodKomentarza = $(e.target).find('[name=dodanieKomentarza]').val();
        // if (dodKomentarza != parameter.pktDodanieKomentarza) {
        //     tab.push(setParamInfo("DODANIE KOMENTARZA", parameter.pktDodanieKomentarza, dodKomentarza));
        // }
        // var dodOdniesienia = $(e.target).find('[name=dodanieOdniesienia]').val();
        // if (dodOdniesienia != parameter.pktDodanieOdniesienia) {
        //     tab.push(setParamInfo("DODANIE ODNIESIENIA", parameter.pktDodanieOdniesienia, dodOdniesienia));
        // }
        // var nadaniePrior = $(e.target).find('[name=nadaniePriorytetu]').val();
        // if (nadaniePrior != parameter.pktNadaniePriorytetu) {
        //     tab.push(setParamInfo("NADANIE PRIORYTETU", parameter.pktNadaniePriorytetu, nadaniePrior));
        // }
        // var awansKwe = $(e.target).find('[name=awansKwestii]').val();
        // if (awansKwe != parameter.pktAwansKwestii) {
        //     tab.push(setParamInfo("AWANS KWESTII DO REALIZACJI", parameter.pktAwansKwestii, awansKwe));
        // }
        // var udzialWZesp = $(e.target).find('[name=udzialWZespole]').val();
        // if (udzialWZesp != parameter.pktUdzialWZespoleRealizacyjnym) {
        //     tab.push(setParamInfo("UDZIAŁ W ZESPOLE REALIZACYJNYM", parameter.pktUdzialWZespoleRealizacyjnym, udzialWZesp));
        // }
        // var zlozenieRap = $(e.target).find('[name=zlozenieRaportu]').val();
        // if (zlozenieRap != parameter.pktZlozenieRaportuRealizacyjnego) {
        //     tab.push(setParamInfo("ZŁOŻENIE RAPORTU REALIZACYJNEGO", parameter.pktZlozenieRaportuRealizacyjnego, zlozenieRap));
        // }
        // var wycofanieKwDoArch = $(e.target).find('[name=wycofanieKwestiiDoArchiwum]').val();
        // if (wycofanieKwDoArch != parameter.pktWycofanieKwestiiDoArchiwum) {
        //     tab.push(setParamInfo("WYCOFANIE KWESTII DO ARCHIWUM", parameter.pktWycofanieKwestiiDoArchiwum, wycofanieKwDoArch));
        // }
        // var wycofanieKwDoKosza = $(e.target).find('[name=wycofanieKwestiiDoKosza]').val();
        // if (wycofanieKwDoKosza != parameter.pktWycofanieKwestiiDoKosza) {
        //     tab.push(setParamInfo("WYCOFANIE KWESTII DO KOSZA", parameter.pktWycofanieKwestiiDoKosza, wycofanieKwDoKosza));
        // }
        // var wyjscieZZesp = $(e.target).find('[name=wyjscieZZespolu]').val();
        // if (wyjscieZZesp != parameter.pktWyjscieZZespoluRealizacyjnego) {
        //     tab.push(setParamInfo("WYJŚCIE Z ZESPOŁU REALIZACYJNEGO", parameter.pktWyjscieZZespoluRealizacyjnego, wyjscieZZesp));
        // }
        // var brakUdzWGlos = $(e.target).find('[name=brakUdzialuWGlosowaniu]').val();
        // if (brakUdzWGlos != parameter.pktBrakUdzialuWGlosowaniu) {
        //     tab.push(setParamInfo("BRAK UDZIAŁU W GŁOSOWANIU", parameter.pktBrakUdzialuWGlosowaniu, brakUdzWGlos));
        // }
        // var okrSledzeniaWatku = $(e.target).find('[name=okresSledzeniaWatkuPrzenoszacego]').val();
        // if (okrSledzeniaWatku != parameter.okresSledzeniaWatkuPrzenoszacego) {
        //     tab.push(setParamInfo("OKRES ŚLEDZENIA WĄTKU PRZENOSZĄCEGO", parameter.okresSledzeniaWatkuPrzenoszacego, okrSledzeniaWatku));
        // }

        var newParametr = [
            {
                _id: this._id,
                nazwaOrganizacji: nazwaO,
                terytorium: ter,
                kontakty: kont,
                regulamin: reg,

                // pktDodanieKwestii: parseInt(dodKwestii),
                // pktDodanieKomentarza: parseInt(dodKomentarza),
                // pktDodanieOdniesienia: parseInt(dodOdniesienia),
                // pktNadaniePriorytetu: parseInt(nadaniePrior),
                // pktAwansKwestii: parseInt(awansKwe),
                // pktUdzialWZespoleRealizacyjnym: parseInt(udzialWZesp),
                // pktZlozenieRaportuRealizacyjnego: parseInt(zlozenieRap),
                // pktWycofanieKwestiiDoArchiwum: parseInt(wycofanieKwDoArch),
                // pktWycofanieKwestiiDoKosza: parseInt(wycofanieKwDoKosza),
                // pktWyjscieZZespoluRealizacyjnego: parseInt(wyjscieZZesp),
                // pktBrakUdzialuWGlosowaniu: parseInt(brakUdzWGlos),
                // okresSledzeniaWatkuPrzenoszacego: parseInt(okrSledzeniaWatku)
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