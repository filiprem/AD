Template.ustawienia.events({
    'click #zglosNaHonorowegoClick':function(){
        $("#listDoradcy").modal("show");
    }
});
Template.ustawienia.helpers({
    isCzlonek:function(){
        var user=Users.findOne({_id:Meteor.userId()});
       if(user){
           return user.profile.userType==USERTYPE.CZLONEK ? "" :"disabled";
       }
   }
});