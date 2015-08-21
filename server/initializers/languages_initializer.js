Meteor.startup(function () {

    var tabOfLangs = [];
    if(Languages.find({}).count()==0) {
        tabOfLangs = [
            {languageName: "polski", shortName: "pl", isEnabled: true, czyAktywny: true},
            {languageName: "angielski", shortName: "en", isEnabled: true, czyAktywny: true},
            {languageName: "niemiecki", shortName: "de", isEnabled: true, czyAktywny: true},
            {languageName: "szwedzki", shortName: "se", isEnabled: true, czyAktywny: true},
        ]
    }

    _.each(tabOfLangs,function(lang){
        Meteor.call('addLanguage', lang, function (error,ret) {
            if (error) {
                console.log(lang.languageName+" not added language!!!");
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            }
            else {
                console.log("--------------------------- "+lang.languageName+" added -------------------------------");

                _.each(Router.routes, function(route){

                    var item = {
                        idLanguage:ret,
                        routeName: route.getName(),
                        shortLanguageName:lang.shortName,
                        infoText:"",
                        czyAktywny:true
                    }

                    Meteor.call('setPagesInfo', item, function (error) {
                        if (error) {
                            console.log(item.routeName+" not added info!!!");
                            if (typeof Errors === "undefined")
                                Log.error('Error: ' + error.reason);
                            else
                                throwError(error.reason);
                        }
                        else console.log(item.routeName+" added");
                    });
                });
            }
        });
    });
});
