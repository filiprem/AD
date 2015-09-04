/**
 * Created by Bart³omiej Szewczyk on 2015-09-02.
 * Metody u¿ywane po stronie serwera i klienta
 */

liczenieKworumZwykle = function () {
    var liczbaUzytkownikow = Users.find({'profile.userType': USERTYPE.CZLONEK }).count();
    var potega = 7 / 9;
    var liczba = 4 / 7;
    var kworum = Math.pow(liczbaUzytkownikow, potega) * liczba;
    if(kworum<3)
        kworum = 3;

    return Math.round(kworum);
};

liczenieKworumStatutowe = function () {
    var liczbaUzytkownikow = Users.find({'profile.userType': USERTYPE.CZLONEK }).count();
    var kworum = liczbaUzytkownikow / 3 * 2;
    if(kworum<3)
        kworum = 3;
    return Math.round(kworum);
};

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours()+h);
    return this;
};