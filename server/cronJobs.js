/**
 * Created by Bartłomiej Szewczyk on 2015-09-10.
 */

//START CRONA
SyncedCron.start();

//USTAWIENIA CRONA do sprawdzania głosowanych kwestii - co minute
SyncedCron.add({
    name: 'checking dates crone',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 minute');
    },
    job: function() {
        return checkingEndOfVote();
    }
});

//USTAWIENIA CRONA do sprawdzania czy kwestie mają przejść do głosowania - raz na 7 dni
SyncedCron.add({
    name: 'checking issues to vote crone',
    schedule: function(parser) {
        // parser is a later.parse object
        var voteFreq = Parametr.findOne({}).voteFrequency;
        return parser.text('every '+ voteFreq + ' minute');
    },
    job: function() {
        return checkingIssuesToVote();
    }
});

//Observe dla parametru który ustawia częstotliwość w cronie "checking issues to vote crone"
Meteor.startup(function (){
    var parametr = Parametr.find({});
    parametr.observe({
        changedAt: function(newParametr, oldParametr, atIndex){
            if(oldParametr.voteFrequency!=newParametr.voteFrequency){
                //console.log("było:"+oldParametr.voteFrequency+" jest:"+newParametr.voteFrequency);
                SyncedCron.remove('checking issues to vote crone');
                SyncedCron.add({
                    name: 'checking issues to vote crone',
                    schedule: function(parser) {
                        // parser is a later.parse object
                        return parser.text('every '+ newParametr.voteFrequency + ' minute');
                    },
                    job: function() {
                        return checkingIssuesToVote();
                    }
                });
            }
        }
    });
});

//==================================== wywoływane metody ======================================================//

//Sprawdzanie dat dla głosowania oraz dla kwestii oczekujących
//oczekujące do zrobienia - potrzebne dodanie do bazy jakiejś daty kiedy kwestia przeszła na oczekującą
//i wtedy dodawać 30 dni (taki jest termin) lub odrazu zapisywać termin wygaśniecia kwesti oczekującej.
checkingEndOfVote = function() {

    var actualDate = new Date();
    var kwestie = Kwestia.find({czyAktywny: true, status: {$in: [KWESTIA_STATUS.GLOSOWANA, KWESTIA_STATUS.OCZEKUJACA]}});
    var pktZaUdzialWZesp = RADKING.UDZIAL_W_ZESPOLE_REALIZACYJNYM;

    kwestie.forEach(function (kwestia) {

        if(kwestia.status == KWESTIA_STATUS.GLOSOWANA) {

            if(actualDate >= kwestia.dataGlosowania){
                if(kwestia.wartoscPriorytetu>0) {

                    awansUzytkownika(kwestia.idZespolRealizacyjny, pktZaUdzialWZesp);
                    kwestia.dataRealizacji = new Date();
                    kwestia.numerUchwaly = nadawanieNumeruUchwaly(kwestia.dataRealizacji);

                    //Marzena:
                    var zrDraft=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
                    if(zrDraft.idZR!=null){//jezeli draft ma id ZR( kopiuje od istniejÄ…cego ZR), to dopisz do kisty ZR tego drafta
                        var ZR=ZespolRealizacyjny.findOne({_id:zrDraft.idZR});
                        var listKwestii=ZR.kwestie.slice();
                        listKwestii.push(kwestia._id);
                        Meteor.call('updateListKwesti', ZR._id, listKwestii,function(error){
                            if (error) {
                                if (typeof Errors === "undefined")
                                    Log.error('Error: ' + error.reason);
                                else
                                    throwError(error.reason);

                            }
                            else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
                                Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji,ZR._id);
                            }
                        });
                    }
                    else{//w innym przypadku robimy nowy zespĂłĹ‚ Realizacyjny
                        var arrayKwestie=[];
                        arrayKwestie.push(kwestia._id);
                        var newZR={
                            nazwa: zrDraft.nazwa,
                            zespol:zrDraft.zespol,
                            kwestie :arrayKwestie,
                            czyAktywny:true
                        };
                        Meteor.call('addZespolRealizacyjny',newZR,function(error,ret){
                            if (error) {
                                if (typeof Errors === "undefined")
                                    Log.error('Error: ' + error.reason);
                                else
                                    throwError(error.reason);

                            }
                            else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
                                var idZR=ret;
                                Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji,idZR);
                            }
                        });
                    }//usuĹ„ niepotrzebnego drafta
                    Meteor.call('removeZespolRealizacyjnyDraft', kwestia.idZR);
                    //end Marzena

                    //W przypadku przejďż˝cia Kwestii-Opcji do Realizacji - pozostaďż˝e Opcje przechodzďż˝ na status HIBERNOWANA
                    if(kwestia.idParent!=kwestia._id) {

                        kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: kwestia.idParent});
                        kwestieOpcje.forEach(function (kwestiaOpcja){

                            if(kwestiaOpcja.idParent!=kwestiaOpcja._id && kwestiaOpcja._id!=kwestia._id){

                                Meteor.call('updateStatusKwestii', kwestiaOpcja._id, KWESTIA_STATUS.HIBERNOWANA);
                            }
                        });
                    }

                    //Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji,ZR._id);
                }
                else{
                    Meteor.call('updateStatusKwestii', kwestia._id, KWESTIA_STATUS.ARCHIWALNA);
                }
            }
        }
        else if(kwestia.status == KWESTIA_STATUS.OCZEKUJACA){ //DO ZROBIENIA!!!!!

            awansUzytkownika(kwestia.idZespolRealizacyjny, pktZaUdzialWZesp);
            kwestia.dataRealizacji = new Date();
            kwestia.numerUchwaly = nadawanieNumeruUchwaly(kwestia.dataRealizacji);
            Meteor.call('updateStatNrUchwDtRealKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji);
        }
    });
};


//RAZ NA 7 DNI 3 NAJWYŻEJ OCENIANE KWESTIE PRZECHODZĄ DO GŁOSOWANIA
// 7 i 3 mają być wczytywane z parametru z tym że 7 jest ustawiane w cronie
checkingIssuesToVote = function () {

    var kworum = liczenieKworumZwykle();
    var voteQuant = Parametr.findOne({}).voteQuantity;
    var issues = Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.DELIBEROWANA});
    var kwestie = [];

    issues.forEach(function (issue) {

        var usersCount = issue.glosujacy.length;
        var teamCount = ZespolRealizacyjnyDraft.findOne({_id: issue.idZespolRealizacyjny}).zespol.length;

        if(issue.wartoscPriorytetu > 0 && usersCount >= kworum && teamCount >= 3) {

            kwestie.push(issue);
        }
    });

    if(kwestie!=null){
        kwestie = kwestie.sort({ wartoscPriorytetu: -1});
        var iloscKwestii = 0;

        kwestie.forEach(function (kwestia) {
            if(iloscKwestii<voteQuant){

                var czasGlosowania = Rodzaj.findOne({_id: kwestia.idRodzaj}).czasGlosowania;
                kwestia.dataGlosowania = new Date().addHours(czasGlosowania);
                Meteor.call('updateStatusDataGlosowaniaKwestii', kwestia._id, KWESTIA_STATUS.GLOSOWANA, kwestia.dataGlosowania);
            }
            iloscKwestii++;
        });
    }
};


//=========================================== metody pomocnicze ===============================================//

awansUzytkownika = function(idZespoluRealiz, pktZaUdzialWZesp) {

    var zespol = ZespolRealizacyjny.findOne({_id: idZespoluRealiz}).zespol;

    zespol.forEach(function (idUzytkownikaZespolu){
        var uzytkownikAwansujacy = Users.findOne({_id: idUzytkownikaZespolu});
        uzytkownikAwansujacy.profile.rADking += pktZaUdzialWZesp;
        Meteor.call('updateUserRanking',idUzytkownikaZespolu, uzytkownikAwansujacy.profile.rADking);
    });
};

//Nadawanie numeru uchwały - dla kwesti które przechodzą do realizacji, każdego dnia numery idą od 1
nadawanieNumeruUchwaly = function(dataRealizacji) {

    var numerUchw = 1;
    var kwestieRealizowane = Kwestia.find({czyAktywny: true, numerUchwaly: !null});

    kwestieRealizowane.forEach(function (kwestiaRealizowana) {

        if(kwestiaRealizowana.dataRealizacji.toDateString() == dataRealizacji.toDateString())
            numerUchw++
    });

    return numerUchw;
};