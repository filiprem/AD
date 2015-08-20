Router.map(function () {
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
                this.subscribe("kwestie")
            ]
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            } else {
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
            }
            else this.next();
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
            }
            else this.next();
        },
        waitOn: function () {
            this.subscribe("kwestieUser", Meteor.userId());
        }
    });

    this.route('glosowanie', {
        path: '/vote',
        template: 'glosowanie',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();
        }
    });

    this.route('realizacja', {
        path: '/realization',
        template: 'realizacja',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();
        }
    });

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
});