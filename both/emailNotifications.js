EmailNotifications = function () {
    //Komunikat po dodaniu Kwestii
    this.registerAddKwestiaNotification = function(systemNazwa, organizacja, user, nazwaKwestii, rodzaj,
                                                   szczegolyKwestii, linkDK, linkLoginTo){
    };

    //Komunikat po rozpoczęciu głosowania
    this.registerStartGlosowanieNotification = function(systemNazwa, organizacja, user, nazwaKwestii, temat, rodzaj,
                                                        szczegolyKwestii, final, priorytet, linkDK, silaPrior,
                                                        kworum, obecnych, linkLoginTo){
    };

    //Komunikat o podjęciu uchwały
    this.PodjecieUchwalyNotification = function(systemNazwa, organizacja, user, status, nazwaKwestii,
                                                temat, rodzaj, szczegolyKwestii, pdfUchwala, linkDR, linkLoginTo){
    };

    //Lobbowanie Kwestii
    this.registerLobKwestiaNotification = function(systemNazwa, organizacja, user, kwestiaNazwa, temat, rodzaj,
                                                   szczegolyKwestii, uzasadnienie, imie, nazwisko, email, linkMojProfil){
    };
}