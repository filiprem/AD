generateLogin = function (u_firstName, u_lastName) {
    var i = 1;
    do {
        if (i <= u_firstName.length) {
            var userName = replacePolishChars(u_firstName.slice(0, i).toLowerCase() + u_lastName.toLowerCase());
        } else {
            var userName = replacePolishChars(u_firstName.slice(0, 1).toLowerCase() + u_lastName.toLowerCase() + (i - u_firstName.length));
        }
        var userExists = Users.findOne({username: userName});
        i++;
    }
    while (userExists != null);
    return userName;
};

IsAdminUser = function () {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
};

getUserRadkingValue = function (idUser) {
    var user = Users.findOne({_id: idUser});
    if (user) {
        return Number(user.profile.rADking)
    }
};

getAllUsersWhoVoted = function (idKWestia) {
    var kwestia = Kwestia.findOne({_id: idKWestia});
    if (kwestia) {
        var tab = kwestia.glosujacy;
        if (tab) {
            var tabNew = [];
            for (var j = 0; j < tab.length; j++) {
                tabNew.push(tab[j].idUser);
            }
            return tabNew;
        }
    }
};

setRoles = function () {
    var roles = document.getElementById('role');
    if (roles) {
        Roles.getAllRoles().forEach(function (role) {
            var option = document.createElement("option");
            option.text = role.name;
            roles.add(option, null);
        });
    }
};

getEmail = function (_this) {
    if (_this.emails && _this.emails.length)
        return _this.emails[0].address;

    if (_this.services) {
        //Iterate through services
        for (var serviceName in _this.services) {
            var serviceObject = _this.services[serviceName];
            //If an 'id' isset then assume valid service
            if (serviceObject.id) {
                if (serviceObject.email) {
                    return serviceObject.email;
                }
            }
        }
    }
    return "";
};