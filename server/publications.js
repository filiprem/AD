Meteor.publish('rodzaje', function () {
    return Rodzaj.find();
});

Meteor.publish('rodzaj', function (id) {
    return Rodzaj.find({_id: id});
});
//TO DO zbadac gdzie są subskrypcje i używac jednej publikacji bo robia to samo
Meteor.publish("allUserData", function () {
    return Meteor.users.find({});
});

Meteor.publish('users', function () {
    return Users.find();
});

Meteor.publish(null, function () {
    return Meteor.roles.find({})
});

Meteor.publish('subroles', function () {
    return Subroles.find({});
})

Meteor.publish('parametr', function () {
    return Parametr.find({});
});

Meteor.publish('tematy', function () {
    return Temat.find({});
});

Meteor.publish('temat', function (id) {
    return Temat.find({_id: id});
});

Meteor.publish('raport', function () {
    return Raport.find({});
});

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
    return Kwestia.find({}, {fields: {'kwestiaNazwa': 1, czyAktywny: 1}});
});

Meteor.publish('kwestieInfo', function () {
    return Kwestia.find({}, {
        fields: {
            'kwestiaNazwa': 1,
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
            {status: KWESTIA_STATUS.ARCHIWALNA}
        ]
    });
});

Meteor.publish('postsByKwestiaId', function (id) {
    return Posts.find({idKwestia: id, czyAktywny: true});
});

Meteor.publish('allPosts', function () {
    return Posts.find({czyAktywny: true});
});

Meteor.publish('languages', function () {
    return Languages.find({czyAktywny: true});
});

Meteor.publish('language', function (id) {
    return Languages.find({_id: id, czyAktywny: true});
});

Meteor.publish('pagesInfo', function () {
    return PagesInfo.find({czyAktywny: true});
});

Meteor.publish('pagesInfoByLang', function (routeName) {
    return PagesInfo.find({routeName: routeName, czyAktywny: true});
});