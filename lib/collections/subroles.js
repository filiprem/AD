Subroles = new Mongo.Collection("subroles");

Subroles.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});
