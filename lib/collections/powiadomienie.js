Powiadomienie = new Mongo.Collection('powiadomienie');

Powiadomienie.allow({
    insert: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});