Meteor.publish('rodzaje', function() {
    return Rodzaj.find();
});

Meteor.publish('rodzaj', function(id) {
    return Rodzaj.find({_id:id});
});
//TO DO zbadac gdzie są subskrypcje i używac jednej publikacji bo robia to samo
Meteor.publish("allUserData", function () {
    return Meteor.users.find({});
});

Meteor.publish('users', function(){
    return Users.find();
});

Meteor.publish(null, function (){
    return Meteor.roles.find({})
});

Meteor.publish('parametr', function() {
    return Parametr.find({});
});

Meteor.publish('tematy', function() {
    return Temat.find({});
});

Meteor.publish('temat', function(id) {
    return Temat.find({_id:id});
});

Meteor.publish('raport', function(){
   return Raport.find({});
});

Meteor.publish('kwestie', function(){
    return Kwestia.find({});
});

Meteor.publish('kwestia', function(id){
    return Kwestia.find({_id:id});
});

Meteor.publish('kwestieOpcje', function(id){
    return Kwestia.find({idParent: id});
});

Meteor.publish('kwestieOczekujace', function(status){
    return Kwestia.find({status:status,czyAktywny:true})
});

Meteor.publish('kwestieNazwa', function(){
    return Kwestia.find({},{fields:{'kwestiaNazwa':1,czyAktywny:1}});
});

Meteor.publish('kwestieInfo', function(){
    return Kwestia.find({},{fields:{'kwestiaNazwa':1,czyAktywny:1,krotkaTresc:1,szczegolowaTresc:1,idTemat:1,idRodzaj:1}});
});

Meteor.publish('kwestieUser', function(id){
    return Kwestia.find({idUser:id,czyAktywny:true})
});

// TO DO - usunąc przy refaktorze
Meteor.publish('kwestiaTresc', function(){
    return KwestiaTresc.find({});
});

Meteor.publish('glosujacy', function() {
    return Parametr.find();
});

Meteor.publish('postsByKwestiaId', function(id) {
    return Posts.find({idKwestia:id, czyAktywny:true});
});

Meteor.publish('allPosts', function() {
    return Posts.find({czyAktywny:true});
});

Meteor.publish('languages', function() {
    return Languages.find({czyAktywny:true});
});

Meteor.publish('language', function(id) {
    return Languages.find({_id:id,czyAktywny:true});
});

Meteor.startup(function () {
    var data = [
        {
            "Login": "adminSDD",
            "FirstName": "Admin",
            "LastName": "SDD",
            "Profession": "Administrator",
            "Address": "",
            "Zip": "",
            "Gender": "mężczyzna",
            "Phone": "",
            "Email": "sdd.meteor@gmail.com",
            "Web": "sdd.meteor.com",
            "Role": "admin"
        }];
    if((Meteor.users.find().count() == 0)) {
        var users = [];
        for (var i = 0; i < data.length; i++) {
            users.push({
                    firstName: data[i].FirstName,
                    lastName: data[i].LastName,
                    fulName: data[i].FirstName + ' ' + data[i].LastName,
                    login: data[i].Login,
                    email: data[i].Email,
                    profession: data[i].Profession,
                    address: data[i].Address,
                    zip: data[i].Zip,
                    gender: data[i].Gender,
                    phone: data[i].Phone,
                    web: data[i].Web,
                    roles: data[i].Role
                }
            );
        }
        _.each(users, function (user) {
            var id;

            id = Accounts.createUser({
                username: user.login,
                email: user.email,
                password: "2015adminSDD!",
                profile: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    profession: user.profession,
                    address: user.address,
                    zip: user.zip,
                    gender: user.gender,
                    phone: user.phone,
                    web: user.web,
                    role: user.roles
                }
            });

            if (user.roles.length > 0) {
                Roles.addUsersToRoles(id, user.roles);
            }
        });
    }
});