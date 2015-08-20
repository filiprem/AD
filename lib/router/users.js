Router.map(function () {
    this.route('profile_edit', {
        path: '/account/edit',
        template: 'profileEdit',
        data: function () {
            return Users.findOne({_id: Meteor.userId()});
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();

        }
    });
    this.route('manage_account', {
        path: '/account/manage',
        template: 'manageAccount',
        data: function () {
            return Users.findOne({_id: Meteor.userId()});
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();
        }
    });
    this.route('listUsers', {
        path: '/users_list',
        template: 'listUsers',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        }
    });
    this.route('addUser', {
        path: '/add_user',
        template: 'addUserForm',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        }
    });
    this.route('editUser', {
        path: '/edit_user/:_id',
        template: 'editUserForm',
        data: function () {
            return Users.findOne(this.params._id)
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        }
    });
    this.route('profile_list', {
        path: '/profile_list',
        template: 'profileList',
        waitOn: function () {
            return [this.subscribe("users")];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();

        }
    });

    this.route('profileInfo', {
        path: '/profile_info/:username',
        template: 'profileInfo',
        data: function () {
            return Users.findOne({username: this.params.username});
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();

        },
        waitOn: function () {
            this.subscribe("users");
        }
    });
});