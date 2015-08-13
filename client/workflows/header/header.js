Template.header.helpers({
    activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.getName() === name
        });

        return active && 'active';
    },
    isAdminUser: function() {
        return IsAdminUser();
    }
});

Template.language.events({
    'click .lang':function(e){
        var lang = e.target.textContent;

        var newUser = {
            profile:{
                language:lang
            }
        };

        Meteor.call('updateUserLanguage',Meteor.userId(), lang, function (error) {
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
});

Template.language.helpers({
    'getUserLang':function(){
        return Meteor.user().profile.language;
    }
})