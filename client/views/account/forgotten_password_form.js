/**
 * Created by Bartłomiej Szewczyk on 2015-12-07.
 */
Template.forgottenPassword.rendered = function () {

    $("#forgottenPassword").validate({
        rules: {
            email: {
                email: true,
                checkExistsAnyEmail: false
            }
        },
        messages: {
            email: {
                required: fieldEmptyMessage(),
                email: validEmailMessage()
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
            if(element.attr("name") == "statutConfirmation")
                error.insertAfter(document.getElementById("statutConfirmationSpan"));
            else
                validationPlacementError(error, element);
        }
    });
};
Template.forgottenPassword.events({
    'submit form': function (e) {
        e.preventDefault();

        var options = {
            email: $(e.target).find('[name=email]').val()
        };

        if (isNotEmpty(options.email, 'email') && isEmail(options.email)) {
            Meteor.call('serverCheckExistsUser', options.email, null, null, function (error, ret) {
                if (error) {
                    throwError(error.reason);
                }
                else {
                    if(ret == true){
                        //Accounts.forgotPassword(options);
                        Meteor.call('sendResetPasswordEmail', options.email, function (error, ret) {
                            if (error) {
                                throwError(error.reason);
                            }
                            else {
                                GlobalNotification.success({
                                    title: 'Sukces',
                                    content: 'Link do zmiany hasła został wysłany',
                                    duration: 5 // duration the notification should stay in seconds
                                });
                                Router.go('login_form');
                                return true;
                            }
                        });
                    }else{
                        throwError('Podany adres email nie istnieje w systemie');
                        return false;
                    }
                }
            });
        } else {
            return false;
        }
    }
});