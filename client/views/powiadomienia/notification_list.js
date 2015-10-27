Template.notificationList.created = function(){
    this.usersRV = new ReactiveVar();
};

Template.notificationList.rendered = function () {
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
Template.notificationList.helpers({
    'settings': function () {
        var self = Template.instance();
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'powiadomienieTyp', label: "Rodzaj"},
                {key: 'tytul', label: "Tytuł",tmpl: Template.tytulLink},
                {
                    key: 'dataWprowadzenia',
                    label: "Data",
                    tmpl: Template.dataWpr
                },
            ],
            rowClass: function (item) {
                var tab = self.usersRV.get();
                if (_.contains(tab, item._id)) {
                    return 'myselfClass';
                }
            }
        };
    },
    PowiadomieniaList: function () {
        //console.log(this._id);
        return Powiadomienie.find({
            $where: function () {
                return (this.idUser==Meteor.userId());
            }
        }).fetch();
    },
    usersCount: function () {
        return Users.find().count() - 1;
    },
    myself: function (userId) {
        return Meteor.userId() === userId;
    }

});
Template.dataWpr.helpers({
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format("DD-MM-YYYY, HH:mm");
    }
});

