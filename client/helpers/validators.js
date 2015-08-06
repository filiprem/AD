trimInput = function(value) {
    return value.replace(/^\s*|\s*$/g, '');
};

isNotEmpty = function(value, statement) {
    value=value.replace(/\s+/g,'');
    console.log("Value "+value);
    console.log("Statement "+statement)
    if (value!=='' && value !== '0'){
        return true;
    }
    throwError('Uzupełnij pole '+statement);
    return false;
};

isEmail = function(value) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(value)) {
        return true;
    }
    throwError('Proszę wpisać prawidłowy adres e-mail.');
    return false;
};

isValidPassword = function(password) {
    if (password.length < 6) {
        throwError('Hasło powinno składać się przynajmniej z 6 znaków.');
        return false;
    }
    return true;
};

areValidPasswords = function(password, confirm) {
    if (!isValidPassword(password)) {
        return false;
    }
    if (password !== confirm) {
        throwError('Hasła do siebie nie pasują.');
        return false;
    }
    return true;
};

isPositiveNumber=function(value, statement) {
    if(value>0){
        return true;
    }
    throwError('Nie można podawać ujemnych wartości w polu '+ statement);
    return false;
};

isNumeric= function(value, statement){
    var filter=/^\d+([.]\d+)?$/;
    if(filter.test(value)) {
        return true;
    }
    throwError('Proszę wpisać prawidłowy format liczby w polu '+statement);
    return false;
}