/**
 * Created by Bart�omiej Szewczyk on 2015-08-31.

Badanie zmian w postach, zespo�ach i kwestii w celu sprawdzenia czy kwestia powinna zmieni� status z:
 deliberowana na glosowana
 glosowana na realizowana
 glosowana na archiwalna
 statusowa na oczekuj�ca
 oczekuj�ca na realizowana
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

            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && zespolCount >= 3){

                if(newKwestia.status == KWESTIA_STATUS.DELIBEROWANA){

                    var czasGlosowania = Rodzaj.findOne({_id: newKwestia.idRodzaj}).czasGlosowania;
                    newKwestia.dataGlosowania = new Date().addHours(czasGlosowania);
                    Meteor.call('updateStatusDataGlosowaniaKwestii', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, newKwestia.dataGlosowania);
                }
                else if (newKwestia.status == KWESTIA_STATUS.STATUSOWA){

                    Meteor.call('updateStatusKwestii', newKwestia._id, KWESTIA_STATUS.OCZEKUJACA);
                }
            }

            // Hibernowane - aby z powrotem si� (automatycznie) uaktywni� w przypadku degradacji tamtej z Realizacji
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
               if (newPost.postType == POSTS_TYPES.DELIBERACJA) {

                   Meteor.call('updateStatusDataGlosowaniaKwestii', newPost.idKwestia, KWESTIA_STATUS.DELIBEROWANA, null);
               }
               else if (newPost.postType == POSTS_TYPES.KOSZ) {

                   Meteor.call('removeKwestia', newPost.idKwestia);
               }
               else if (newPost.postType == POSTS_TYPES.ARCHIWUM) {

                   Meteor.call('updateStatusDataGlosowaniaKwestii', newPost.idKwestia, KWESTIA_STATUS.DELIBEROWANA, null);
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

//USTAWIENIA CRONA
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

//Nadawanie numeru uchwa�y - dla kwesti kt�re przechodz� do realizacji, ka�dego dnia numery id� od 1
nadawanieNumeruUchwaly = function(dataRealizacji) {

    var numerUchw = 1;
    var kwestieRealizowane = Kwestia.find({czyAktywny: true, numerUchwaly: !null});

    kwestieRealizowane.forEach(function (kwestiaRealizowana) {

        if(kwestiaRealizowana.dataRealizacji.toDateString() == dataRealizacji.toDateString())
            numerUchw++
    });

    return numerUchw;
};

//Wywo�anie tej metody jest w Cronie
//Sprawdzanie dat dla g�osowania oraz dla kwestii oczekuj�cych
//oczekuj�ce do zrobienia - potrzebne dodanie do bazy jakiej� daty kiedy kwestia przesz�a na oczekuj�c�
//i wtedy dodawa� 30 dni (taki jest termin) lub odrazu zapisywa� termin wyga�niecia kwesti oczekuj�cej.
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
                    if(zrDraft.idZR!=null){//jezeli draft ma id ZR( kopiuje od istniejącego ZR), to dopisz do kisty ZR tego drafta
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
                    else{//w innym przypadku robimy nowy zespół Realizacyjny
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
                    }//usuń niepotrzebnego drafta
                    Meteor.call('removeZespolRealizacyjnyDraft', kwestia.idZR);
                    //end Marzena

                    //W przypadku przej�cia Kwestii-Opcji do Realizacji - pozosta�e Opcje przechodz� na status HIBERNOWANA
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
                                else {//usun z ZR tą kwestię
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
                    //Meteor.call('updateStatusKwestii', kwestia._id, KWESTIA_STATUS.ARCHIWALNA);
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

