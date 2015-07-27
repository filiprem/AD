Template.editRodzajForm.helpers({
    rodzajToEdit: function(){
        return Session.get("rodzajInScope");
    }
})