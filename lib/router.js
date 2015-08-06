Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
    waitOn: function() {
        return [
                    Meteor.subscribe('rodzaj'),
                    Meteor.subscribe('parametr'),
                    Meteor.subscribe('temat'),
                    Meteor.subscribe('kwestia'),
                    Meteor.subscribe('raport'),
                    Meteor.subscribe('kwestiaTresc'),
                    Meteor.subscribe('glosujacy'),
                    Meteor.subscribe('kwestiaDraft')
               ];
    }
});

Router.map(function() {
    this.route('home', {
        path: '/',
        onBeforeAction: function() {
            if (Meteor.user()) {
                if (IsAdminUser()) {
                    Router.go('admin')
                } else {
                    //this.render('dashBoard');
                    this.render('listKwestia')
                }
            }else
            {
                Router.go('login_form')
            }
        }
    });
    this.route('admin', {
        path:'/admin',
        template: 'adminTemplate',
        data: function() { return Users.find() },
        onBeforeAction: function() {
            if (IsAdminUser()) {
                this.next();
            } else {
                Router.go('home');
            }
        }
    });
    //---------------------------------------------------
    // user - ACCOUNT
    this.route('login_form', {
        path: '/account/login',
        template: 'loginForm',
        onBeforeAction: function() {
            if (Meteor.userId() != null) {
                Router.go('home');
            }
            this.next();
        }
    });
    this.route('profile_edit', {
        path: '/account/edit',
        template: 'profileEdit',
        data: function() { return Users.findOne({_id: Meteor.userId()}); },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
            }else
            {
                this.next();
            }
        }
    });
    this.route('manage_account', {
        path: '/account/manage',
        template: 'manageAccount',
        data: function() { return Users.findOne({_id: Meteor.userId()}); },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
            }else
            {
                this.next();
            }
        }
    });
    //---------------------------------------------------
    //admin - RODZAJ
    this.route('listRodzaj', {
        path: '/list_rodzaj',
        template: 'listRodzaj',
        data: function() { return Rodzaj.find() },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                // przerzuca do formularza logowania !!!!!!
                Router.go('/account/login');
            }else
            {
                this.next();
            }
        }
    });
    this.route('addRodzaj', {
        path: '/add_rodzaj',
        template: 'addRodzajForm',
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
            }else
            {
                this.next();
            }
        }
    });
    this.route('editRodzaj', {
        path: '/edit_rodzaj/:_id',
        template: 'editRodzajForm',
        data: function(){ return Rodzaj.findOne(this.params._id)},
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }else
            {
                this.next();
            }
        }
    });

    //--------------------------------------------------
    //admin - RAPORT

    this.route('listRaport', {
        path: '/list_raport',
        template: 'listRaport',
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }else
            {
                this.next();
            }
        }
    });
    this.route('addRaport', {
        path: '/add_raport',
        template: 'addRaportForm',
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
            }else
            {
                this.next();
            }
        }
    });

    //---------------------------------------------------
    //admin - USERS
    this.route('listUsers', {
        path: '/list_users',
        template: 'listUsers',
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }else
            {
                this.next();
            }
        }
    });
    this.route('addUser', {
        path: '/add_user',
        template: 'addUserForm',
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
            }else
            {
                this.next();
            }
        }
    });
    this.route('editUser', {
        path: '/edit_user/:_id',
        template: 'editUserForm',
        data: function(){ return Users.findOne(this.params._id)},
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
            }else
            {
                this.next();
            }
        }
    });
    //---------------------------------------------------
    //admin - PARAMETR
    this.route('listParametr', {
        path: '/list_parametr',
        template: 'listParametr',
        data: function() { return Parametr.find() },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }else
            {
                this.next();
            }
        }
    });
    this.route('addParametr', {
        path: '/add_parametr',
        template: 'addParametrForm',
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
            }else
            {
                this.next();
            }
        }
    });
    //---------------------------------------------------
    //admin - TEMAT
    this.route('listTemat', {
        path: '/list_temat',
        template: 'listTemat',
        data: function() { return Temat.find() },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }else
            {
                this.next();
            }
        }
    });
    this.route('addTemat', {
        path: '/add_temat',
        template: 'addTematForm',
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
            }else
            {
                this.next();
            }
        }
    });
    this.route('editTemat', {
        path: '/edit_temat/:_id',
        template: 'editTematForm',
        data: function(){ return Temat.findOne(this.params._id)},
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }else
            {
                this.next();
            }
        }
    });

    // KWESTIA ADMIN
    this.route('listKwestiaAdmin', {
        path: '/list_kwestia_admin',
        template: 'listKwestiaAdmin',
        data: function() { return Kwestia.find() },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else
            {
                this.next();
            }
        }
    });

    //-----------------------------------------
    // KWESTIA dashboard
    this.route('listKwestia', {
        path: '/list_kwestia',
        template: 'listKwestia',
        waitOn: function() {
            return [
                Meteor.subscribe('users')
            ];
        },
        data: function() { return Kwestia.find() },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else
            {
                this.next();
            }
        }
    });

    this.route('addKwestia', {
        path: '/add_kwestia',
        template: 'addKwestiaForm',
        data: function(){ return !!Session.get("kwestiaPreview") ? Session.get("kwestiaPreview") : null;},
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
            }else
            {
                this.next();
            }
        }
    });

    this.route('editKwestia', {
        path: '/edit_kwestia/:_id',
        template: 'editKwestiaForm',
        data: function(){ return Kwestia.findOne(this.params._id)},
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }else
            {
                this.next();
            }
        }
    });

    this.route('previewKwestia', {
        path: '/preview_kwestia',
        template: 'previewKwestia',
        data: function(){ return Session.get("kwestiaPreview");},
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }else
            {
                this.next();
            }
        }
    });

    this.route('proceduraWstrzymania', {
        path: '/procedura_wstrzymania/:_id',
        template: 'proceduraWstrzymania',
        data: function() {
            return KwestiaSuspended.findOne({_id:this.params._id}) ;
        },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.subscribe("kwestiaSuspended",this.params._id);
                this.subscribe('kwestiaSuspendedPosts',this.params._id);
                this.subscribe('allUserData');
                this.next();
            }
        }
    });

    this.route('informacjeKwestia', {
        path: '/info_kwestia/:_id',
        template: 'informacjeKwestia',
        data: function() { return Kwestia.findOne(this.params._id) },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else {
                this.subscribe("kwestiaSuspendedBykwestiaId",this.params._id);
                this.next();
            }
        }
    });


    //-----------------------------------------
    // Archiwum
    this.route('archiwum', {
        path: '/archiwum',
        template: 'archiwum',
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else
            {
                this.next();
            }
        }
    });

    this.route('informacjeKwestiaArchiwum', {
        path: '/info_kwestia_archiwum/:_id',
        template: 'informacjeKwestiaArchiwum',
        data: function() { return Kwestia.findOne(this.params._id) },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else
            {
                this.next();
            }
        }
    });

    this.route('proceduraPrzywracania', {
        path: '/przywroc_kwestia_archiwum/:_id',
        template: 'proceduraPrzywracania',
        data: function() { return Kwestia.findOne(this.params._id) },
        onBeforeAction: function() {
            if (! Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else
            {
                this.next();
            }
        }
    });

    //this.route('*', {
    //    onBeforeAction: function () {
    //        if (Meteor.userId()) {
    //            Router.go('login_form');
    //        }
    //        else
    //        {
    //            this.render('accessDenied');
    //        }
    //    }
    //});

});
//---------------------------------------------------
var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn())
        {
            this.render(this.loadingTemplate);
        }
        else
        {
            this.render('accessDenied');
        }
    }
    else
    {
        this.next();
    }
}
Router.onBeforeAction(requireLogin, {only: 'addUserForm'});