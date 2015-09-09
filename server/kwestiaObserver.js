/**
 * Created by Bartďż˝omiej Szewczyk on 2015-08-31.

Badanie zmian w postach, zespoďż˝ach i kwestii w celu sprawdzenia czy kwestia powinna zmieniďż˝ status z:
 deliberowana na glosowana
 glosowana na realizowana
 glosowana na archiwalna
 statusowa na oczekująca
 oczekujďż˝ca na realizowana
 archiwalna na deliberowana
 */

Meteor.startup(function(){
    var kwestie = Kwestia.find({
        czyAktywny: true,
        status: {
            $in: [
                KWESTIA_STATUS.DELIBEROWANA,
                KWESTIA_STATUS.STATUSOWA,
                KWESTIA_STATUS.REALIZOWANA
            ]
        }
    });
    var postyPodKwestiami = Posts.find({czyAktywny: true});
    var zespoly = ZespolRealizacyjny.find({});

    kwestie.observe({
        changedAt: function(newKwestia, oldKwestia, atIndex) {

            var kworum = liczenieKworumZwykle();
            var usersCount = newKwestia.glosujacy.length;
            var zespolCount = ZespolRealizacyjnyDraft.findOne({_id: newKwestia.idZespolRealizacyjny}).zespol.length;

            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && zespolCount >= 3 && newKwestia.status != KWESTIA_STATUS.REALIZOWANA){

                if(newKwestia.status == KWESTIA_STATUS.DELIBEROWANA){

                    var czasGlosowania = Rodzaj.findOne({_id: newKwestia.idRodzaj}).czasGlosowania;
                    newKwestia.dataGlosowania = new Date().addHours(czasGlosowania);
                    Meteor.call('updateStatusDataGlosowaniaKwestii', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, newKwestia.dataGlosowania);
                }
                else if (newKwestia.status == KWESTIA_STATUS.STATUSOWA){

                    Meteor.call('updateStatusKwestii', newKwestia._id, KWESTIA_STATUS.OCZEKUJACA);
                }
            }

            if(newKwestia.status == KWESTIA_STATUS.REALIZOWANA && newKwestia.wartoscPriorytetuWRealizacji < (-newKwestia.wartoscPriorytetu)){

                Meteor.call('removeKwestia', newKwestia._id);
            }

            // uaktywnienie z hibernacji w przypadku degradacji innej kwesti-opcji z Realizacji
            if(oldKwestia.status != newKwestia.status){
                if(oldKwestia.status == KWESTIA_STATUS.REALIZOWANA
                    && (newKwestia.status != KWESTIA_STATUS.ZREALIZOWANA)){
                    if(newKwestia.idParent!=newKwestia._id) {

                        kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: kwestia.idParent, status: KWESTIA_STATUS.HIBERNOWANA});
                        kwestieOpcje.forEach(function (kwestiaOpcja){

                            if(kwestiaOpcja.idParent!=kwestiaOpcja._id && kwestiaOpcja._id!=newKwestia._id){

                                Meteor.call('updateStatusKwestii', kwestiaOpcja._id, KWESTIA_STATUS.DELIBEROWANA);
                            }
                        });
                    }
                }
            }
        }
    });

    postyPodKwestiami.observe({
       changedAt: function(newPost, oldPost, atIndex) {

           var kworum = liczenieKworumZwykle();
           var usersCount = newPost.glosujacy.length;
           if(newPost.wartoscPriorytetu > 0 && usersCount >= kworum) {
               switch(newPost.postType){

                   case POSTS_TYPES.DELIBERACJA:
                       Meteor.call('updateStatusDataGlosowaniaKwestii', newPost.idKwestia, KWESTIA_STATUS.DELIBEROWANA, null);
                       break;

                   case POSTS_TYPES.KOSZ:
                       Meteor.call('removeKwestia', newPost.idKwestia);
                       break;

                   case POSTS_TYPES.ARCHIWUM:
                       var kwestia = Kwestia.findOne({czyAktywny: true, _id: newPost.idKwestia});
                       if(kwestia.status == KWESTIA_STATUS.REALIZOWANA) {
                           //Marzena:{
                           //tworze ZR draft z danych ZR,do tkorego kwestia nalezy i go dodaje
                           var ZR=ZespolRealizacyjny.findOne({_id:kwestia._id});
                           var newZRDraft={
                               nazwa:ZR.nazwa,
                               zespol:ZR.zespol,
                               idZR:ZR._id
                           };
                           Meteor.call('addZespolRealizacyjnyDraft',newZRDraft,function(error,ret){
                               if (error) {
                                   if (typeof Errors === "undefined")
                                       Log.error('Error: ' + error.reason);
                                   else
                                       throwError(error.reason);

                               }
                               else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
                                   var idZRDraft=ret;
                                   Meteor.call('updateStatIdZespolu', kwestia._id, KWESTIA_STATUS.ARCHIWALNA, idZRDraft,function(error){
                                       if (error) {
                                           if (typeof Errors === "undefined")
                                               Log.error('Error: ' + error.reason);
                                           else
                                               throwError(error.reason);
                                       }
                                       else {//usun z ZR tÄ… kwestiÄ™
                                           var ZRKwestietoUpdate=ZR.kwestie.slice();
                                           ZRKwestietoUpdate= _.without(ZRKwestietoUpdate,kwestia._id);
                                           Meteor.call('updateKwestieZR', kwestia._id, ZRKwestietoUpdate,function(error){
                                               if (error) {
                                                   if (typeof Errors === "undefined")
                                                       Log.error('Error: ' + error.reason);
                                               }
                                           });
                                       }
                                   });
                               }
                           });
                       }
                       else {
                           Meteor.call('updateStatusKwestii', newPost.idKwestia, KWESTIA_STATUS.ARCHIWALNA);
                       }
                       break;

                   case POSTS_TYPES.ZREALIZOWANA:
                       Meteor.call('updateStatusKwestii', newPost.idKwestia, KWESTIA_STATUS.ZREALIZOWANA);
                       break;
               }
           }
       }
    });

    zespoly.observe({
        changedAt: function(newZespol, oldZespol, atIndex) {

            var kworum = liczenieKworumZwykle();
            var kwestia = Kwestia.findOne({czyAktywny: true, idZespolRealizacyjny: newZespol._id});

            if(kwestia.wartoscPriorytetu > 0 && kwestia.glosujacy.length >= kworum && newZespol.zespol.length >= 3) {

                if (kwestia.status == KWESTIA_STATUS.DELIBEROWANA) {

                    var czasGlosowania = Rodzaj.findOne({_id: kwestia.idRodzaj}).czasGlosowania;
                    kwestia.dataGlosowania = new Date().addHours(czasGlosowania);
                    Meteor.call('updateStatusDataGlosowaniaKwestii', kwestia._id, KWESTIA_STATUS.GLOSOWANA, kwestia.dataGlosowania);
                }
                else if (kwestia.status == KWESTIA_STATUS.STATUSOWA){

                    Meteor.call('updateStatusKwestii', kwestia._id, KWESTIA_STATUS.OCZEKUJACA);
                }
            }
        }
    });
});

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
        var sprawdzanieDaty = sprawdzanieDat();
        return sprawdzanieDaty;
    }
});

//USTAWIENIA CRONA do sprawdzania czy kwestie mają przejść do głosowania - raz na 7 dni
SyncedCron.add({
    name: 'checking issues to vote crone',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 7 day');
    },
    job: function() {
        var checkIssTVote = checkingIssuesToVote();
        return checkIssTVote;
    }
});

//Nadawanie numeru uchwaďż˝y - dla kwesti ktďż˝re przechodzďż˝ do realizacji, kaďż˝dego dnia numery idďż˝ od 1
nadawanieNumeruUchwaly = function(dataRealizacji) {

    var numerUchw = 1;
    var kwestieRealizowane = Kwestia.find({czyAktywny: true, numerUchwaly: !null});

    kwestieRealizowane.forEach(function (kwestiaRealizowana) {

        if(kwestiaRealizowana.dataRealizacji.toDateString() == dataRealizacji.toDateString())
            numerUchw++
    });

    return numerUchw;
};

//Wywoďż˝anie tej metody jest w Cronie
//Sprawdzanie dat dla gďż˝osowania oraz dla kwestii oczekujďż˝cych
//oczekujďż˝ce do zrobienia - potrzebne dodanie do bazy jakiejďż˝ daty kiedy kwestia przeszďż˝a na oczekujďż˝cďż˝
//i wtedy dodawaďż˝ 30 dni (taki jest termin) lub odrazu zapisywaďż˝ termin wygaďż˝niecia kwesti oczekujďż˝cej.
sprawdzanieDat = function() {

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
                        var ZR=ZespolRealizacyjny.findOne({id:zrDraft.idZR});
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

awansUzytkownika = function(idZespoluRealiz, pktZaUdzialWZesp) {

    var zespol = ZespolRealizacyjny.findOne({_id: idZespoluRealiz}).zespol;

    zespol.forEach(function (idUzytkownikaZespolu){
        var uzytkownikAwansujacy = Users.findOne({_id: idUzytkownikaZespolu});
        uzytkownikAwansujacy.profile.rADking += pktZaUdzialWZesp;
        Meteor.call('updateUserRanking',idUzytkownikaZespolu, uzytkownikAwansujacy.profile.rADking);
    });
};

checkingIssuesToVote = function () {
    //DO ZROBIENIA
    //RAZ NA 7 DNI 3 NAJWYŻEJ OCENIANE KWESTIE PRZECHODZĄ DO GŁOSOWANIA
    // 7 i 3 mają być wczytywane z parametru z tym że 7 jest ustawiane w cronie
};