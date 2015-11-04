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

renderTmpForBootbox = function (template, data) {
    var node = document.createElement("div");
    document.body.appendChild(node);
    UI.renderWithData(template, data, node);
    return node;
};

getNazwaOrganizacji=function(){
    return Parametr.findOne() ? Parametr.findOne().nazwaOrganizacji :"Aktywna Demokracjaa";
};

getLocalDate=function(date) {
    var dt = new Date(date);
    var minutes = dt.getTimezoneOffset();
    dt = new Date(dt.getTime() + minutes*60000);
    return dt;
};

notificationPauseWarning=function(text,timeLeft){
    GlobalNotification.warning({
        title: 'Przepraszamy',
        content: "Istnieje ograniczenie częstotliwości dodawania "+ text +" . Następna tego typu akcja możliwa za "+timeLeft,
        duration: 5 // duration the notification should stay in seconds
    });
};