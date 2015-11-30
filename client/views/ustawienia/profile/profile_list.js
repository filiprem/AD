Template.profileList.created = function () {
    this.usersRV = new ReactiveVar();
};

Template.profileList.rendered = function () {
    var self = Template.instance();
    this.autorun(function () {
        var users = Users.find({
            $where: function () {
                return (this._id == Meteor.userId());
            }
        });
        var tab = [];
        users.forEach(function (item) {
            tab.push(item._id);
        });
        self.usersRV.set(tab);
    })
};

Template.profileList.events({
    'click .glyphicon-trash': function (event, template) {
        Session.set('userInScope', this);
    },
    'click .glyphicon-info-sign': function (event, template) {
        Session.set('userInScope', this);
    },
    'click .glyphicon-cog': function (event, template) {
        Session.set('userInScope', this);
    },
    'click .glyphicon-pencil': function (event, template) {
        Session.set('userInScope', this);
    }
});
Template.profileList.helpers({
    'settings': function () {
        var self = Template.instance();
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'profile.firstName', label: "Imię" },
                { key: 'profile.lastName', label: "Nazwisko" },
                //{key: 'username', label: "Nazwa użytkownika", tmpl: Template.usernameLink},
                { key: 'Kontakt', label: "Kontakt", tmpl: Template.userEmailContact },
                { key: 'profile.city', label: "Miasto" }
            ],
            rowClass: function (item) {
                var tab = self.usersRV.get();
                if (_.contains(tab, item._id)) {
                    return 'myselfClass';
                }
            }
        };
    },
    //UserListAdmin: function () {
    //    return Users.find({
    //        $where: function () {
    //            return (this.roles != 'admin');
    //        }
    //    }).fetch();
    //},
    //usersCount: function () {
    //    return Users.find().count() - 1;
    //},
    //myself: function (userId) {
    //    return Meteor.userId() === userId;
    //}
});
Template.userEmailContact.helpers({
    myProfile:function(id){
        return id==Meteor.userId() ? true :false;
    },
    email:function(){
        return this.emails[0].address;
    }
});