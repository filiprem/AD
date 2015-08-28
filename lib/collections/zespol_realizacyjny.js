ZespolRealizacyjny = new Mongo.Collection("zespolRealizacyjny");
ZespolRealizacyjny.allow({
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