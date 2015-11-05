// pobiera pliki .html z folderu private
SSR.compileTemplate('email_act',Assets.getText('email_act.html'));
SSR.compileTemplate('email_added_issue',Assets.getText('email_added_issue.html'));
SSR.compileTemplate('email_lobbing_issue',Assets.getText('email_lobbing_issue.html'));
SSR.compileTemplate('email_started_voting',Assets.getText('email_started_voting.html'));
SSR.compileTemplate('email_honorowy_invitation',Assets.getText('email_honorowy_invitation.html'));
SSR.compileTemplate('email_application_confirmation',Assets.getText('email_application_confirmation.html'));
SSR.compileTemplate('email_application_rejected',Assets.getText('email_application_rejected.html'));
SSR.compileTemplate('email_application_accepted',Assets.getText('email_application_accepted.html'));

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
        var data=applicationEmail(userData,"confirm");

        Email.send({
            to: data.to,
            from: data.to,
            subject: "Potwierdzenie przyjęcia aplikacji na stanowisko "+data.userType,
            html: data.html
        });
    },
    sendApplicationRejected:function(userData){
        var data=applicationEmail(userData,"reject");

        Email.send({
            to: data.to,
            from: data.to,
            subject: "Odrzucenie aplikacji na stanowisko "+data.userType,
            html: data.html
        });
    },
    sendApplicationAccepted:function(userData){
        var data=applicationEmail(userData,"accept");

        Email.send({
            to: data.to,
            from: data.to,
            subject: "Akceptacja aplikacji na stanowisko "+data.userType,
            html: data.html
        });
    }
});
applicationEmail=function(userData,emailTypeText){
    console.log("user data");
    console.log(userData);
    console.log("pesel");
    var welcomeGender=null;
    if(userData.profile.pesel){
        var pesel=userData.profile.pesel.substring(9,10);
        if(_.contains(['1','3','5','7','9'],pesel))
            welcomeGender="Szanowny";
        else welcomeGender="Szanowna"
    }
    else
        welcomeGender="Szanowny/a ";


    var  userTypeData=null;
    switch (userData.profile.userType){
        case USERTYPE.CZLONEK: userTypeData="członka zwyczajnego";break;
        case USERTYPE.HONOROWY: userTypeData="członka honorowego";break;
    }
    var url=null;
    if(emailTypeText=="reject") {
        emailTypeText = 'email_application_rejected';
    }
    else if (emailTypeText == "accept") {
        emailTypeText = 'email_application_accepted';
        url="#";
        if(userData.profile.linkAktywacyjny)
            url="activate_account/"+userData.profile.linkAktywacyjny;
    }
    else{
       emailTypeText = 'email_application_confirmation';
    }
    var html = SSR.render(emailTypeText,{
        username:userData.profile.firstName+" "+userData.profile.lastName,
        organizacja: Parametr.findOne().nazwaOrganizacji,
        userTypeData:userTypeData,
        url:"#",
        welcomeType:welcomeGender
    });
    var obj={
        to:userData.email,
        from:"AD "+Parametr.findOne().nazwaOrganizacji,
        html:html,
        userType:userTypeData
    };
    return obj;
};