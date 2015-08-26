Template.manageAccount.helpers({
    test: function (emails) {
        return emails[0].address;
    },
    zlozonyWniosek:function(){
        var userDraft=UsersDraft.findOne({'profile.idUser':Meteor.userId()});
        return userDraft ? true :false;
    },
    statusName:function(){
        var userDraft=UsersDraft.findOne({'profile.idUser':Meteor.userId()});
        if(userDraft){
            if(userDraft.profile.userType=='członek'){
                return "członka";
            }
            //else if
        }
    }
});
Template.manageAccount.events({
   'click #checkOutWniosek':function(e){
       //e.preventDefault();
       //
       //var userDraft=UsersDraft.findOne({'profile.idUser':Meteor.userId()});
       //if(userDraft){
       //    var kwestia=Kwestia.findOne({idUser:userDraft._id});
       //    console.log(kwestia);
       //    Session.setPersistent("kwestiaOsobowa",kwestia._id);
       //    Router.go("informacjeKwestia");
       //}
   }
});