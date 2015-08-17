IsAdminUser = function () {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
}
//---------------------------------------------------------------------------------------
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
}
generateLogin = function (u_firstName, u_lastName) {
    do {
        var userName = replacePolishChars(u_firstName.slice(0, 1).toLowerCase() + u_lastName.toLowerCase() + Math.floor(Math.random() * 9000 + 1000));
        var userExists = Users.findOne({username: userName});
    }
    while (userExists != null);
    return userName;
}
//---------------------------------------------------------------------------------------
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
}
//---------------------------------------------------------------------------------------
setRoles = function () {
    var roles = document.getElementById('role');
    if (roles) {
        Roles.getAllRoles().forEach(function (role) {
            var option = document.createElement("option");
            option.text = role.name;
            roles.add(option, null);
        });
    }
}
//---------------------------------------------------------------------------------------
//-------------------------------------------------------------

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
getUserRadkingValue=function(idUser){
    var user=Users.findOne({_id:idUser});
    return Number(user.profile.rADking);
};
getAllUsersWhoVoted=function(idKWestia){
    var kwestia=Kwestia.findOne({_id:idKWestia});
    var tab=kwestia.glosujacy;
    var tabNew=[];
    for(var j= 0;j<tab.length;j++){
        tabNew.push(tab[j].idUser);
    }
    return tabNew;
};