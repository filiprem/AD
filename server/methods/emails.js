// pobiera pliki .html z folderu private
SSR.compileTemplate('email_act',Assets.getText('email_act.html'));
SSR.compileTemplate('email_added_issue',Assets.getText('email_added_issue.html'));
SSR.compileTemplate('email_lobbing_issue',Assets.getText('email_lobbing_issue.html'));
SSR.compileTemplate('email_started_voting',Assets.getText('email_started_voting.html'));

Meteor.methods({
    registerAddKwestiaNotification: function(prop){
        if(!prop.users){
            var allUsers = Users.find({}).fetch();
            prop.users = allUsers;
        }
    },
    sendEmail: function (to, from, subject, text) {
        this.unblock();
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
        Users.find({}).forEach(function(item) {
            if (!Roles.userIsInRole(item, ['admin'])) {
                var html = SSR.render('email_added_issue',{
                    username:item.username,
                    organizacja: parametr.nazwaOrganizacji,
                    szczegolyKwestii: kwestiaItem.szczegolowaTresc
                });
                Email.send({
                    to: item.emails[0].address,
                    from: "admin AD",
                    subject: "Dodano nową kwestię",
                    html: html
                });
            }
        });
    }
});