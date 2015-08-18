Template.editRodzajForm.rendered = function () {
    $("#rodzajForm").validate({
        rules: {
            czasDyskusji: {
                min: 1,
            },
            czasGlosowania: {
                min: 0.01,
                number: true
            }
        },
        messages: {
            nazwaRodzaj: {
                required: fieldEmptyMesssage(),
            },
            tematy: {
                required: fieldEmptyMesssage()
            },
            czasDyskusji: {
                min: positiveNumberMesssage()
            },
            czasGlosowania: {
                min: positiveNumberMesssage(),
                number: decimalNumberMesssage()
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

Template.editRodzajForm.helpers({
    rodzajToEdit: function () {
        return Session.get("rodzajInScope");
    },
    tematToList: function () {
        return Temat.find({});
    },
    isSelected: function (id) {
        var r = Session.get("rodzajInScope");
        var item = Temat.findOne({_id: r.idTemat});
        if (item._id == id)
            return true;
        else
            return false;
    }
});

Template.editRodzajForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var r = Session.get("rodzajInScope");

        var czasD = $(e.target).find('[name=czasDyskusji]').val();
        if (czasD == '' || czasD == '0')
            czasD = 7;
        var czasG = $(e.target).find('[name=czasGlosowania]').val().replace(/\s+/g, '');
        if (czasG == '' || czasG == '0')
            czasG = 24;

        var rodzaj = {
            idTemat: $(e.target).find('[name=tematy]').val(),
            nazwaRodzaj: $(e.target).find('[name=nazwaRodzaj]').val(),
            czasDyskusji: czasD,
            czasGlosowania: czasG
        };
        Meteor.call('updateRodzaj', r._id, rodzaj, function (error) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else {
                Router.go('listRodzaj');
            }
        });
    },
    'reset form': function () {
        Router.go('listRodzaj');
    }
});