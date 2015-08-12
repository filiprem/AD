i18n.setDefaultLanguage("pl");

getUserLanguage = function () {

    return "pl";
};

if (Meteor.isClient) {
    Meteor.startup(function () {

        TAPi18n.setLanguage(getUserLanguage())
            .done(function () {

            })
            .fail(function (error_message) {
                console.log(error_message);
            });

    });
}