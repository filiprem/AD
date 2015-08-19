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
    var globalParameters=[
        {
            "nazwaOrganizacji": "Aktywna Demokracja",
            "terytorium":"Polska",
            "kontakty":"Warszawa ul Miła",
            "regulamin":"brak regulaminu",
            "pktDodanieKwestii":10,
            "pktDodanieKomentarza":5,
            "pktDodanieOdniesienia":2,
            "pktNadaniePriorytetu":1,
            "pktAwansKwestii":20,
            "pktUdzialWZespoleRealizacyjnym":10,
            "pktZlozenieRaportuRealizacyjnego":5,
            "pktWycofanieKwestiiDoArchiwum":-20,
            "pktWycofanieKwestiiDoKosza":-40,
            "pktWyjscieZZespoluRealizacyjnego":-30,
            "pktBrakUdzialuWGlosowaniu":-30
        }
    ];
    //for(var i=0;i<globalParameters.length;i++){
    //    Parametr.insert({
    //            nazwaOrganizacji: globalParameters[i].nazwaOrganizacji,
    //            terytorium:globalParameters[i].terytorium,
    //            kontakty:globalParameters[i].kontakty,
    //            regulamin:globalParameters[i].regulamin,
    //            pktDodanieKwestii:globalParameters[i].pktDodanieKwestii,
    //            pktDodanieKomentarza:globalParameters[i].pktDodanieKomentarza,
    //            pktDodanieOdniesienia:globalParameters[i].pktDodanieOdniesienia,
    //            pktNadaniePriorytetu:globalParameters[i].pktNadaniePriorytetu,
    //            pktAwansKwestii:globalParameters[i].pktAwansKwestii,
    //            pktUdzialWZespoleRealizacyjnym:globalParameters[i].pktUdzialWZespoleRealizacyjnym,
    //            pktZlozenieRaportuRealizacyjnego:globalParameters[i].pktZlozenieRaportuRealizacyjnego,
    //            ptkWycofanieKwestiiDoArchiwum:globalParameters[i].pktWycofanieKwestiiDoArchiwum,
    //            pktWycofanieKwestiiDoKosza:globalParameters[i].pktWycofanieKwestiiDoKosza,
    //            pktWyjscieZZespoluRealizacyjnego:globalParameters[i].pktWyjscieZZespoluRealizacyjnego,
    //            pktBrakUdzialuWGlosowaniu:globalParameters[i].pktBrakUdzialuWGlosowaniu
    //        }
    //    );
    //}
    Meteor.call('addParametr', globalParameters, function (error, ret) {
        if (error) {
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else {
                throwError(error.reason);
            }
        }
    });

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