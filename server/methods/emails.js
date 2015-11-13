// pobiera pliki .html z folderu private
SSR.compileTemplate('email_act',Assets.getText('email_act.html'));
SSR.compileTemplate('email_added_issue',Assets.getText('email_added_issue.html'));
SSR.compileTemplate('email_lobbing_issue',Assets.getText('email_lobbing_issue.html'));
SSR.compileTemplate('email_lobbing_issue_access',Assets.getText('email_lobbing_issue_access.html'));
SSR.compileTemplate('email_lobbing_issue_full_access',Assets.getText('email_lobbing_issue_full_access.html'));
SSR.compileTemplate('email_lobbing_issue_global_params',Assets.getText('email_lobbing_issue_global_params.html'));
SSR.compileTemplate('email_started_voting',Assets.getText('email_started_voting.html'));
SSR.compileTemplate('email_honorowy_invitation',Assets.getText('email_honorowy_invitation.html'));
SSR.compileTemplate('email_application_confirmation',Assets.getText('email_application_confirmation.html'));
SSR.compileTemplate('email_application_rejected',Assets.getText('email_application_rejected.html'));
SSR.compileTemplate('email_application_accepted',Assets.getText('email_application_accepted.html'));
SSR.compileTemplate('email_application_accepted_existing_user',Assets.getText('email_application_accepted_existing_user.html'));
SSR.compileTemplate('email_login_data',Assets.getText('email_login_data.html'));

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
    sendEmailLobbingIssue: function (idKwestia,uzasadnienie,idAuthor) {
        this.unblock();
        var parametr = Parametr.findOne({});
        var kwestiaItem = Kwestia.findOne({_id:idKwestia});
        var htmlText=null;
        var title=null;
        var oldValue=null;
        var newValue=null;
        var rodzaj=null;
        var temat=null;
        var fullNameApp=null;
        var emailApp=null;
        var peselApp=null;
        var addressApp=null;
        var codeApp=null;
        var cityApp=null;
        var uwagiApp=null;
        if(kwestiaItem.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){
            htmlText='email_lobbing_issue_global_params';
            title=kwestiaItem.szczegolowaTresc.title;
            newValue=kwestiaItem.szczegolowaTresc.newValue;
            oldValue=kwestiaItem.szczegolowaTresc.oldValue;
        }
        else{
            rodzaj = Rodzaj.findOne({_id:kwestiaItem.idRodzaj}).nazwaRodzaj;
            temat = Temat.findOne({_id:kwestiaItem.idTemat}).nazwaTemat;
            console.log(kwestiaItem.typ);
            if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_HONOROWY,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],kwestiaItem.typ)){
                console.log('contains!!');
                htmlText='email_lobbing_issue_access';
                fullNameApp=kwestiaItem.szczegolowaTresc.fullName;
                uwagiApp=kwestiaItem.szczegolowaTresc.uwagi;
                emailApp=kwestiaItem.szczegolowaTresc.email;
                peselApp=kwestiaItem.szczegolowaTresc.pesel;
                addressApp=kwestiaItem.szczegolowaTresc.address;
                codeApp=kwestiaItem.szczegolowaTresc.zip+" "+kwestiaItem.szczegolowaTresc.city;
                cityApp=kwestiaItem.szczegolowaTresc.city;
                console.log("uwagi appp");
                console.log(uwagiApp);
            }
            else{
                console.log("tu nie wejdzie");
                htmlText='email_lobbing_issue';
            }
        }

        var author=Users.findOne({_id:idAuthor});
        Users.find({}).forEach(function(item) {
            if (!Roles.userIsInRole(item, ['admin']) && item._id!=Meteor.userId() && item.profile.userType==USERTYPE.CZLONEK) {
                htmlText=setHTMLTextLobbingIssue(kwestiaItem.typ);
                if(kwestiaItem.idZespolRealizacyjny && kwestiaItem.typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY) {
                    console.log('tu tez nie!');
                    var zespol = ZespolRealizacyjny.findOne({_id:kwestiaItem.idZespolRealizacyjny});
                    if(!zespol) {
                        zespol = ZespolRealizacyjnyDraft.findOne({_id: kwestiaItem.idZespolRealizacyjny});
                        if(zespol.idZR)
                            zespol = ZespolRealizacyjny.findOne({_id: zespol.idZR});
                    }
                    if(zespol.protector){
                        if(zespol.protector==item._id) {
                            htmlText = 'email_lobbing_issue_full_access';
                        }
                        console.log("zespol protector");
                        console.log(zespol.protector);
                    }
                }
                console.log("html text:");
                console.log(htmlText);
                console.log("uwagi appp");
                console.log(uwagiApp);
                var html = SSR.render(htmlText,{
                    welcomeGender:recognizeSex(item),
                    username:item.username,
                    organizacja: parametr.nazwaOrganizacji,
                    krotkaTresc:kwestiaItem.krotkaTresc,
                    szczegolyKwestii: kwestiaItem.szczegolowaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    idKwestii:kwestiaItem._id,
                    rodzaj: rodzaj,
                    temat: temat,
                    userType: item.profile.userType,
                    uzasadnienie: uzasadnienie,
                    email: item.emails[0].address,
                    fullName:item.profile.fullName,
                    imie: author.profile.firstName,
                    nazwisko: author.profile.lastName,

                    title:title,//for global params
                    newValue:newValue,
                    oldValue:oldValue,

                    fullNameApp:fullNameApp,//for osobowe
                    emailApp:emailApp,
                    peselApp:peselApp,
                    addressApp:addressApp,
                    codeApp:codeApp,
                    cityApp:cityApp,
                    uwagiApp:uwagiApp
                });
                Email.send({
                    to: item.emails[0].address,
                    from: author.profile.firstName+" "+author.profile.lastName,
                    subject: "Proszę o wsparcie mojej kwestii",
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
                    welcomeGender:recognizeSex(item),
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
    sendEmailHonorowyInvitation:function(userData,text){
        var data=applicationEmail(userData,text,null);
        Email.send({
            to: data.to,
            from: data.to,
            subject: "Zaproszenie do aplikowania na stanowisko Członka Honorowego w organizacji "+Parametr.findOne().nazwaOrganizacji,
            html: data.html
        });
    },
    sendApplicationConfirmation:function(userData){
        var data=applicationEmail(userData,"confirm",null);
        console.log("uwaagaaa");
        console.log(Meteor.absoluteUrl());
        Email.send({
            to: data.to,
            from: data.to,
            subject: "Potwierdzenie przyjęcia aplikacji na stanowisko "+data.userType,
            html: data.html
        });
    },
    sendApplicationRejected:function(userData){
        var data=applicationEmail(userData,"reject",null);

        Email.send({
            to: data.to,
            from: data.to,
            subject: "Odrzucenie aplikacji na stanowisko "+data.userType,
            html: data.html
        });
    },
    sendApplicationAccepted:function(userData,text){
        var data=applicationEmail(userData,text,null);
        Email.send({
            to: data.to,
            from: data.to,
            subject: "Akceptacja aplikacji na stanowisko "+data.userType,
            html: data.html
        });
    },
    sendFirstLoginData:function(userData,pass){
        var data=applicationEmail(userData,"loginData",pass);
        Email.send({
            to: data.to,
            from: data.to,
            subject: "Dane logowania do systemu "+Parametr.findOne().nazwaOrganizacji,
            html: data.html
        });
    }
});
recognizeSex=function(userData){
    var welcomeGender=null;
    if(userData.profile.pesel){
        if(userData.profile.pesel!="") {
            var pesel = userData.profile.pesel.substring(9, 10);
            if (_.contains(['1', '3', '5', '7', '9'], pesel))
                welcomeGender = "Szanowny";
            else welcomeGender = "Szanowna"
        }
        else
            welcomeGender="Szanowny/a ";
    }
    else
        welcomeGender="Szanowny/a ";

    return welcomeGender;
}
applicationEmail=function(userData,emailTypeText,passw){
    console.log("user data");
    console.log(userData);
    var welcomeGender=recognizeSex(userData);

    var  userTypeData=null;
    switch (userData.profile.userType){
        case USERTYPE.CZLONEK: userTypeData="członka zwyczajnego";break;
        case USERTYPE.DORADCA: userTypeData="doradcę";break;
        case USERTYPE.HONOROWY: userTypeData="członka honorwego";break;
    }
    var url=null;
    var login=null;
    var pass=null;
    var to=userData.email;
    var textGender=null;
    if(emailTypeText=="reject") {
        emailTypeText = 'email_application_rejected';
    }
    else if (emailTypeText == "acceptNew") {
        emailTypeText = 'email_application_accepted';
        if(userData.linkAktywacyjny)
            url="/account/activate_account/"+userData.linkAktywacyjny;
        if(welcomeGender=="Szanowny")
            textGender="mógł";
        else if(welcomeGender=="Szanowna")
            textGender="mogła";
        else
            textGender="mógł/mogła";
    }
    else if(emailTypeText=="acceptExisting"){
        emailTypeText = 'email_application_accepted_existing_user';
    }
    else if(emailTypeText=="honorowyInvitation"){
        emailTypeText = 'email_honorowy_invitation';
        console.log("jest link!");
        console.log(userData);
        console.log(userData.linkAktywacyjny);
        if(userData.linkAktywacyjny)
            url="/account/answer_invitation/"+userData.linkAktywacyjny;
    }
    else if(emailTypeText=="loginData"){
        emailTypeText = 'email_login_data';
        login=userData.username;
        pass=passw;
        to=userData.emails[0].address
    }
    else{
       emailTypeText = 'email_application_confirmation';
        var kwestia=Kwestia.findOne({czyAktywny:true,idUser:userData._id});
        console.log("to jest ta kwestiaa!");
        console.log(userData._id);
        console.log(kwestia);
        url=Meteor.absoluteUrl()+"/issue_info/"+kwestia._id;
    }
    console.log(url);
    var html = SSR.render(emailTypeText,{
        username:userData.profile.firstName+" "+userData.profile.lastName,
        organizacja: Parametr.findOne().nazwaOrganizacji,
        userTypeData:userTypeData,
        url:url,
        welcomeType:welcomeGender,
        login:login,
        password:pass,
        textGender:textGender
    });
    var obj={
        to:to,
        from:"AD "+Parametr.findOne().nazwaOrganizacji,
        html:html,
        userType:userTypeData
    };
    return obj;
};
setHTMLTextLobbingIssue=function(typ){
    var text=null;
      if(typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
        text="email_lobbing_issue_global_params";
      else if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_HONOROWY,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],typ)) {
          text = 'email_lobbing_issue_access';
      }
      else text='email_lobbing_issue';

      return text;
};