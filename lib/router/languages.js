Router.map(function () {
    this.route('listLanguages', {
        path: '/list_languages',
        template: 'listLanguages',
        waitOn: function () {
            return [this.subscribe("languages")];
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

    this.route('addLanguage', {
        path: '/add_language',
        template: 'addLanguage',
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

    this.route('editLanguage', {
        path: '/edit_language/:_id',
        template: 'editLanguage',
        waitOn: function () {
            return [this.subscribe("language", this.params._id)]
        },
        data: function () {
            return Languages.findOne({_id: this.params._id})
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

    this.route('setPagesInfo', {
        path: '/set_pages_info/:_id',
        template: 'setPagesInfo',
        waitOn: function () {
            return [
                this.subscribe("language", this.params._id),
                this.subscribe("pagesInfo")
            ]
        },
        data: function () {
            return Languages.findOne({_id: this.params._id})
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