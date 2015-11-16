// enumy
KWESTIA_STATUS = {
    KATEGORYZOWANA: "kategoryzowana",
    DELIBEROWANA: "deliberowana",
    //ZABLOKOWANA: "zablokowana",
    ARCHIWALNA: "archiwalna",
    ADMINISTROWANA : "administrowana",
    GLOSOWANA: "glosowana",
    REALIZOWANA: "realizowana",
    KOSZ: "kosz",
    OSOBOWA: "osobowa",
    HIBERNOWANA: "hibernowana",
    STATUSOWA: "statusowa",//o nadanie statusu doradcy na honorowego
    OCZEKUJACA:"oczekujaca",//oczekuje na akceptacje zaproszenia na honorowego
    ZREALIZOWANA: "zrealizowana"
};

KWESTIA_TYPE={
  "ACCESS_HONOROWY":"czlonkowstwo honorowe",
  "ACCESS_ZWYCZAJNY":"czlonkowstwo zwyczajne",
  "ACCESS_DORADCA":"czlonkowstwo doradcze",
  "GLOBAL_PARAMETERS_CHANGE": "zmiana parametrów",
   "BASIC":"podstawowa"
};

KWESTIA_ACTION={
  "INVITATION_HONOROWY_REJECTED":"Zaproszony odrzucił chęć aplikowania na stanowisko Członka Honorowego",
  "INVITATION_WAITING_TIME_EXPIRED":"Czas oczekiwania na odpowiedź ze strony zaproszonego minął",
  "DELIBERATION_EXPIRED":"Czas deliberacji kwestii minął",
  "NEGATIVE_PRIORITY":"Siła priorytetu w realizacjii była mniejsza od priorytetu w deliberacji (i) głosowaniu *(-1)"
};

DISCUSSION_OPTIONS = {
    POST_CHARACTERS_DISPLAY: 300,
    POST_ANSWER_CHARACTERS_DISPLAY: 200
};

KWORUM_TYPES = {
    ZWYKLA: "zwykla",
    STATUTOWA: "statutowa"
};

POSTS_TYPES = {
    //domyślna wartość -> komentarz zwykły
    DEFAULT: "default",
    //komentarz, który oznacza chęć przeniesienia kwestii do archiwum
    ARCHIWUM: "archiwum",
    //komentarz, który oznacza chęć przeniesienia do kosza
    KOSZ: "kosz",
    //komentarz, który oznacza chęć przeniesienia kwestii z archiwum do deliberacji
    DELIBERACJA: "deliberacja",
    //komentarz, który oznacza chęć przeniesienia kwesti z realizacji na zrealizowane
    ZREALIZOWANA: "zrealizowana"
};

LANGUAGES = {
    DEFAULT_LANGUAGE: "pl"
}

USERTYPE = {
    ADMIN: "admin",
    CZLONEK : "członek",
    DORADCA : "doradca",
    WSPARCIE: "wsparcie",
    HONOROWY: "honorowy",
    GOSC: "gość"
};

POWIADOMIENIE_TYPE = {
    ZAPROSZENIE: "zaproszenie",
    NOWA_KWESTIA: "nowa kwestia"//itd
};

RADKING = {
    DODANIE_KWESTII: 10,
    WYCOFANIE_KWESTII_DO_ARCHIWUM: -20,
    WYCOFANIE_KWESTII_DO_KOSZA: -40,
    DODANIE_KOMENTARZA: 5,
    DODANIE_ODNIESIENIA: 2,
    WYJSCIE_Z_ZESPOLU_REALIZACYJNEGO: -30,
    NADANIE_PRIORYTETU: 1,
    AWANS_KWESTII_DO_REALIZACJI: 20,
    UDZIAL_W_ZESPOLE_REALIZACYJNYM: 10,
    ZLOZENIE_RAPORTU_REALIZACYJNEGO: 5
};
