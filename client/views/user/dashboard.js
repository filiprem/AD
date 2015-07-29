Template.adminTemplate.helpers({
    kwestieCount: function(){
        return Kwestia.find().count();
    }
});