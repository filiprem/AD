Template.profileList.rendered = function()
{};

Template.profileList.events({
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
Template.profileList.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'profile.firstName', label: "Imię"},
                {key: 'profile.lastName', label: "Nazwisko"},
                {key: 'username', label: "Nazwa użytkownika",tmpl:Template.usernameLink},
                {key: 'email', label: "Email", tmpl: Template.userEmail},
                {key: 'roles', label: "Rola"},
                {key: 'profile.rADking', label: "Ranking"},
            ]
        };
    },
    UserListAdmin: function(){
        return Users.find({$where:function(){return (this._id!=Meteor.userId());}}).fetch();
    },
    usersCount: function(){
        return Users.find().count()-1;
    }
});