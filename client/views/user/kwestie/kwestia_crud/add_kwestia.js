Template.addKwestiaForm.rendered = function () {
    var rodzaj = document.getElementById("rodzajHidden").value;
    var temat = document.getElementById("tematHidden").value;

    var tabRodzaj = [];
    var tabTemat = [];

    if (!!rodzaj)
        tabRodzaj.push({nazwa: rodzaj})
    if (!!temat)
        tabTemat.push({nazwa: temat})

    Rodzaj.find({}).forEach(function (item) {
        var rodzaj = {
            nazwa: item.nazwaRodzaj
        }
        tabRodzaj.push(rodzaj);
    });

    Temat.find({}).forEach(function (item) {
        var temat = {
            nazwa: item.nazwaTemat
        }
        tabTemat.push(temat);
    });

    var $select1 = $('#sugerowanyRodzaj').selectize({
        persist: false,
        createOnBlur: true,
        create: true,
        maxItems: 1,
        labelField: 'nazwa',
        valueField: 'nazwa',
        options: tabRodzaj
    });

    var $select2 = $('#sugerowanyTemat').selectize({
        persist: false,
        createOnBlur: true,
        create: true,
        maxItems: 1,
        labelField: 'nazwa',
        valueField: 'nazwa',
        options: tabTemat
    });

    $select1[0].selectize.setValue(rodzaj);
    $select2[0].selectize.setValue(temat);

    $("#kwestiaForm").validate({
        rules: {
            kwestiaNazwa: {
                checkExistsNazwaKwestii: true
            }
        },
        messages: {
            kwestiaNazwa: {
                required: fieldEmptyMesssage()
            },
            tematy: {
                required: fieldEmptyMesssage()
            },
            rodzaje: {
                required: fieldEmptyMesssage()
            },
            tresc: {
                required: fieldEmptyMesssage()
            },
            krotkaTresc: {
                required: fieldEmptyMesssage()
            },
            szczegolowaTresc: {
                required: fieldEmptyMesssage()
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
    })
};

Template.addKwestiaForm.events({
    'submit form': function (e) {
        e.preventDefault();

        var dataG = new Date();
        var d = dataG.setDate(dataG.getDate() + 7);

        var newKwestia = [
            {
                idUser: Meteor.userId(),
                dataWprowadzenia: new Date(),
                kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
                wartoscPriorytetu: 0,
                sredniaPriorytet: 0,
                idTemat: $(e.target).find('[name=tematy]').val(),
                idRodzaj: $(e.target).find('[name=rodzaje]').val(),
                dataDyskusji: new Date(),
                dataGlosowania: d,
                krotkaTresc: $(e.target).find('[name=krotkaTresc]').val(),
                szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val(),
                isOption: false,
                sugerowanyTemat: $(e.target).find('[name=sugerowanyTemat]').val(),
                sugerowanyRodzaj: $(e.target).find('[name=sugerowanyRodzaj]').val(),
            }];

        Session.set("kwestiaPreview", newKwestia[0]);
        Router.go('previewKwestia');
    },
    'reset form': function () {
        Router.go('listKwestia');
    }
});