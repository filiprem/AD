// pobiera pliki .html z folderu private
SSR.compileTemplate('email_act',Assets.getText('email_act.html'));
SSR.compileTemplate('email_added_issue',Assets.getText('email_added_issue.html'));
SSR.compileTemplate('email_lobbing_issue',Assets.getText('email_lobbing_issue.html'));
SSR.compileTemplate('email_started_voting',Assets.getText('email_started_voting.html'));
SSR.compileTemplate('email_honorowy_invitation',Assets.getText('email_honorowy_invitation.html'));
SSR.compileTemplate('email_application_confirmation',Assets.getText('email_application_confirmation.html'));

Template.email_started_voting.nadanoPriorytet= function (kwestiaId,userId) {
    var kwestia = Kwestia.findOne(kwestiaId);
    if (kwestia) {
        var g = kwestia.glosujacy;
        for (var i = 0; i < g.length; i++) {
            if (userId == g[i].idUser) {
                if (g[i].value > 0) {
                    g[i].value = "+" + g[i].value;
                    return g[i].value;
                }
                else
                    return g[i].value;
            }
        }
    }
}

Meteor.methods({
    registerAddKwestiaNotification: function(prop){
        if(!prop.users){
            var allUsers = Users.find({}).fetch();
            prop.users = allUsers;
        }
    },
    sendEmail: function (to, from, subject, text) {
        this.unblock();
        console.log(from);
        Email.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
    },
    sendEmailForAll: function (from, subject, text) {
        var users= Users.find();
        this.unblock();
        _.each(users,function(item){
            Email.send({
                to: item.emails[0].address,
                from: from,
                subject: subject,
                text: text
            });
        });
    },
    sendEmailHonorowyInvitation:function(idUser){
        var user=null;
        console.log(idUser);
        var userDraft=UsersDraft.findOne({_id:idUser});
        if(userDraft.profile.idUser!=null){//to znaczy,ze zaproszono uzytkownika już mającego konto w systemie i stamtad pobieramy dane
            userDraft=Users.findOne({_id:userDraft.idUser});
        }
        //else//to znaczy,ze to jest nowy uztykownik,nie ma go w systemie,wiec dane bierzemy z drafta
        console.log("ten user!");
        console.log(userDraft);
        var parametr = Parametr.findOne({});

        var html = SSR.render('email_honorowy_invitation',{
            username:userDraft.profile.fullName,
            organizacja: parametr.nazwaOrganizacji
        });
        Email.send({
            to: userDraft.emails[0].address,
            from: "AD "+parametr.nazwaOrganizacji,
            subject: "Zaproszenie do systemu AD "+parametr.nazwaOrganizacji,
            html: html
        });
    },
    sendEmailAddedIssue: function (idKwestia) {
        this.unblock();
        var parametr = Parametr.findOne({});
        var kwestiaItem = Kwestia.findOne({_id:idKwestia});
        var rodzaj = Rodzaj.findOne({_id:kwestiaItem.idRodzaj});
        var temat = Temat.findOne({_id:kwestiaItem.idTemat});
        Users.find({}).forEach(function(item) {
            if (!Roles.userIsInRole(item, ['admin'])) {
                var html = SSR.render('email_added_issue',{
                    username:item.username,
                    organizacja: parametr.nazwaOrganizacji,
                    szczegolyKwestii: kwestiaItem.szczegolowaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    idKwestii:kwestiaItem._id,
                    idUser: item._id,
                    rodzaj: rodzaj.nazwaRodzaj,
                    temat: temat.nazwaTemat
                });
                Email.send({
                    to: item.emails[0].address,
                    from: "admin AD",
                    subject: "Dodano nową kwestię",
                    html: html
                });
            }
        });
    },
    sendEmailAct: function (idKwestia) {
        this.unblock();
        var parametr = Parametr.findOne({});
        var kwestiaItem = Kwestia.findOne({_id:idKwestia});
        var rodzaj = Rodzaj.findOne({_id:kwestiaItem.idRodzaj});
        var temat = Temat.findOne({_id:kwestiaItem.idTemat});
        Users.find({}).forEach(function(item) {
            if (!Roles.userIsInRole(item, ['admin'])) {
                var html = SSR.render('email_act',{
                    username:item.username,
                    organizacja: parametr.nazwaOrganizacji,
                    szczegolyKwestii: kwestiaItem.szczegolowaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    idKwestii:kwestiaItem._id,
                    rodzaj: rodzaj.nazwaRodzaj,
                    temat: temat.nazwaTemat,
                    userType: item.profile.userType
                });
                Email.send({
                    to: item.emails[0].address,
                    from: "admin AD",
                    subject: "Podjęto uchwałę",
                    html: html
                });
            }
        });
    },
    sendEmailLobbingIssue: function (idKwestia,uzasadnienie) {
        this.unblock();
        var parametr = Parametr.findOne({});
        var kwestiaItem = Kwestia.findOne({_id:idKwestia});
        var rodzaj = Rodzaj.findOne({_id:kwestiaItem.idRodzaj});
        var temat = Temat.findOne({_id:kwestiaItem.idTemat});
        Users.find({}).forEach(function(item) {
            if (!Roles.userIsInRole(item, ['admin'])) {
                var html = SSR.render('email_lobbing_issue',{
                    username:item.username,
                    organizacja: parametr.nazwaOrganizacji,
                    szczegolyKwestii: kwestiaItem.szczegolowaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    idKwestii:kwestiaItem._id,
                    rodzaj: rodzaj.nazwaRodzaj,
                    temat: temat.nazwaTemat,
                    userType: item.profile.userType,
                    uzasadnienie: uzasadnienie,
                    email: item.emails[0].address,
                    imie: item.profile.firstName,
                    nazwisko: item.profile.lastName
                });
                Email.send({
                    to: item.emails[0].address,
                    from: "admin AD",
                    subject: "Lobbowanie Kwestii",
                    html: html
                });
            }
        });
    },
    sendEmailStartedVoting: function (idKwestia) {
        this.unblock();
        var parametr = Parametr.findOne({});
        var kwestiaItem = Kwestia.findOne({_id:idKwestia});
        var rodzaj = Rodzaj.findOne({_id:kwestiaItem.idRodzaj});
        var temat = Temat.findOne({_id:kwestiaItem.idTemat});
        Users.find({}).forEach(function(item) {
            if (!Roles.userIsInRole(item, ['admin'])) {
                var html = SSR.render('email_started_voting',{
                    username:item.username,
                    organizacja: parametr.nazwaOrganizacji,
                    szczegolyKwestii: kwestiaItem.szczegolowaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    idKwestii:kwestiaItem._id,
                    dataGlosowania:kwestiaItem.dataGlosowania,
                    rodzaj: rodzaj.nazwaRodzaj,
                    temat: temat.nazwaTemat,
                    wartoscPriorytetu:kwestiaItem.wartoscPriorytetu,
                    glosujacy:kwestiaItem.glosujacy.length,
                    kworum: liczenieKworumZwykle()
                });
                Email.send({
                    to: item.emails[0].address,
                    from: "admin AD",
                    subject: "Rozpoczęto głosowanie Kwestii",
                    html: html
                });
            }
        });
    },
    sendApplicationConfirmation:function(userData){
        var  userTypeData=null;
        switch (userData.userType){
            case USERTYPE.CZLONEK: userTypeData="członka zwyczajnego";break;
            case USERTYPE.HONOROWY: userTypeData="członka honorowego";break;
        }
        var html = SSR.render('email_application_confirmation',{
            username:userData.profile.fullName,
            organizacja: Parametr.findOne().nazwaOrganizacji,
            userTypeData:userTypeData,
            idKwestia:"111111"
        });
        Email.send({
            to: userData.emails[0].address,
            from: "AD "+Parametr.findOne().nazwaOrganizacji,
            subject: "Potwierdzenie przyjęcia aplikacji na stanowisko "+userTypeData,
            html: html
        });
    }
});