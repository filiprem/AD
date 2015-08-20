Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
    waitOn: function () {
        return [
            Meteor.subscribe('parametr'),
            Meteor.subscribe("languages"),
            //TO DO czy ponizsze subskrypcje sa potrzebne?
            Meteor.subscribe('raport'),
            Meteor.subscribe('kwestiaTresc')
        ];
    },
    onAfterAction: function () {
        var item = Parametr.findOne({});
        if (!!item && !!item.nazwaOrganizacji)
            document.title = item.nazwaOrganizacji;
        else
            document.title = Router.current().route.getName();
    }
});

Router.map(function () {
    this.route('home', {
        path: '/',
        waitOn: function () {
            return [
                this.subscribe("kwestie"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje")
            ]
        },
        onBeforeAction: function () {
            if (Meteor.user()) {
                if (IsAdminUser())
                    Router.go('admin')
                else
                    this.render('listKwestia')
            }
            else Router.go('login_form')

        }
    });
    this.route('admin', {
        path: '/admin',
        template: 'adminTemplate',
        data: function () {
            return Users.find()
        },
        onBeforeAction: function () {
            if (IsAdminUser())
                this.next();
            else
                Router.go('home');
        }
    });
    this.route('login_form', {
        path: '/account/login',
        template: 'loginForm',
        onBeforeAction: function () {
            if (Meteor.userId() != null)
                Router.go('home');
            else
                this.next();
        }
    });
});

var requireLogin = function () {
    if (!Meteor.user()) {
        if (Meteor.loggingIn())
            this.render(this.loadingTemplate);
        else
            this.render('accessDenied');
    }
    else this.next();
}
Router.onBeforeAction(requireLogin, {only: 'addUserForm'});