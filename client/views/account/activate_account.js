Template.activateAccount.rendered=function(){
    var currentRoute=Router.current().params;
    var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute});
    if(userDraft)
        Meteor.call("removeUserDraft",userDraft._id,function(error) {
            if(error)
                console.log(error.reason);
        });
};
Template.activateAccount.helpers({
    notActivatedAccount:function(){
        var currentRoute=Router.current().params;
        var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute});
        if(userDraft)
            return userDraft.czyAktywny==true ? true : false;
        return true;
    }
});