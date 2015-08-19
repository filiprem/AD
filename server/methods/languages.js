Meteor.methods({
    addLanguage: function (item) {
        Languages.insert({
            languageName: item[0].languageName,
            shortName: item[0].shortName,
            isEnabled:item[0].isEnabled,
            czyAktywny: item[0].czyAktywny
        });
    },
    updateLanguage: function (id, item) {
        Languages.update(id, {$set: {languageName:item.languageName,shortName:item.shortName}}, {upsert: true});
    },
    updateLanguageEnabled: function (id, item) {
        Languages.update(id, {$set: {isEnabled:item.isEnabled}}, {upsert: true});
    },
    removeLanguage: function(id){
        Languages.remove({_id: id});
    },
    // metody dodawania informacji o stronie
    setPagesInfo: function (item) {
        var pageInfo = PagesInfo.findOne({idLanguage:item.idLanguage,routeName:item.routeName});
        if(!!pageInfo) {
            PagesInfo.update(pageInfo._id,{$set: {infoText: item.infoText}});
        } else {
            PagesInfo.insert({
                idLanguage: item.idLanguage,
                routeName: item.routeName,
                shortLanguageName: item.shortLanguageName,
                infoText: item.infoText,
                czyAktywny: item.czyAktywny
            });
        }
    }

});