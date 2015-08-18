i18n.setDefaultLanguage("pl");

getUserLanguage = function () {
    var defaultLang = "pl";
    if(!!Meteor.user().profile.language)
        return Meteor.user().profile.language;
    else
        return defaultLang;
};

if (Meteor.isClient) {
    Meteor.startup(function () {
        if(Meteor.user()) {
            var lang = getUserLanguage();
            TAPi18n.setLanguage(lang)
                .done(function () {
                    console.log("Załadowano język");
                })
                .fail(function (error_message) {
                    console.log(error_message);
                });
        }
    });
}