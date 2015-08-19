Meteor.methods({
    registerAddKwestiaNotification: function(prop){
        if(!prop.users){
            var allUsers = Users.find({}).fetch();
            prop.users = allUsers;
            console.log("====PROP gdy nie ma users====");
            console.log(prop);
            console.log("===========");
        }
        else{
            console.log("*** PROP gdy sa ***")
            console.log(prop)
        }
    }
})