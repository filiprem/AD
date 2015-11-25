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
                this.subscribe("usersRoles"),
                this.subscribe("usersDraft"),
                this.subscribe("zespolyRealizacyjne"),
                this.subscribe("notificationsNotRead",Meteor.userId())
            ]
        },
        onBeforeAction: function () {
            if (Meteor.user()) {
                if (IsAdminUser()) {
                    Router.go('admin');
                }
                else {
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
    this.route('activate_account', {
        path: '/account/activate_account/:linkAktywacyjny',
        template: 'activateAccount',
        onBeforeAction: function () {
            this.next();
        },
        waitOn: function () {
            this.subscribe("usersDraft");
            this.subscribe("users");
        }
    });
    this.route('answer_invitation', {
        path: '/account/answer_invitation/:linkAktywacyjny',
        template: 'answerInvitation',
        onBeforeAction: function () {
            this.next();
        },
        waitOn: function () {
            //var userDraft=UsersDraft.findOne({linkAktywacyjny:this.params.link});
            //udostenij tylko konkretna kwestie i userDraft-to do
            this.subscribe("usersDraft");
            this.subscribe("users");
            this.subscribe("kwestie");
            this.subscribe("parametr");
            this.subscribe("zespolyRealizacyjneDraft"),
            this.subscribe("zespolyRealizacyjne"),
            this.subscribe("notificationsNotRead",Meteor.userId())
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
        },
        waitOn: function () {
            this.subscribe("usersRoles");
            this.subscribe("usersType");
            //this.subscribe("users");
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
        waitOn: function () {
            this.subscribe("languages");
            this.subscribe("usersEmails");
            this.subscribe("zespolyRealizacyjne");
            this.subscribe("usersUsernames");
            this.subscribe("usersType")
        }
    });

    this.route('doradca_form', {
        path: '/doradca_form',
        template: 'doradcaForm',
        onBeforeAction: function () {
            if (Meteor.userId() == null)
                Router.go('home');
            else
                this.next();
        },
        waitOn: function () {
            return [
                this.subscribe("usersRoles"),
                this.subscribe("tematy"),//oba potrzebne do uzupelnienia id tematu i rodzaju przy tworzeniu kwestii osobowej
                this.subscribe("rodzaje"),
                this.subscribe("usersDraftEmails"),//oba potrzebne do walidacji emaili
                this.subscribe("usersDraft"),
                this.subscribe("users"),
                this.subscribe("parametr"),
                this.subscribe("zespolyRealizacyjne"),
                this.subscribe("zespolyRealizacyjneDraft"),
                this.subscribe("kwestie")
            ]
        }
    });

    this.route('czlonek_zwyczajny_form', {
        path: '/czlonek_zwyczajny_form/',
        template: 'czlonekZwyczajnyForm',
        data:function(){
            return Users.findOne({_id:Meteor.userId()});
        },
        onBeforeAction: function () {
            this.next();
        },
        waitOn: function () {
            this.subscribe("usersRoles"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersDraftEmails"),
                this.subscribe("usersEmails"),
                this.subscribe("usersType"),
                this.subscribe("usersDraft"),
                this.subscribe("parametr"),
                this.subscribe("zespolyRealizacyjne"),
                this.subscribe("zespolyRealizacyjneDraft"),
                this.subscribe("kwestie"),
                this.subscribe("notificationsNotRead",Meteor.userId())
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
        waitOn: function () {
            this.subscribe("usersRoles");
            this.subscribe("notificationsNotRead",Meteor.userId())
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
        waitOn: function () {
            this.subscribe("usersRoles");
            this.subscribe("usersDraft");
            this.subscribe("usersType");
            this.subscribe("kwestie");
            this.subscribe("notificationsNotRead",Meteor.userId())
        }
    });
    //---------------------------------------------------

    //--------------------------------------------------
    //admin - RAPORT

    //this.route('listRaport', {
    //    path: '/reports_list',
    //    template: 'listRaport',
    //    onBeforeAction: function () {
    //        if (!Meteor.user()) {
    //            this.render('accessDenied');
    //            this.stop();
    //            Router.go('/account/login');
    //        }
    //        else if (IsAdminUser())
    //            this.render('accessDenied');
    //        else
    //            this.next();
    //    },
    //    waitOn: function () {
    //        this.subscribe("usersRoles");
    //        this.subscribe("notificationsNotRead",Meteor.userId())
    //    }
    //});
    //this.route('addRaport', {
    //    path: '/add_report',
    //    template: 'addRaportForm',
    //    onBeforeAction: function () {
    //        if (!Meteor.userId()) {
    //            this.render('accessDenied');
    //            this.stop();
    //            Router.go('/account/login');
    //        }
    //        else if (IsAdminUser())
    //            this.next();
    //        else
    //            this.render('accessDenied');
    //    },
    //    waitOn: function () {
    //        this.subscribe("usersRoles");
    //        this.subscribe("notificationsNotRead",Meteor.userId())
    //    }
    //});

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
                this.render('accessDenied');
            else
                this.next();
        },
        waitOn: function () {
            return [
                this.subscribe("tematy"),
                this.subscribe("rodzaj"),
                this.subscribe("usersType")
            ]
        }
    });
    //---------------------------------------------------

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
            return [
                Meteor.subscribe('users'),
                this.subscribe("kwestie"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersDraft"),
                this.subscribe("zespolyRealizacyjneDraft"),
                this.subscribe("notificationsNotRead",Meteor.userId())
            ];
        },
        onBeforeAction: function () {
            this.subscribe("kwestia");
            this.next();
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
                this.subscribe("usersRoles"),
                this.subscribe("usersType"),
                this.subscribe("notificationsNotRead",Meteor.userId())
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
            return Session.get("actualKwestia");
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
                this.subscribe("usersRoles"),
                this.subscribe("usersType"),
                this.subscribe("zespolRealizacyjny",Session.get("actualKwestia").idZespolRealizacyjny),
                this.subscribe("notificationsNotRead",Meteor.userId())
            ]
        }
    });

    this.route('previewKwestiaOpcja', {
        path: '/issue_option_preview',
        template: 'previewKwestiaOpcja',
        data: function () {
            return Session.get("actualKwestia");
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
        waitOn:function(){
            return [
                this.subscribe("zespolRealizacyjny",Session.get("actualKwestia").idZespolRealizacyjny),
                this.subscribe("usersType"),
                this.subscribe("notificationsNotRead",Meteor.userId())
            ]
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
        },
        waitOn:function(){
            return [
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersType"),
                this.subscribe("notificationsNotRead",Meteor.userId()),
                this.subscribe("kwestie")//potrzebne tak naprwde tylko id!,nazwy!
            ]
        }
    });

    this.route('informacjeKwestia', {
        path: '/issue_info/:_id',
        template: 'informacjeKwestia',
        data: function () {
            Session.set("idKwestia", this.params._id);
            return Kwestia.findOne(this.params._id);
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
                this.subscribe("parametrDraft"),
                this.subscribe("usersDraft"),
                this.subscribe("zespolyRealizacyjne"),
                this.subscribe("zespolyRealizacyjneDraft"),
                this.subscribe("notificationsNotReadIssue",Meteor.userId())
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

    //-----------------------------------------
    // Archiwum
    this.route('archiwum', {
        path: '/archives',
        template: 'archiwum',
        waitOn: function () {
            return [
                this.subscribe("kwestieArchiwum"),
                //this.subscribe("kwestieActivity",false),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersRoles"),
                this.subscribe("usersDraft"),
                this.subscribe("usersType"),
                this.subscribe("notificationsNotRead",Meteor.userId())
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
        waitOn: function () {
            return [
                this.subscribe("kwestia", this.params._id),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("postsByKwestiaId", this.params._id),
                this.subscribe("notificationsNotRead",Meteor.userId())
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
            this.subscribe("kwestieArrayStatus",[KWESTIA_STATUS.REALIZOWANA,KWESTIA_STATUS.ZREALIZOWANA]);
            this.subscribe("rodzaje");
            this.subscribe("tematy");
            this.subscribe("usersRoles");
            this.subscribe("usersDraft");
            this.subscribe("usersType"),
            this.subscribe("notificationsNotRead",Meteor.userId())
        }
    });
    this.route('realizacjaDruk', {
        path: '/realizationDruk',
        template: 'realizacjaDruk',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();
        },
        waitOn:function(){
            this.subscribe("kwestieRealizacja");
            this.subscribe("rodzaje");
            this.subscribe("tematy");
            this.subscribe("usersRoles");
            this.subscribe("usersDraft");
        }
    });

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
            else
                this.next();
        },
        waitOn:function(){
            this.subscribe("usersRoles");
            this.subscribe("usersDraft");
            this.subscribe("kwestieGlosowane");
            this.subscribe("tematy");
            this.subscribe("rodzaje");
            this.subscribe("usersType");
            this.subscribe("notificationsNotRead",Meteor.userId())
        }
    });

    this.route('sendMessage', {
        path: '/new_message/:_id',
        template: 'sendMessage',
        data: function () {
            return Users.findOne({_id: this.params._id});
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
            this.subscribe("user",this.params._id);
            this.subscribe("usersType");
            this.subscribe("notificationsNotRead",Meteor.userId());
        }
    });


    this.route('administracjaUserMain', {
        path: '/settings/',
        template: 'administracjaUserMain',
        data:function(){
            return Parametr.findOne();
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('home');
            }
            else this.next();
        },
        waitOn: function () {
            this.subscribe("kwestie");
            //this.subscribe("kwestieUser", Meteor.userId());
            this.subscribe("users");
            this.subscribe("usersDraft");
            this.subscribe("parametr");
            this.subscribe("kwestie");
            this.subscribe("zespolyRealizacyjne");
            this.subscribe("zespolyRealizacyjneDraft");
            this.subscribe("notificationsNotRead",Meteor.userId());

            this.subscribe("tematy");
            this.subscribe("rodzaje");

             this.subscribe("parametr");
        }
    });

    this.route('notification_list', {
        path: '/notification_list',
        template: 'notificationList',
        waitOn: function () {
            return [
                //this.subscribe("powiadomienia"),
                this.subscribe("myNotifications",Meteor.userId()),
                this.subscribe("users"),
                this.subscribe("usersDraft"),
                //this.subscribe("issuesInNotifications",Meteor.userId()),
                this.subscribe("kwestie")
            ];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('home');
            }
            else this.next();
        }
    });
    this.route('notificationInfo', {
        path: '/notification_info/:_id',
        template: 'notificationInfo',
        data:function(){
            return Powiadomienie.findOne({_id:this.params._id});
        },
        waitOn: function () {
            return [
                this.subscribe("myNotifications",Meteor.userId()),
                this.subscribe("users"),//tu potrzebuje tylko imie i nazwisko!
                this.subscribe("usersDraft"),
                //this.subscribe("issueInNotification",Powiadomienie.findOne({_id:this.params._id})),
                this.subscribe("kwestie"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("parametr")
            ];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('home');
            }
            else
                this.next();
        }
    });
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