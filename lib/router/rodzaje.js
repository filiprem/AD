Router.map(function () {
    this.route('listRodzaj', {
        path: '/types_list',
        template: 'listRodzaj',
        //data: function() { return Rodzaj.find() },
        waitOn: function () {
            return [
                this.subscribe("rodzaje"),
                this.subscribe("tematy")
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
    this.route('addRodzaj', {
        path: '/add_type/:_id',
        template: 'addRodzajForm',
        waitOn: function () {
            return [
                this.subscribe("temat", this.params._id)
            ]
        },
        data: function () {
            return Temat.findOne({_id: this.params._id});
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
    this.route('editRodzaj', {
        path: '/edit_type/:_id',
        template: 'editRodzajForm',
        data: function () {
            return Rodzaj.findOne(this.params._id)
        },
        waitOn: function () {
            return [
                this.subscribe("tematy"),
                this.subscribe("rodzaj", this.params._id)
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
});