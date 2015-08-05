Kwestia = new Mongo.Collection('kwestia');
KwestiaSuspension = new Mongo.Collection('kwestiaSuspension');
KwestiaSuspensionPosts = new Mongo.Collection('kwestiaSuspensionPosts');
KwestiaDraft = new Mongo.Collection('kwestiaDraft');
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

KwestiaDraft.allow({
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