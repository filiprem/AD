Rodzaj = new Mongo.Collection('rodzaj');

Rodzaj.allow({
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