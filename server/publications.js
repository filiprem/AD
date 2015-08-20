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

Meteor.publish('subroles', function(){
    return Subroles.find({});
})

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

Meteor.publish('kwestieArchiwum',function(){
    return Kwestia.find({
        $or: [
            {czyAktywny: false},
            {$and: [{dataGlosowania: {$lt: moment().format()}}, {$where: function () {return this.wartoscPriorytetu <=0}}]},
            {status: KWESTIA_STATUS.ARCHIWALNA}
        ]
    });
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

Meteor.publish('pagesInfo', function() {
    return PagesInfo.find({czyAktywny:true});
});

Meteor.publish('pagesInfoByLang', function(routeName) {
    return PagesInfo.find({routeName:routeName,czyAktywny:true});
});

Meteor.startup(function () {
    //Subroles.remove({});
    var permissions = [
        //uzytkownicy
        {name: "manage-my-account", description: "Zarządzanie swoim profilem"},
        {name: "edit-my-profile", description: "Edycja mojego profilu"},
        {name: "manage-all-profiles", description: "Zarządzanie wszystkimi profilami użytkowników"},
        {name: "see-user-profile-info", description: "Możliwość przeglądania szczegółów profili użytkowników"},
        {name: "manage-all-users", description: "Zarządzanie użytkownikami"},
        {name: "edit-user-profile", description: "Możliwość edycji profilu użytkownika"},
        {name: "manage-roles", description: "Zarządzanie rolami"},
        {name: "manage-subroles", description: "Zarządzanie uprawnieniami"},
        {name: "add-role-permission", description: "Możliwość dodania roli"},
        {name: "add-subrole-permission", description: "Możliwość dodania uprawnienia"},

        //rodzaje
        {name: "manage-all-rodzaje", description: "Zarządzanie rodzajami"},
        {name: "add-rodzaj", description: "Możliwość dodania rodzaju"},
        {name: "edit-rodzaj", description: "Możliwość edycji rodzaju"},

        //tematy
        {name: "manage-all-tematy", description: "Zarządzanie tematami"},
        {name: "add-temat", description: "Możliwość dodania tematu"},
        {name: "edit-temat", description: "Możliwość edycji tematu"},

        //kwestie
        {name: "manage-kwestia-list", description: "Zarządzanie Wykazem Kwestii"},
        {name: "can-vote-kwestia", description: "Możliwość nadawania priorytetu Kwestii"},
        {name: "can-vote-post", description: "Możliwość głosowania na posty w dyskusjii Kwestii"},
        {name: "manage-realizacja", description: "Zarządzanie modułem Realizacja"},
        {name: "manage-archiwum-list", description: "Zarządzanie Archiwum"},
        {name: "manage-moje-kwestie", description: "Zarządzanie moimi Kwestiami"},
        {name: "manage-kwestie-oczekujace", description: "Zarządzanie Kwestiami oczekującymi na kategoryzację"},
        {name: "kategoryzacja-kwestii-oczekujacej", description: "Możliwość kategoryzacji Kwestii"},
        {name: "manage-kwestia-info", description: "Możliwość podglądu informacji o Kwestii"},
        {name: "can-add-option", description: "Możliwość dodania Opcji Kwestii"},
        {name: "can-add-priorytet-kwestia", description: "Możliwość nadania priorytetu Kwestii"},
        {name: "can-add-priorytet-post", description: "Możliwość nadania priorytetu postu"},
        {name: "can-add-post-archiwum", description: "Możliwość wybrania Przenieś Do Archiwum"},
        {name: "can-add-post-kosz", description: "Możliwość wybrania Przenieś Do Kosza"},
        {name: "can-clear-priorytety", description: "Możliwość wyczyszczenia priorytetów"},
        {name: "can-add-post", description: "Możliwość dodania posta - dyskusja"},
        {name: "can-add-answer", description: "Możliwość dodania odpowiedzi do posta - dyskusja"},

        //parametry
        {name: "manage-all-parametry", description: "Zarządzanie parametrami"},
        {name: "add-parametr", description: "Możliwość dodania parametru"},
        {name: "edit-parametr", description: "Możliwość edycji parametru"},
        {name: "preview-parametr", description: "Możliwość podglądu parametru"},

        //raporty
        {name: "manage-all-raporty", description: "Zarządzanie raportami"},
        {name: "add-raport", description: "Możliwość dodania raportu"},

        //języki
        {name: "manage-all-languages", description: "Zarządzanie językami"},
        {name: "add-language", description: "Możliwość dodania języka"},
        {name: "edit-language", description: "Możliwość edycji języka"}
    ];

    _.each(permissions, function (e) {
        var s = Subroles.insert({name: e.name, description: e.description});
    });
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
    if(Parametr.find().count()==0) {
        Meteor.call('addParametr', globalParameters, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
        });
    }

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