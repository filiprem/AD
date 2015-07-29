/**
 * Created by Fifcyk on 2015-04-24.
 */
Glosujacy = new Mongo.Collection('glosujacy');

Glosujacy.allow({
    insert: function(){
        return true;
    },
    update: function () {
        return true;
    },
    remove: function(){
        return true;
    }
});
Meteor.methods({
    addGlosujacy: function(newGlosujacy) {
        Glosujacy.insert({
            glosujacy_id: newGlosujacy[0].glosujacy_id,
            user_id: newGlosujacy[0].user_id,
            obecny_priorytet: newGlosujacy[0].obecny_priorytet
        });
    }
});
