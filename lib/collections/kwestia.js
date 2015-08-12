Kwestia = new Mongo.Collection('kwestia');
KwestiaTresc = new Mongo.Collection('kwestiaTresc');

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

KwestiaTresc.allow({
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