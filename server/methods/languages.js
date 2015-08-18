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
    }
});