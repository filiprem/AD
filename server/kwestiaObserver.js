/**
 * Created by Bart³omiej Szewczyk on 2015-08-31.

Badanie zmian w postach, zespo³ach i kwestii w celu sprawdzenia czy kwestia powinna zmieniæ status z:
 deliberowana na glosowana
 glosowana na realizowana
 glosowana na archiwalna
 statusowa na oczekuj¹ca
 oczekuj¹ca na realizowana
 archiwalna na deliberowana
 */

Meteor.startup(function(){
    var kwestie = Kwestia.find({
        czyAktywny: true,
        status: {
            $in: [
                KWESTIA_STATUS.DELIBEROWANA,
                KWESTIA_STATUS.STATUSOWA
            ]
        }
    });
    var postyPodKwestiami = Posts.find({czyAktywny: true});
    var zespoly = ZespolRealizacyjny.find({});

    kwestie.observe({
        changedAt: function(newKwestia, oldKwestia, atIndex) {

            var kworum = liczenieKworumZwykle();
            var usersCount = newKwestia.glosujacy.length;
            var zespolCount = ZespolRealizacyjny.findOne({_id: newKwestia.idZespolRealizacyjny}).zespol.length;

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

//Nadawanie numeru uchwa³y - dla kwesti które przechodz¹ do realizacji, ka¿dego dnia numery id¹ od 1
nadawanieNumeruUchwaly = function(dataRealizacji) {

    var numerUchw = 1;
    var kwestieRealizowane = Kwestia.find({czyAktywny: true, numerUchwaly: !null});

    kwestieRealizowane.forEach(function (kwestiaRealizowana) {

        if(kwestiaRealizowana.dataRealizacji.toDateString() == dataRealizacji.toDateString())
            numerUchw++
    });

    return numerUchw;
};

//Wywo³anie tej metody jest w Cronie
//Sprawdzanie dat dla g³osowania oraz dla kwestii oczekuj¹cych
//oczekuj¹ce do zrobienia - potrzebne dodanie do bazy jakiejœ daty kiedy kwestia przesz³a na oczekuj¹c¹
//i wtedy dodawaæ 30 dni (taki jest termin) lub odrazu zapisywaæ termin wygaœniecia kwesti oczekuj¹cej.
sprawdzanieDat = function() {

    var actualDate = new Date();
    var kwestie = Kwestia.find({czyAktywny: true, status: {$in: [KWESTIA_STATUS.GLOSOWANA, KWESTIA_STATUS.OCZEKUJACA]}});
    var pktZaUdzialWZesp = Parametr.findOne({}).pktUdzialWZespoleRealizacyjnym;

    kwestie.forEach(function (kwestia) {


        if(kwestia.status == KWESTIA_STATUS.GLOSOWANA) {

            if(actualDate >= kwestia.dataGlosowania){
                if(kwestia.wartoscPriorytetu>0) {

                    awansUzytkownika(kwestia.idZespolRealizacyjny, pktZaUdzialWZesp);
                    kwestia.dataRealizacji = new Date();
                    kwestia.numerUchwaly = nadawanieNumeruUchwaly(kwestia.dataRealizacji);
                    Meteor.call('updateStatNrUchwDtRealKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji);
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
        var uzytkownikAwansujacy = users.findOne({_id: idUzytkownikaZespolu});
        uzytkownikAwansujacy.profile.rADking += pktZaUdzialWZesp;
        Meteor.call('updateUserRanking',idUzytkownikaZespolu, uzytkownikAwansujacy.profile.rADking);
    });
};