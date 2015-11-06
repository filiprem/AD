Template.addHonorowy.rendered=function(){
    var tabEmails = [];

    var temat = document.getElementById("emailHidden").value;

    Users.find({}).forEach(function (item) {
        var email = {
            nazwa: item.emails[0].address
        };
        tabEmails.push(email);
    });

    var $select2 = $('#sugerowanyEmail').selectize({
        persist: false,
        createOnBlur: true,
        create: true,
        maxItems: 1,
        labelField: 'nazwa',
        valueField: 'nazwa',
        options: tabEmails,
        create: function(input){
            //if(input!=null)
            //    return input+'ala';
            //alert("cxdcd");
            //return false;
        }
    });

    $select2[0].selectize.setValue(temat);
};
Template.addHonorowy.events({
    //'click #zglosNaHonorowegoClick':function(){
    //    $("#listDoradcy").modal("show");
    //}
    'change #sugerowanyEmail': function (e) {
        console.log("elo");
        //here unblock inputs fro name !
    }
});
Template.addHonorowy.helpers({
   // isCzlonek:function(){
   //     var user=Users.findOne({_id:Meteor.userId()});
   //    if(user){
   //        return user.profile.userType==USERTYPE.CZLONEK ? "" :"disabled";
   //    }
   //}
    isEmailInserted:function(){
        var val=document.getElementById("sugerowanyEmail");
        console.log(val);
        if(_.isNull(val))
            return "disabled";
        //var val=document.getElementById("emailHidden").value;
        console.log("ta wartosc");
        console.log(val);
        return val.value!="" || val.value.trim()!="" ? "" :"disabled";
    }
});