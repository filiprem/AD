Template.editTematForm.rendered = function () {
    $("#tematForm").validate({
        messages: {
            nazwaTemat: {
                required: fieldEmptyMesssage(),
            },
            opis: {
                required: fieldEmptyMesssage()
            }
        },
        highlight: function (element) {
            var id_attr = "#" + $(element).attr("id") + "1";
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            $(id_attr).removeClass('glyphicon-ok').addClass('glyphicon-remove');
        },
        unhighlight: function (element) {
            var id_attr = "#" + $(element).attr("id") + "1";
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            $(id_attr).removeClass('glyphicon-remove').addClass('glyphicon-ok');
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
Template.editTematForm.helpers({
    tematToEdit: function () {
        return Session.get("tematInScope");
    }
});

Template.editTematForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var t = Session.get("tematInScope");
        var temat = {
            nazwaTemat: $(e.target).find('[name=nazwaTemat]').val(),
            opis: $(e.target).find('[name=opis]').val()
        };
        Meteor.call('updateTemat', t._id, temat, function (error) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else Router.go('listTemat');
        });
    },
    'reset form': function () {
        Router.go('listTemat');
    }
})