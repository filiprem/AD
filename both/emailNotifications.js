EmailNotifications = function () {
    //Komunikat po dodaniu Kwestii
    this.registerAddKwestiaNotification = function(systemNazwa, organizacja, user, nazwaKwestii, rodzaj,
                                                   szczegolyKwestii, linkDK, linkLoginTo){
        var prop = {
            systemNazwa: systemNazwa,
            organizacja: organizacja,
            user: user,
            nazwaKwestii: nazwaKwestii,
            rodzaj: rodzaj,
            szczegolyKwestii: szczegolyKwestii,
            linkDK: linkDK,
            linkLoginTo: linkLoginTo
        }
    };

    //Komunikat po rozpoczęciu głosowania
    this.registerStartGlosowanieNotification = function(systemNazwa, organizacja, user, nazwaKwestii, temat, rodzaj,
                                                        szczegolyKwestii, final, priorytet, linkDK, silaPrior,
                                                        kworum, obecnych, linkLoginTo){
        var prop = {
            systemNazwa: systemNazwa,
            organizacja: organizacja,
            user: user,
            nazwaKwestii: nazwaKwestii,
            temat: temat,
            rodzaj: rodzaj,
            szczegolyKwestii: szczegolyKwestii,
            final: final,
            priorytet: priorytet,
            linkDK: linkDK,
            silaPrior: silaPrior,
            kworum: kworum,
            obecnych: obecnych,
            linkLoginTo: linkLoginTo
        }
    };

    //Komunikat o podjęciu uchwały
    this.PodjecieUchwalyNotification = function(systemNazwa, organizacja, user, status, nazwaKwestii,
                                                temat, rodzaj, szczegolyKwestii, pdfUchwala, linkDR, linkLoginTo){
        var prop = {
            systemNazwa: systemNazwa,
            organizacja : organizacja,
            user: user,
            status: status,
            nazwaKwestii: nazwaKwestii,
            temat: temat,
            rodzaj: rodzaj,
            szczegolyKwestii: szczegolyKwestii,
            pdfUchwala: pdfUchwala,
            linkDR: linkDR,
            linkLoginTo: linkLoginTo
        }
    };
    //Lobbowanie Kwestii
    this.registerLobKwestiaNotification = function(systemNazwa, organizacja, user, kwestiaNazwa, temat, rodzaj,
                                                   szczegolyKwestii, uzasadnienie, mojeImie, mojeNazwisko, mojEmail, linkMojProfil){
        var prop = {
            systemNazwa: systemNazwa,
            organizacja: organizacja,
            user: user,
            kwestiaNazwa: kwestiaNazwa,
            temat: temat,
            rodzaj: rodzaj,
            szczegolyKwestii: szczegolyKwestii,
            uzasadnienie: uzasadnienie,
            mojeImie: mojeImie,
            mojeNazwisko: mojeNazwisko,
            mojEmail: mojEmail,
            linkMojProfil: linkMojProfil
        }
    };
}