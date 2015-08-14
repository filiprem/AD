Meteor.methods({
    registerAddKwestiaNotification: function(prop){
        if(!prop.users){
            var allUsers = Users.find({}).fetch();
            prop.users = allUsers;
            console.log("===========");
            console.log("====PROP====");
            console.log(prop);
            console.log("===========");
        }
    }
})