Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
    waitOn: function () {
        return [
            Meteor.subscribe('parametr'),
            Meteor.subscribe("languages"),
            //TO DO czy ponizsze subskrypcje sa potrzebne?
            Meteor.subscribe('raport')
        ];
    },
    onAfterAction: function(){
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
                Meteor.subscribe('users'),
                this.subscribe("kwestie"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersRoles")
            ]
        },
        onBeforeAction: function () {
            if(Meteor.user()){
                if(IsAdminUser()){
                    Router.go('admin');
                }
                else{
                    this.render('listKwestia');
                }
            }
            this.render('listKwestia');
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
    //---------------------------------------------------
    // user - ACCOUNT
    this.route('login_form', {
        path: '/account/login',
        template: 'loginForm',
        onBeforeAction: function () {
            if (Meteor.userId() != null)
                Router.go('home');
            else
                this.next();
        },
        waitOn:function(){
            this.subscribe("usersRoles");
        }
    });
    this.route('register_form', {
        path: '/account/register',
        template: 'registerForm',
        onBeforeAction: function () {
            if (Meteor.userId() != null)
                Router.go('home');
            else
                this.next();
        },
        waitOn:function(){
            this.subscribe("usersEmails");
        }
    });

    this.route('doradca_form', {
        path: '/doradca_form',
        template: 'doradcaForm',
        onBeforeAction: function () {
            this.next();
        },
        waitOn:function(){
            return[
                this.subscribe("usersRoles"),
                this.subscribe("tematy"),//oba potrzebne do uzupelnienia id tematu i rodzaju przy tworzeniu kwestii osobowej
                this.subscribe("rodzaje"),
                this.subscribe("usersDraftEmails"),//oba potrzebne do walidacji emaili
                this.subscribe("usersEmails")
            ]
        }
    });

    this.route('czlonek_zwyczajny_form', {
        path: '/czlonek_zwyczajny_form',
        template: 'czlonekZwyczajnyForm',
        data:function(){
            console.log(Users.findOne({_id:Meteor.userId()}));
            return Users.findOne({_id:Meteor.userId()});
        },
        onBeforeAction: function () {
            this.next();
        },
        waitOn:function(){
            this.subscribe("usersRoles"),
            this.subscribe("tematy"),
            this.subscribe("rodzaje"),
            this.subscribe("usersDraftEmails"),
            this.subscribe("usersEmails")
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
            }
            else this.next();

        },
        waitOn:function(){
            this.subscribe("usersRoles");
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
        },
        waitOn:function(){
            this.subscribe("usersRoles");
            this.subscribe("usersDraft");
            this.subscribe("kwestie");
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
                this.subscribe("temat",this.params._id)
            ]
        },
        data:function(){
            return Temat.findOne({_id:this.params._id});
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
                this.subscribe("rodzaj",this.params._id)
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
            }
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        },
        waitOn:function(){
            this.subscribe("usersRoles");
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
            }
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        },
        waitOn:function(){
            this.subscribe("usersRoles");
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
    //---------------------------------------------------

    this.route('listParametr', {
        path: '/parameters',
        template: 'listParametr',
        data: function () {
            return Parametr.findOne({})
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
    this.route('editParametry', {
        path: '/edit_parameters/:_id',
        template: 'editParametry',
        data: function () {
            return Parametr.findOne(this.params._id)
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
    this.route('previewParametr', {
        path: '/preview_parameters',
        template: 'previewParametr',
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
    //---------------------------------------------------
    //admin - TEMAT
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
        waitOn:function(){
            return [this.subscribe("temat",this.params._id)]
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

    // KWESTIA ADMIN
    this.route('listKwestiaAdmin', {
        path: '/admin_issues_list',
        template: 'listKwestiaAdmin',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();
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
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
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
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        }
    });
    //-----------------------------------------

    //admin - LANGUAGES
    this.route('listLanguages', {
        path: '/languages_list',
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
    //---------------------------------------------------

    // KWESTIA dashboard
    this.route('listKwestia', {
        path: '/issues_list',
        template: 'listKwestia',
        waitOn: function () {
            console.log(Meteor.userId());
            return [
                Meteor.subscribe('users'),
                this.subscribe("kwestie"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersDraft")
            ];
        },
        onBeforeAction: function () {
            //if (!Meteor.user()) {
            //    this.render('accessDenied');
            //    this.stop();
            //    Router.go('/account/login');
            //} else {
                this.subscribe("kwestia");
                this.next();
            //}
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
                this.subscribe("kwestieNazwa"),
                this.subscribe("usersRoles")
            ];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (!IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
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
            }
            else if (!IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        },
        waitOn: function () {
            return [
                this.subscribe("kwestieInfo"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersRoles")
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
            }
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
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
            }
            else if (!IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
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
            }
            else if (!IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        }
    });

    this.route('informacjeKwestia', {
        path: '/issue_info/:_id',
        template: 'informacjeKwestia',
        data: function () {
            Session.set("idKwestia", this.params._id);

            Session.set("actualKwestiaId", Kwestia.findOne({_id: this.params._id}));
            //return Session.get("kwestiaOsobowa")!=null ?  Kwestia.findOne({_id:Session.get("kwestiaOsobowa")})  : Kwestia.findOne(this.params._id)
            return Kwestia.findOne(this.params._id)
        },
        waitOn: function () {
            return [
                this.subscribe("users"),
                this.subscribe("kwestia", this.params._id),
                this.subscribe("kwestie"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("postsByKwestiaId", this.params._id),
                this.subscribe("parametr"),
                this.subscribe("usersDraft")
            ]
        },
        onBeforeAction: function () {
            //if (!Meteor.user()) {
            //    this.render('accessDenied');
            //    this.stop();
            //    Router.go('/account/login');
            //} else {
                this.subscribe("postsByKwestiaId", this.params._id);
                this.next();
           // }
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
            }
            else this.next();
        }
    });


    //-----------------------------------------
    // Archiwum
    this.route('archiwum', {
        path: '/archives',
        template: 'archiwum',
        waitOn:function(){
            return [
                this.subscribe("kwestieArchiwum"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersRoles"),
                this.subscribe("usersDraft")
            ];
        },
        onBeforeAction: function () {
            this.next();
        }
    });

    this.route('informacjeKwestiaArchiwum', {
        path: '/archive_issue_info/:_id',
        template: 'informacjeKwestiaArchiwum',
        data: function () {
            return Kwestia.findOne(this.params._id)
        },
        waitOn:function(){
            return [
                this.subscribe("kwestia",this.params._id),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("postsByKwestiaId", this.params._id)
            ]
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
    //-------------------------------------------------------------

    //-------- REALIZACJA --------
    this.route('realizacja', {
        path: '/realization',
        template: 'realizacja',
        onBeforeAction: function () {
            this.next();
        },
        waitOn:function(){
            this.subscribe("usersRoles");
            this.subscribe("usersDraft");
        }
    });
    //----------------------------

    //-------- GLOSOWANIE --------
    this.route('glosowanie', {
        path: '/vote',
        template: 'glosowanie',
        onBeforeAction: function () {
            this.next();
        },
        waitOn:function(){
            this.subscribe("usersRoles");
            this.subscribe("usersDraft")
        }
    });
    //----------------------------

    this.route('profile_list', {
        path: '/profile_list',
        template: 'profileList',
        waitOn: function () {
            return [
                this.subscribe("users"),
                this.subscribe("usersDraft")
            ];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                Router.go('home');
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

    this.route('administracjaUserMain', {
        path: '/user_administration/',
        template: 'administracjaUserMain',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('home');
            }
            else this.next();
        },
        waitOn: function () {
            this.subscribe("kwestieUser", Meteor.userId());
            this.subscribe("usersRoles"),
            this.subscribe("usersDraft")
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
        if (Meteor.loggingIn())
            this.render(this.loadingTemplate);
        else
            this.render('accessDenied');
    }
    else this.next();
}
Router.onBeforeAction(requireLogin, {only: 'addUserForm'});