Meteor.startup(function(){
    var systemParameters = [
        {
            "systemPrefix": Math.random().toString(36).substring(2,7)
        }
    ];
    if (System.find().count() == 0) {
        Meteor.call('addSystemParameters', systemParameters, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
        });
    }
});