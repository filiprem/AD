Router.map(function () {
    this.route('listTemat', {
        path: '/topics_list',
        template: 'listTemat',
        waitOn: function () {
            return [
                this.subscribe("tematy"),
                this.subscribe("rodzaje")
            ]
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
    this.route('addTemat', {
        path: '/add_topic',
        template: 'addTematForm',
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
    this.route('editTemat', {
        path: '/edit_topic/:_id',
        template: 'editTematForm',
        data: function () {
            return Temat.findOne(this.params._id)
        },
        waitOn: function () {
            return [this.subscribe("temat", this.params._id)]
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
});