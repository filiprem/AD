liczenieKworumZwykle = function (liczbaUzytkownikow) {
    var potega = 7 / 9;
    var liczba = 4 / 7;
    var kworum = Math.pow(liczbaUzytkownikow, potega) * liczba;
    return Math.round(kworum);
};

liczenieKworumStatutowe = function (liczbaUzytkownikow) {
    var kworum = liczbaUzytkownikow / 3 * 2;
    return Math.round(kworum);
};

IsAdminUser = function () {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
};

replacePolishChars = function (_elem) {
    return _elem.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
};

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

stringContains = function (inputString, stringToFind) {
    return (inputString.indexOf(stringToFind) != -1);
};

isInTab = function (item, tab) {
    var flag = false;
    tab.forEach(function (a) {
        if (a == item)
            flag = true;
    });
    return flag;
};

setValueIfEmptyField = function (field, value) {
    if (_.isEmpty(field)) {
        return value;
    }
    return field;
}
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

getUrlPathArray = function () {
    var pathArray = window.location.pathname.split('/');
    if (pathArray) {
        return pathArray;
    }
};

preparePageInfoString = function (pathArray, label) {
    var str = "pageInfo.";
    for (var item in pathArray) {
        if (!!pathArray[item])
            str += pathArray[item] + ".";
    }
    str += label;

    return str;
};

getTabOfUrlParams = function () {
    var tab = [];
    var params = Router.current().params;
    for (var item in params) {
        if (!_.isEmpty(params[item]))
            tab.push(params[item]);
    }
    return tab;
};

setParamInfo = function (paramName, initialValue, newValue) {
    var item = {
        paramName: paramName,
        initialValue: initialValue,
        newValue: newValue
    }
    return item;
};

getUpdateKwestiaRatingObject = function (ratingValue, object) {
    var glosujacyTab = object.glosujacy.slice();
    var wartoscPriorytetu = parseInt(object.wartoscPriorytetu);

    _.each(object.glosujacy, function (item) {
        if (item.idUser === Meteor.userId()) {
            wartoscPriorytetu -= item.value;
            glosujacyTab[object.glosujacy.indexOf(item)].value = ratingValue;
            wartoscPriorytetu += ratingValue;
        }
    });

    var kwestiaUpdate = [{
        wartoscPriorytetu: wartoscPriorytetu,
        glosujacy: glosujacyTab
    }];

    return kwestiaUpdate;
};

getOldValueOfUserVote = function (ratingValue, object) {

    var oldValue = 0;
    _.each(object.glosujacy, function (item) {
        if (item.idUser === Meteor.userId())
            oldValue = item.value;
    });
    return oldValue;
};