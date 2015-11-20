//TO DO zbadac gdzie są subskrypcje i używac jednej publikacji bo robia to samo

// USERS

Meteor.publish("allUserData", function () {
    return Meteor.users.find({});
});

Meteor.publish('users', function () {
    return Users.find({});
});

Meteor.publish('user', function (id) {
    return Users.find({_id:id});
});

Meteor.publish('usersRoles', function () {
    return Users.find({}, {fields: {roles: 1}});
});

Meteor.publish('usersEmails', function () {
    return Users.find({}, {fields: {emails: 1}});
});

Meteor.publish('usersType', function () {
    return Users.find({}, {fields: {'profile.userType': 1}});
});

Meteor.publish('usersUsernames', function () {
    return Users.find({}, {fields: {username: 1}});
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

Meteor.publish('parametrDraft', function () {
    return ParametrDraft.find({});
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
    return Kwestia.find({}, {fields: {kwestiaNazwa: 1,czyAktywny: 1}});
});

Meteor.publish('kwestieNazwaIdUserDataWprowadzenia', function () {
    return Kwestia.find({}, {fields: {kwestiaNazwa: 1,idUser:1,dataWprowadzenia:1, czyAktywny: 1}});
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

Meteor.publish('kwestieGlosowane', function () {
    return Kwestia.find({czyAktywny: true,status:KWESTIA_STATUS.GLOSOWANA})
});

Meteor.publish('kwestieArchiwum', function () {
    return Kwestia.find({
        $or: [
            {czyAktywny: false},
            //{
            //    $and: [{dataGlosowania: {$lt: moment().format()}}, {
            //        $where: function () {
            //            return this.wartoscPriorytetu <= 0
            //        }
            //    }]
            //},
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

//ZESPOL REALIZACYJNY

Meteor.publish('zespolyRealizacyjne', function(){
    return ZespolRealizacyjny.find({});
});

Meteor.publish('zespolRealizacyjny', function(id){
    return ZespolRealizacyjny.find({_id:id});
});

Meteor.publish('zespolyRealizacyjneDraft', function(){
    return ZespolRealizacyjnyDraft.find({});
});

Meteor.publish('kwestieRealizacja', function () {
    return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.REALIZOWANA});
});

Meteor.publish('kwestieZrealizowana', function () {
    return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.ZREALIZOWANA});
});

Meteor.publish('kwestieArrayStatus', function (array) {
    return Kwestia.find({czyAktywny: true, status: {$in:array}});
});

Meteor.publish('kwestieActivity', function (activity) {
    return Kwestia.find({czyAktywny: activity});
});

Meteor.publish('powiadomienia', function () {
    return Powiadomienie.find({czyAkywny:true});
});

Meteor.publish('myNotifications', function (idOdbiorca) {
    return Powiadomienie.find({idOdbiorca:idOdbiorca,czyAktywny:true});
});

Meteor.publish('notificationsNotReadIssue', function (idOdbiorca) {
    return Powiadomienie.find({idOdbiorca:idOdbiorca,czyAktywny:true},{fields: {czyOdczytany:1,idOdbiorca:1,czyAktywny:1,powiadomienieTyp:1}});
});

Meteor.publish('notificationsNotRead', function (idOdbiorca) {
    return Powiadomienie.find({idOdbiorca:idOdbiorca,czyAktywny:true},{fields: {czyOdczytany:1,idOdbiorca:1,czyAktywny:1}});
});

Meteor.publish('issueInNotification', function (notification) {
    if(notification.idKwestia!=null)
        return Kwestia.find({_id:{$in:[notification.idKwestia]}});
});

Meteor.publish('issuesInNotifications', function (idUser) {
    var powiadomienia=Powiadomienie.find({idOdbiorca:idUser});
    var array=[];
    powiadomienia.forEach(function(item){
        if(item.idKwestia!=null)
            array.push(item.idKwestia);
    });
    return Kwestia.find({_id:{$in:array}},{fields: {kwestiaNazwa:1}});
});