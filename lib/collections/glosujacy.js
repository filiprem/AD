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
