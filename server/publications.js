//TO DO zbadac gdzie są subskrypcje i używac jednej publikacji bo robia to samo

// USERS

Meteor.publish("allUserData", function () {
    return Meteor.users.find({});
});

Meteor.publish('users', function () {
    return Users.find({});
});

Meteor.publish('usersRoles', function () {
    return Users.find({}, {fields: {roles: 1}});
});

Meteor.publish('usersEmails', function () {
    return Users.find({}, {fields: {emails: 1}});
});

Meteor.publish('usersDraft', function () {
    return UsersDraft.find({});
});

Meteor.publish('userDraft', function (id) {
    return UsersDraft.find({idUser: id});
});

Meteor.publish('usersDraftEmails', function () {
    return UsersDraft.find({}, {fields: {email: 1}});
});

Meteor.publish(null, function (){
    return Meteor.roles.find({})
});

Meteor.publish('subroles', function () {
    return Subroles.find({});
})

// RODZAJE

Meteor.publish('rodzaje', function () {
    return Rodzaj.find({});
});

Meteor.publish('rodzaj', function (id) {
    return Rodzaj.find({_id: id});
});

// TEMATY

Meteor.publish('tematy', function () {
    return Temat.find({});
});

Meteor.publish('temat', function (id) {
    return Temat.find({_id: id});
});

// PARAMETRY

Meteor.publish('parametr', function () {
    return Parametr.find({});
});

// RAPORTY

Meteor.publish('raport', function () {
    return Raport.find({});
});

// KWESTIE

Meteor.publish('kwestie', function () {
    return Kwestia.find({});
});

Meteor.publish('kwestia', function (id) {
    return Kwestia.find({_id: id});
});

Meteor.publish('kwestieOpcje', function (id) {
    return Kwestia.find({idParent: id});
});

Meteor.publish('kwestieOczekujace', function (status) {
    return Kwestia.find({status: status, czyAktywny: true})
});

Meteor.publish('kwestieNazwa', function () {
    return Kwestia.find({}, {fields: {kwestiaNazwa: 1, czyAktywny: 1}});
});

Meteor.publish('kwestieInfo', function () {
    return Kwestia.find({}, {
        fields: {
            kwestiaNazwa: 1,
            czyAktywny: 1,
            krotkaTresc: 1,
            szczegolowaTresc: 1,
            idTemat: 1,
            idRodzaj: 1
        }
    });
});

Meteor.publish('kwestieUser', function (id) {
    return Kwestia.find({idUser: id, czyAktywny: true})
});

Meteor.publish('kwestieArchiwum', function () {
    return Kwestia.find({
        $or: [
            {czyAktywny: false},
            {
                $and: [{dataGlosowania: {$lt: moment().format()}}, {
                    $where: function () {
                        return this.wartoscPriorytetu <= 0
                    }
                }]
            },
            {status: KWESTIA_STATUS.ARCHIWALNA},
            {status: KWESTIA_STATUS.HIBERNOWANA}
        ]
    });
});

//POSTS

Meteor.publish('postsByKwestiaId', function (id) {
    return Posts.find({idKwestia: id, czyAktywny: true});
});

Meteor.publish('allPosts', function () {
    return Posts.find({czyAktywny: true});
});

//LANGUAGES

Meteor.publish('languages', function () {
    return Languages.find({czyAktywny: true});
});

Meteor.publish('language', function (id) {
    return Languages.find({_id: id, czyAktywny: true});
});

//PAGES INFO

Meteor.publish('pagesInfo', function () {
    return PagesInfo.find({czyAktywny: true});
});

Meteor.publish('pagesInfoByLang', function (routeName) {
    return PagesInfo.find({routeName: routeName, czyAktywny: true});
});

Meteor.publish('kwestieRealizacja', function () {
    return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.REALIZOWANA});
});

//ZESPOL REALIZACYJNY

Meteor.publish('zespolRealizacyjny', function(){
    return ZespolRealizacyjny.find({});
});
