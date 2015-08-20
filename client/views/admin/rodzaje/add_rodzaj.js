Template.addRodzajForm.rendered = function () {
    $("#rodzajForm").validate({
        rules: {
            czasDyskusji: {
                min: 1
            },
            czasGlosowania: {
                min: 0.01,
                number: true
            }
        },
        messages: {
            nazwaRodzaj: {
                required: fieldEmptyMesssage()
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

Template.addRodzajForm.helpers({
    tematToList: function () {
        return Temat.find({});
    }
}),
    Template.addRodzajForm.events({

        'submit form': function (e) {
            e.preventDefault();

            var idTemat = this._id;
            var czasD = $(e.target).find('[name=czasDyskusji]').val();
            if (czasD == '' || czasD == '0')
                czasD = 7;
            var czasG = $(e.target).find('[name=czasGlosowania]').val().replace(/\s+/g, '');
            if (czasG == '' || czasG == '0')
                czasG = 24;

            var newRodzaj = [
                {
                    idTemat: idTemat,
                    nazwaRodzaj: $(e.target).find('[name=nazwaRodzaj]').val(),
                    czasDyskusji: czasD,
                    czasGlosowania: czasG
                }];
            Meteor.call('addRodzaj', newRodzaj, function (error) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                } else {
                    Router.go('listTemat');
                }
            });
        },
        'reset form': function () {
            Router.go('listTemat');
        }
    });


