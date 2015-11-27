Template.addKwestiaForm.rendered = function () {

    Session.setPersistent("choosenTopicId", null);
    Session.setPersistent("choosenTypeId", null);
    document.getElementById("sugerowanyTemat").readOnly = true;
    document.getElementById("sugerowanyRodzaj").readOnly = true;
    document.getElementById("chooseTypeBtn").disabled = true;
    document.getElementById("addTypeBtn").disabled = true;

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
        var topic = Temat.findOne({_id: Session.get("choosenTopicId")});
        if(topic!=null){
            return topic.nazwaTemat
        }
        else{
            return null
        }
    },
    type: function () {
        var type = Rodzaj.findOne({_id: Session.get("choosenTypeId")});
        if(type!=null){
            return type.nazwaRodzaj
        }
        else {
            return null
        }
    }
});

Template.addKwestiaForm.events({
    'submit #kwestiaForm': function (e) {
        e.preventDefault();

        var topicValue = $(e.target).find('[id=sugerowanyTemat]').val();
        var typeValue = $(e.target).find('[id=sugerowanyRodzaj]').val();
        if(topicValue == null || topicValue == "" || typeValue == null || typeValue == ""){
            GlobalNotification.error({
                title: 'Uwaga',
                content: "Musisz uzupełnić temat i rodzaj",
                duration: 5 // duration the notification should stay in seconds
            });

        }else{
            var newKwestia = [
                {
                    idUser: Meteor.userId(),
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
                    wartoscPriorytetu: 20,
                    temat: Temat.findOne({_id:Session.get("choosenTopicId")}).nazwaTemat,
                    rodzaj: Rodzaj.findOne({_id:Session.get("choosenTypeId")}).nazwaRodzaj,
                    krotkaTresc: $(e.target).find('[name=krotkaTresc]').val(),
                    szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val(),
                    isOption: false,
                    typ: KWESTIA_TYPE.BASIC
                }];

            Session.setPersistent("kwestiaPreview", newKwestia[0]);
            Router.go('previewKwestia');
        }
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