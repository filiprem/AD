Template.listUsers.rendered = function()
{};

Template.listUsers.events({
    'click .glyphicon-trash': function(event, template) {
        Session.set('userInScope', this);
    },
    'click .glyphicon-info-sign': function(event, template) {
        Session.set('userInScope', this);
    },
    'click .glyphicon-cog': function(event, template) {
        Session.set('userInScope', this);
    },
    'click .glyphicon-pencil': function(event, template){
        Session.set('userInScope', this);
    }
});
Template.listUsers.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: true,
            enableRegex: false,
            fields: [
                {key: 'profile.firstName', label: "Imię"},
                {key: 'profile.lastName', label: "Nazwisko"},
                {key: 'username', label: "Nazwa użytkownika"},
                {key: 'email', label: "Email", tmpl: Template.userEmail},
                {key: 'roles', label: "Rola"},
                {key: 'options', label: "Opcje", tmpl: Template.editColumnUsers }
            ]
        };
    },
    UserListAdmin: function(){
        return Users.find({}).fetch();
    },
    usersCount: function(){
        return Users.find().count();
    }
});

Template.editColumnUsers.helpers({
    myself: function(userId) {
        return Meteor.userId() === userId;
    }
});

Template.userEmail.helpers({
    email: function () {
        return getEmail(this);
    }
})