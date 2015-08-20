Router.map(function () {
    this.route('archiwum', {
        path: '/archives',
        template: 'archiwum',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();

        }
    });

    this.route('informacjeKwestiaArchiwum', {
        path: '/archive_issue_info/:_id',
        template: 'informacjeKwestiaArchiwum',
        data: function () {
            return Kwestia.findOne(this.params._id)
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
});
