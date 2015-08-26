Template.header.created = function(){
    this.currentRouteNameRV = new ReactiveVar;
}

Template.header.rendered = function(){
    var self = Template.instance();
    this.autorun(function(){
        var routeName = Router.current().route.getName();
        self.currentRouteNameRV.set(routeName);
        self.subscribe("pagesInfoByLang",self.currentRouteNameRV.get());
    });
}

Template.header.helpers({
    'activeRouteClass': function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.getName() === name
        });

        return active && 'active';
    },
    'isAdminUser': function() {
        return IsAdminUser();
    },
    isAdmin: function () {
        if(Meteor.user()){
            if (Meteor.user().roles) {
                if (Meteor.user().roles == "admin")
                    return true;
                else
                    return false;
            }
            else return false;
        }
    },
    hasUserAccess:function(){
        //if(IsAdminUser()==true)
        //    return true;
        //else {
        //    var users = Users.find({
        //        $where: function () {
        //            return (this.roles == 'user');
        //        }
        //    });
        //    if (users.count() > 4)
        //        return true;
        //    else return false;
        //}
        return true;
    },
    lessThanFiveUsers:function(){
        var users=Users.find();
        if(users){
            return users.count()<5 ? true: false;
        }
        return null;
    }
});

Template.language.events({
    'click .lang':function(e){
        var lang = e.target.textContent;
        if(lang){
            var newUser = {
                profile:{
                    language:lang
                }
            };

            Meteor.call('updateUserLanguage',Meteor.userId(), newUser, function (error) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                } else{
                    TAPi18n.setLanguage(lang)
                        .done(function () {
                            console.log("Załadowano język");
                        })
                        .fail(function (error_message) {
                            console.log(error_message);
                        });
                }
            });
        }
    },
    'click #showPageInfo':function(){

        var defaultLang = LANGUAGES.DEFAULT_LANGUAGE;
        var lang = Meteor.user().profile.language ? Meteor.user().profile.language : defaultLang;
        var routeName = Router.current().route.getName();
        var item = PagesInfo.findOne({shortLanguageName:lang,routeName:routeName});
        var title = TAPi18n.__("pageInfo."+lang+"."+routeName)
        bootbox.dialog({
                message: item.infoText ? item.infoText : "Brak opisu",
                title: title
            });
    },
    'click #organizationName':function(){
        Router.go("home");
    }
});

Template.language.helpers({
    'getUserLang':function(){
        if(Meteor.user()){
            if(Meteor.user().profile.language){
                return Meteor.user().profile.language;
            }
        }
    },
    'langs':function(){
        var langs = Languages.find({isEnabled:true,czyAktywny:true});
        if(langs){
            return langs;
        }
    },
    nazwaOrg: function(){
        var param = Parametr.findOne({});
        if(param) {
            var nazwa = param.nazwaOrganizacji;
            if (nazwa) {
                return nazwa;
            }
            else {
                return "AD";
            }
        }
    }
})