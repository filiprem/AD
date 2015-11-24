Template.addKwestiaForm.rendered = function () {

    Session.setPersistent("choosenTopicId", null);
    Session.setPersistent("choosenTypeId", null);
    document.getElementById("sugerowanyTemat").disabled = true;
    document.getElementById("sugerowanyRodzaj").disabled = true;
    document.getElementById("chooseTypeBtn").disabled = true;
    document.getElementById("addTypeBtn").disabled = true;

    //var rodzaj = document.getElementById("rodzajHidden").value;
    //var temat = document.getElementById("tematHidden").value;
    //
    //var tabRodzaj = [];
    //var tabTemat = [];
    //
    //if (!!rodzaj)
    //    tabRodzaj.push({nazwa: rodzaj});
    //if (!!temat)
    //    tabTemat.push({nazwa: temat});
    //
    //Rodzaj.find({}).forEach(function (item) {
    //    var rodzaj = {
    //        nazwa: item.nazwaRodzaj
    //    };
    //    tabRodzaj.push(rodzaj);
    //});
    //
    //Temat.find({}).forEach(function (item) {
    //    var temat = {
    //        nazwa: item.nazwaTemat
    //    };
    //    tabTemat.push(temat);
    //});
    //
    //var $select1 = $('#sugerowanyRodzaj').selectize({
    //    persist: false,
    //    createOnBlur: true,
    //    create: true,
    //    maxItems: 1,
    //    labelField: 'nazwa',
    //    valueField: 'nazwa',
    //    options: tabRodzaj
    //});
    //
    //var $select2 = $('#sugerowanyTemat').selectize({
    //    persist: false,
    //    createOnBlur: true,
    //    create: true,
    //    maxItems: 1,
    //    labelField: 'nazwa',
    //    valueField: 'nazwa',
    //    options: tabTemat
    //    //create: function(input){
    //    //    if(input==null)
    //    //        return input+'ala';
    //    //    alert("cxdcd");
    //    //    return false;
    //    //}
    //});
    //
    //$select1[0].selectize.setValue(rodzaj);
    //$select2[0].selectize.setValue(temat);


    $("#kwestiaForm").validate({
        ignore: ':hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input',
        rules: {
            kwestiaNazwa: {
                checkExistsNazwaKwestii: true,
                maxlength: 80
            },
            krotkaTresc: {
                maxlength: 400
            },
            szczegolowaTresc: {
                maxlength: 1000
            }
        },
        messages: {
            sugerowanyTemat:{
                required:fieldEmptyMessage()
            },
            sugerowanyRodzaj:{
                required:fieldEmptyMessage()
            },
            rodzajHidden:{
                required:fieldEmptyMessage()
            },
            kwestiaNazwa: {
                required: fieldEmptyMessage(),
                maxlength: maxLengthMessage(80)
            },
            krotkaTresc: {
                required: fieldEmptyMessage(),
                maxlength: maxLengthMessage(400)
            },
            szczegolowaTresc: {
                required: fieldEmptyMessage(),
                maxlength: maxLengthMessage(1000)
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

Template.addKwestiaForm.helpers({
    topic: function () {
        return Temat.findOne({_id: Session.get("choosenTopicId")})
    },
    type: function () {
        return Rodzaj.findOne({_id: Session.get("choosenTypeId")})
    }
});

Template.addKwestiaForm.events({
    'submit form': function (e) {
        e.preventDefault();

        document.getElementById("submitAddKwestia").disabled = true;
        Meteor.setTimeout(function () {
            document.getElementById("submitAddKwestia").disabled = false;
            var newKwestia = [
                {
                    idUser: Meteor.userId(),
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
                    wartoscPriorytetu: 0,
                    temat: $(e.target).find('[name=sugerowanyTemat]').val(),
                    rodzaj: $(e.target).find('[name=sugerowanyRodzaj]').val(),
                    krotkaTresc: $(e.target).find('[name=krotkaTresc]').val(),
                    szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val(),
                    isOption: false,
                    typ: KWESTIA_TYPE.BASIC
                }];

            Session.setPersistent("kwestiaPreview", newKwestia[0]);
            Router.go('previewKwestia');
        },2000);
    },
    'reset form': function () {
        Router.go('listKwestia');
    },
    'click #chooseTopicBtn': function () {
        $("#chooseTopicModalId").modal("show");
    },
    'click #addTopicBtn': function () {
        $("#addTopicModalId").modal("show");
    },
    'click #chooseTypeBtn': function () {
        $("#chooseTypeModalId").modal("show");
    },
    'click #addTypeBtn': function () {
        $("#addTypeModalId").modal("show");
    }
});