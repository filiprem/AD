IsAdminUser = function () {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
}
//---------------------------------------------------------------------------------------
replacePolishChars = function(_elem){
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
    return replacePolishChars(u_firstName.slice(0, 1).toLowerCase() + u_lastName.toLowerCase());
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
    if(roles){
        Roles.getAllRoles().forEach(function (role) {
            var option = document.createElement("option");
            option.text = role.name;
            roles.add(option, null);
        });
    }
}
//---------------------------------------------------------------------------------------
setDays = function () {
    var daysCollection = [];
    for (var i = 1; i <= 31; i++) {
        daysCollection.push(i);
    }
    var days = document.getElementById('day');
    for (var d = 0; d < daysCollection.length; d++) {
        var option = document.createElement("option");
        option.text = daysCollection[d];
        days.add(option, null);
    }
}
//---------------------------------------------------------------------------------------
setMonths = function () {
    var monthsCollection = [
        "Styczeń", "Luty", "Marzec",
        "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień",
        "Październik", "Listopad", "Grudzień"
    ];
    var months = document.getElementById('month');
    for (var m = 0; m < monthsCollection.length; m++) {
        var option = document.createElement("option");
        option.text = monthsCollection[m];
        months.add(option, null);
    }
}
//---------------------------------------------------------------------------------------
setYears = function () {
    var yearsCollection = [];
    var yearsCount = 100;
    var currentYear = new Date().getFullYear();
    for (var i = 0; i <= yearsCount; i++) {
        if (i === 100) {
            var yearsCount2 = currentYear - parseInt(currentYear.toString().charAt(0) + "000");
            for (var j = 0; j <= yearsCount2+1; j++) {
                if (j < 10)
                    yearsCollection.push(currentYear.toString().charAt(0) + "00" + j);
                else
                    yearsCollection.push(currentYear.toString().charAt(0) + "0" + j);
            }
        } else {
            if (i < 10)
                yearsCollection.push("190" + i);
            else
                yearsCollection.push("19" + i);
        }
    }
    yearsCollection.reverse();
    var years = document.getElementById('year');
    for (var y = 1; y < yearsCollection.length; y++) {
        var option = document.createElement("option");
        option.text = yearsCollection[y];
        years.add(option, null);
    }
}
//--------------------------------------------------------------
setTematy = function() {
    var tematy = document.getElementById('tematy');
    if(tematy){
        Temat.find().forEach(function (temat) {
            var option = document.createElement("option");
            option.text = temat.nazwaTemat;
            option.value = temat._id;
            tematy.add(option, null);
        });
    }
}
//--------------------------------------------------------------

setRodzaje = function() {
    var rodzaje = document.getElementById('rodzaje');
    if(rodzaje){
        Rodzaj.find().forEach(function (rodzaj) {
            var option = document.createElement("option");
            option.text = rodzaj.nazwaRodzaj;
            option.value = rodzaj._id;
            rodzaje.add(option, null);
        });
    }
}

//--------------------------------------------------------------

setPriorytet = function () {
    var priorytetCollection = [
        -5,-4,-3,-2,-1,1,2,3,4,5
    ];
    var prio = document.getElementById('priorytety');
    if(prio){
        for (var m = 0; m < priorytetCollection.length; m++) {
            var option = document.createElement("option");
            option.text = priorytetCollection[m];
            prio.add(option, null);
        }
    }
}

//-------------------------------------------------------------

stringContains = function (inputString, stringToFind) {
    return (inputString.indexOf(stringToFind) != -1);
}