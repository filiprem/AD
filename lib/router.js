Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
    waitOn: function () {
        return [
            Meteor.subscribe('parametr'),
            Meteor.subscribe('raport'),
            
            Meteor.subscribe('kwestiaTresc'),
            Meteor.subscribe('glosujacy')
        ];
    },
    onAfterAction: function(){
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
                if (IsAdminUser()) {
                    Router.go('admin')
                } else {
                    //this.render('dashBoard');
                    this.render('listKwestia')
                }
            } else {
                Router.go('login_form')
            }
        }
    });
    this.route('admin', {
        path: '/admin',
        template: 'adminTemplate',
        data: function () {
            return Users.find()
        },
        onBeforeAction: function () {
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
        onBeforeAction: function () {
            if (Meteor.userId() != null) {
                Router.go('home');
            }
            this.next();
        }
    });
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
            } else {
                this.next();
            }
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
            } else {
                this.next();
            }
        }
    });
    //---------------------------------------------------
    //admin - RODZAJ
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
                // przerzuca do formularza logowania !!!!!!
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });
    this.route('addRodzaj', {
        path: '/add_type',
        template: 'addRodzajForm',
        waitOn: function () {
            return [
                this.subscribe("tematy")
            ]
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
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
                this.subscribe("tematy")
            ]
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                
                this.next();
            }
        }
    });

    //--------------------------------------------------
    //admin - RAPORT

    this.route('listRaport', {
        path: '/reports_list',
        template: 'listRaport',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });
    this.route('addRaport', {
        path: '/add_report',
        template: 'addRaportForm',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });

    //---------------------------------------------------
    //admin - USERS
    this.route('listUsers', {
        path: '/users_list',
        template: 'listUsers',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
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
            } else {
                this.next();
            }
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
            } else {
                this.next();
            }
        }
    });
    //---------------------------------------------------
    //admin - PARAMETR
    this.route('listParametr', {
        path: '/parameters_list',
        template: 'listParametr',
        data: function () {
            return Parametr.find()
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });
    this.route('addParametr', {
        path: '/add_parameter',
        template: 'addParametrForm',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });
    //---------------------------------------------------
    //admin - TEMAT
    this.route('listTemat', {
        path: '/topics_list',
        template: 'listTemat',
        //data: function() { return Temat.find() },
        waitOn: function () {
            return [
                this.subscribe("tematy")
            ]
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
               
                this.next();
            }
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
            } else {
                this.next();
            }
        }
    });
    this.route('editTemat', {
        path: '/edit_topic/:_id',
        template: 'editTematForm',
        data: function () {
            return Temat.findOne(this.params._id)
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });

    // KWESTIA ADMIN
    this.route('listKwestiaAdmin', {
        path: '/admin_issues_list',
        template: 'listKwestiaAdmin',
        //data: function() { return Kwestia.find() },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });

    this.route('listaKwestiiOczekujacych', {
        path: '/pending_issues_list',
        template: 'listaKwestiiOczekujacych',
        waitOn: function () {
            var status = KWESTIA_STATUS.KATEGORYZOWANA;
            return [
                this.subscribe("kwestieOczekujace", status)
            ]
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else {
                this.next();
            }
        }
    });

    this.route('kwestiaOczekujaca', {
        path: '/pending_issue/:_id',
        template: 'kwestiaOczekujaca',
        data: function () {
            return Kwestia.findOne({_id: this.params._id})
        },
        waitOn: function () {
            return [
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("kwestia", this.params._id)
            ]
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else {
               
                this.next();
            }
        }
    });
    //-----------------------------------------

    //admin - LANGUAGES
    this.route('listLanguages', {
        path: '/list_languages',
        template: 'listLanguages',
        waitOn:function(){
            return [this.subscribe("languages")];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
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
            } else {
                this.next();
            }
        }
    });

    this.route('editLanguage', {
        path: '/edit_language/:_id',
        template: 'editLanguage',
        waitOn:function(){
            return [this.subscribe("language",this.params._id)]
        },
        data:function(){
            return Languages.findOne({_id:this.params._id})
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });
    //---------------------------------------------------

    // KWESTIA dashboard
    this.route('listKwestia', {
        path: '/issues_list',
        template: 'listKwestia',
        waitOn: function () {
            return [
                Meteor.subscribe('users'),
                this.subscribe("kwestie"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
            ];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.subscribe("kwestia");
                this.next();
            }
        }
    });

    this.route('addKwestia', {
        path: '/add_issue',
        template: 'addKwestiaForm',
        data: function () {
            return !!Session.get("kwestiaPreview") ? Session.get("kwestiaPreview") : null;
        },
        waitOn: function () {
            return [
                this.subscribe("rodzaje"),
                this.subscribe("tematy"),
                this.subscribe("kwestieNazwa")
            ];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });

    this.route('addKwestiaOpcja', {
        path: '/add_issue_option',
        template: 'addKwestiaOpcjaForm',
        data: function () {
            return Session.get("actualKwestiaId");
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        },
        waitOn:function(){
            return[
                this.subscribe("kwestieInfo"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje")
            ]
        }
    });

    this.route('editKwestia', {
        path: '/edit_issue/:_id',
        template: 'editKwestiaForm',
        data: function () {
            return Kwestia.findOne(this.params._id)
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });

    this.route('previewKwestiaOpcja', {
        path: '/issue_option_preview',
        template: 'previewKwestiaOpcja',
        data: function () {
            return Session.get("kwestiaPreviewOpcja");
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });


    this.route('previewKwestia', {
        path: '/issue_preview',
        template: 'previewKwestia',
        data: function () {
            return Session.get("kwestiaPreview");
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        }
    });

    this.route('informacjeKwestia', {
        path: '/issue_info/:_id',
        template: 'informacjeKwestia',
        data: function () {
            Session.set("idKwestia", this.params._id);

            Session.set("actualKwestiaId",Kwestia.findOne({_id:this.params._id}));
            return Kwestia.findOne(this.params._id)
        },
        waitOn: function () {
            return [
                this.subscribe("users"),//potrzebne tutaj user id gdy chce zupedtowac usera,-dodac mu ranking,gdy jego wkesti ktos nada� priorytet!
                this.subscribe("kwestia", this.params._id),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("postsByKwestiaId", this.params._id),
                this.subscribe("parametr"),
                this.subscribe('kwestieOpcje', this.params._id)
            ]
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else {
                this.subscribe("postsByKwestiaId", this.params._id);
                this.next();
            }
        }
    });

    this.route('dyskusjaKwestia', {
        path: '/issue_discussion/:_id',
        template: 'discussionMain',
        data: function () {
            return Kwestia.findOne(this.params._id)
        },
        waitOn: function () {
            return [
                this.subscribe("kwestie"),
                this.subscribe("postsByKwestiaId", this.params._id)
            ]
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.subscribe("kwestia");
                this.subscribe("postsByKwestiaId", this.params._id);
                this.next();
            }
        }
    });


    //-----------------------------------------
    // Archiwum
    this.route('archiwum', {
        path: '/archives',
        template: 'archiwum',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else {
                this.next();
            }
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
            else {
                this.next();
            }
        }
    });
    //-------------------------------------------------------------

    //-------- REALIZACJA --------
    this.route('realizacja', {
        path: '/realization',
        template: 'realizacja',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else {
                this.next();
            }
        }
    });
    //----------------------------

    //-------- GLOSOWANIE --------
    this.route('glosowanie', {
        path: '/vote',
        template: 'glosowanie',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else {
                this.next();
            }
        }
    });
    //----------------------------

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
            } else {
                this.next();
            }
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
            else {
                this.next();
            }
        },
        waitOn:function(){
            this.subscribe("users");
        }
    });

    this.route('administracjaUserMain', {
        path: '/user_administration/',
        template: 'administracjaUserMain',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
                this.next();
            }
        },
        waitOn:function(){
            this.subscribe("kwestieUser",Meteor.userId());
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
var requireLogin = function () {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        }
        else {
            this.render('accessDenied');
        }
    }
    else {
        this.next();
    }
}
Router.onBeforeAction(requireLogin, {only: 'addUserForm'});