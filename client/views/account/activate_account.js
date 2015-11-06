Template.activateAccount.rendered=function(){
    var currentRoute=Router.current().params;
    var userD=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
    var clickedLinkCount=userD.licznikKlikniec+1;
    Meteor.call("updateLicznikKlikniec",userD._id,clickedLinkCount,function(error){
       if(!error){
           var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny,czyAktywny:true});
           if(userDraft) {
               var newUser = [
                   {
                       email: userDraft.email,
                       login: "",
                       firstName: userDraft.profile.firstName,
                       lastName: userDraft.profile.lastName,
                       address: userDraft.profile.address,
                       zip: userDraft.profile.zip,
                       role: 'user',
                       userType: userDraft.profile.userType,
                       uwagi: userDraft.profile.uwagi,
                       language: userDraft.profile.language,
                       city:userDraft.profile.city,
                       pesel:userDraft.profile.pesel,
                       rADking:0

                   }];
               newUser[0].login = generateLogin(newUser[0].firstName, newUser[0].lastName);
               newUser[0].fullName=newUser[0].firstName+" "+newUser[0].lastName;
               newUser[0].password=CryptoJS.MD5(newUser[0].login).toString();
               newUser[0].confirm_password=newUser[0].password;

               Meteor.call('addUser', newUser, function (error,ret) {
                   if (error) {
                       console.log(error.reason);
                   }
                   else {
                       var idUser=ret;
                       console.log("idUser");
                       console.log(idUser);
                       Meteor.call("removeUserDraft", userDraft._id, function (error) {
                           if (error)
                               console.log(error.reason);
                           else{
                               Meteor.call("sendFirstLoginData",Users.findOne({_id:idUser}),newUser[0].password,function(error){
                                   if(error)
                                       console.log(error.reason);
                               })
                           }
                       });
                   }
               });
           }
       }
    });
};
Template.activateAccount.helpers({
    notActivatedAccount:function(){
        var currentRoute=Router.current().params;
        console.log("current route");
        console.log(currentRoute.linkAktywacyjny);
        var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
        if(userDraft)
            return userDraft.czyAktywny==true || userDraft.licznikKlikniec<=1 ? true : false;
        return true;
    }
});