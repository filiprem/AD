Kwestia = new Mongo.Collection('kwestia');

Kwestia.allow({
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