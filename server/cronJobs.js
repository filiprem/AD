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

SyncedCron.add({
    name: 'checking if deliberation expired',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 day');
    },
    job: function() {
        return checkingDeliberationExpiration();
    }
});

//USTAWIENIA CRONA do sprawdzania czy kwestie mają przejść do głosowania - raz na 7 dni
//SyncedCron.add({
//    name: 'checking issues to vote crone',
//    schedule: function(parser) {
//        // parser is a later.parse object
//        //var voteFreq = Parametr.findOne({}).voteFrequency;
//        //return parser.text('every '+ voteFreq + ' minute');
//    },
//    job: function() {
//        return checkingIssuesToVote();
//    }
//});

//Observe dla parametru który ustawia częstotliwość w cronie "checking issues to vote crone"
Meteor.startup(function (){
    var parametr = Parametr.find({});
    parametr.observe({
        changedAt: function(newParametr, oldParametr, atIndex){
            //if(oldParametr.voteFrequency!=newParametr.voteFrequency){
            //    //console.log("było:"+oldParametr.voteFrequency+" jest:"+newParametr.voteFrequency);
            //    SyncedCron.remove('checking issues to vote crone');
            //    SyncedCron.add({
            //        name: 'checking issues to vote crone',
            //        schedule: function(parser) {
            //            // parser is a later.parse object
            //            return parser.text('every '+ newParametr.voteFrequency + ' minute');
            //        },
            //        job: function() {
            //            return checkingIssuesToVote();
            //        }
            //    });
            //}
        }
    });
});

//==================================== wywoływane metody ======================================================//

//Sprawdzanie dat dla głosowania oraz dla kwestii oczekujących
//oczekujące do zrobienia - potrzebne dodanie do bazy jakiejś daty kiedy kwestia przeszła na oczekującą
//i wtedy dodawać 30 dni (taki jest termin) lub odrazu zapisywać termin wygaśniecia kwesti oczekującej.

//sprawdzanie kiedy koniec glosowania i dopowiednie dzzialania-realizacja lub kosz lub sth else
checkingEndOfVote = function() {

    var actualDate = moment(new Date()).format();
    var kwestie = Kwestia.find({czyAktywny: true, status: {$in: [KWESTIA_STATUS.GLOSOWANA, KWESTIA_STATUS.OCZEKUJACA]}});
    var pktZaUdzialWZesp = RADKING.UDZIAL_W_ZESPOLE_REALIZACYJNYM;
    kwestie.forEach(function (kwestia) {

        if(kwestia.status == KWESTIA_STATUS.GLOSOWANA) {
            if(actualDate >= kwestia.dataGlosowania) {
                if (kwestia.wartoscPriorytetu > 0) {
                    //for global prameters- jeśli minął czas głosowania,wartPrior>0-> update parametrów, zmiana na zrealizowaną
                    if (kwestia.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
                        changeParametersSuccess(kwestia);

                    //for kwestia type basic-jesli minal czas glosowania,wartPrior>0->
                    //-dodajemy pkt uzytkownikom za udzial w zespole(zepsol bierzemy z ZrDraft)
                    //-jezeli zrDraft ma idZR- to odszukujemy ten ZR i o ile istnieje(mogl byc w miedzyczasie rozwiazany)
                    //to dopisujemy do tego zr tą kwestię i tej kwestii zeminiamy idZr,stary ZRDraft usuwamy
                    //-else: tworzymy nowy ZR przepisujac ZRDraft,dodajemy do niego kwestie,W kwestii zmeiniamy idZr, ZRDraft usuwamy
                    //-kwestia zmienia status na realizowana
                    else {
                        awansUzytkownika(kwestia.idZespolRealizacyjny, pktZaUdzialWZesp);
                        kwestia.dataRealizacji = new Date();
                        kwestia.numerUchwaly = nadawanieNumeruUchwaly(kwestia.dataRealizacji);
                        var idZr=kwestia.idZespolRealizacyjny;
                        var zrDraft = ZespolRealizacyjnyDraft.findOne({_id: kwestia.idZespolRealizacyjny});
                        if (zrDraft.idZR != null) {//jezeli draft ma id ZR( kopiuje od istniejącego ZR), to dopisz do kisty ZR tego drafta
                            var ZR = ZespolRealizacyjny.findOne({_id: zrDraft.idZR});
                            if(ZR)
                                updateListKwestie(ZR,kwestia._id);
                            else {
                                createNewZR(zrDraft, kwestia);
                            }
                        }
                        else {
                            createNewZR(zrDraft, kwestia);
                        }

                        Meteor.call('removeZespolRealizacyjnyDraft',kwestia.idZespolRealizacyjny);

                        //W przypadku przejścia Kwestii-Opcji do Realizacji - pozostałe Opcje przechodzą na status HIBERNOWANA
                        //var kwestieOpcje=Kwestia.find({idParent:kwestia.idParent});
                        //if(kwestieOpcje.count()>0)
                        //if (kwestia.idParent != kwestia._id)
                        if(kwestia.idParent!=null)
                            hibernateKwestieOpcje(kwestia);
                    }
                }
                else {
                    console.log("admnistrowna/deliberowana w glosowaniu->kosz");
                    Meteor.call('removeKwestia', kwestia._id);
                }
            }
        }
        else if(kwestia.status == KWESTIA_STATUS.OCZEKUJACA){ //DO ZROBIENIA!!!!! po miesiącu idzie do kosza

            awansUzytkownika(kwestia.idZespolRealizacyjny, pktZaUdzialWZesp);
            kwestia.dataRealizacji = new Date();
            kwestia.numerUchwaly = nadawanieNumeruUchwaly(kwestia.dataRealizacji);
            Meteor.call('updateStatNrUchwDtRealKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji);
           //to samo,co dla tej powyzej, +zmiana statusu na w realizacji
        }
    });
};

checkingDeliberationExpiration=function(){
    var kwestie = Kwestia.find({czyAktywny: true, status:
    {$in: [
        KWESTIA_STATUS.DELIBEROWANA,
        KWESTIA_STATUS.ADMINISTROWANA,
        KWESTIA_STATUS.STATUSOWA
    ]}});
    kwestie.forEach(function(kwestia){
        var date=moment(kwestia).add(1,"month").format();
        if(date<=moment(new Date().format()))
           Meteor.call("removeKwestia",kwestia._id);
        //+ zarządzanie zr!
    });
};
//RAZ NA 7 DNI 3 NAJWYŻEJ OCENIANE KWESTIE PRZECHODZĄ DO GŁOSOWANIA
// 7 i 3 mają być wczytywane z parametru z tym że 7 jest ustawiane w cronie
//checkingIssuesToVote = function () {
//
//    var kworum = liczenieKworumZwykle();
//    var voteQuant = Parametr.findOne({}).voteQuantity;
//    var issues = Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.DELIBEROWANA});
//    var kwestie = [];
//
//    issues.forEach(function (issue) {
//
//        var usersCount = issue.glosujacy.length;
//        var teamCount = ZespolRealizacyjnyDraft.findOne({_id: issue.idZespolRealizacyjny}).zespol.length;
//
//        if(issue.wartoscPriorytetu > 0 && usersCount >= kworum && teamCount >= 3) {
//
//            kwestie.push(issue);
//        }
//    });
//
//    if(kwestie!=null){
//        kwestie = kwestie.sort({ wartoscPriorytetu: -1});
//        var iloscKwestii = 0;
//
//        kwestie.forEach(function (kwestia) {
//            if(iloscKwestii<voteQuant){
//
//                var czasGlosowania = Rodzaj.findOne({_id: kwestia.idRodzaj}).czasGlosowania;
//                kwestia.dataGlosowania = new Date().addHours(czasGlosowania);
//                Meteor.call('updateStatusDataGlosowaniaKwestii', kwestia._id, KWESTIA_STATUS.GLOSOWANA, kwestia.dataGlosowania);
//            }
//            iloscKwestii++;
//        });
//    }
//};


//=========================================== metody pomocnicze ===============================================//

awansUzytkownika = function(idZespoluRealiz, pktZaUdzialWZesp) {
    console.log(ZespolRealizacyjnyDraft.findOne({_id: idZespoluRealiz}));
    var zespol = ZespolRealizacyjnyDraft.findOne({_id: idZespoluRealiz}).zespol;

    zespol.forEach(function (idUzytkownikaZespolu){
        var uzytkownikAwansujacy = Users.findOne({_id: idUzytkownikaZespolu});
        if(uzytkownikAwansujacy) {
            uzytkownikAwansujacy.profile.rADking += pktZaUdzialWZesp;
            Meteor.call('updateUserRanking', idUzytkownikaZespolu, uzytkownikAwansujacy.profile.rADking);
        }
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
//...................................................................................
changeParametersSuccess=function(kwestia){
    var globalPramsDraft=ParametrDraft.findOne({czyAktywny:true});
    var obj={
        nazwaOrganizacji:globalPramsDraft.nazwaOrganizacji,
        terytorium:globalPramsDraft.terytorium,
        kontakty:globalPramsDraft.kontakty,
        regulamin: globalPramsDraft.regulamin,
        voteDuration: globalPramsDraft.voteDuration,
        voteQuantity:globalPramsDraft.voteQuantity
    };
    console.log("new Parameter");
    console.log(obj);
    var globalParam=Parametr.findOne();
    Meteor.call("updateParametr",globalParam._id,obj,function(error){
        if(!error)
            Meteor.call("setActivityParametrDraft",globalPramsDraft._id,false,function(error){
                if(!error)
                    Meteor.call("updateStatusKwestii",kwestia._id,KWESTIA_STATUS.ZREALIZOWANA);
                else
                    console.log("update param failed");
            });
        else{
            console.log("nie udało się");
        }
    });
};

updateListKwestie=function(ZR,kwestia){
    var listKwestii = ZR.kwestie.slice();
    listKwestii.push(kwestia._id);
    Meteor.call('updateListKwesti', ZR._id, listKwestii, function (error) {
        if (error) {
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else
                throwError(error.reason);

        }
        else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
            Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, ZR._id);
        }
    });
};

createNewZR=function(zrDraft,kwestia){
    var arrayKwestie = [];
    arrayKwestie.push(kwestia._id);
    var newZR = [{
        nazwa: zrDraft.nazwa,
        zespol: zrDraft.zespol,
        kwestie: arrayKwestie,
        czyAktywny: true
    }];
    console.log("ten zespol");
    console.log(newZR);
    Meteor.call('addZespolRealizacyjny', newZR, function (error, ret) {
        if (error) {
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else
                throwError(error.reason);

        }
        else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
            var idZR = ret;
            Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, idZR);
        }
    });
};
hibernateKwestieOpcje=function(kwestia){
    kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: kwestia.idParent,
        status:{$in:[KWESTIA_STATUS.GLOSOWANA,KWESTIA_STATUS.DELIBEROWANA]}});
    console.log("kwestie opcje");
    console.log(kwestieOpcje);
    kwestieOpcje.forEach(function (kwestiaOpcja) {
        console.log("update kwestii opcjii");
        Meteor.call('updateStatusKwestii', kwestiaOpcja._id, KWESTIA_STATUS.HIBERNOWANA);
    });
};