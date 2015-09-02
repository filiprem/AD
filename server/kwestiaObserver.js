/**
 * Created by Bart³omiej Szewczyk on 2015-08-31.

Badanie zmian kwestii w celu sprawdzenia czy kwestia powinna zmieniæ status z:
deliberowana na glosowana
glosowana na realizowana
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
                KWESTIA_STATUS.GLOSOWANA,
                KWESTIA_STATUS.STATUSOWA,
                KWESTIA_STATUS.OCZEKUJACA
            ]
        }
    });
    var postyPodKwestiami = Posts.find({czyAktywny: true, postType: "deliberacja"});

    kwestie.observe({
        changedAt: function(newKwestia, oldKwestia, atIndex) {

            var kworum = liczenieKworumZwykle();
            var usersCount = newKwestia.glosujacy.length;
            //Trzeba bêdzie wzi¹æ jeszcze pod uwagê zespó³ realizacyjny ale Marzena go teraz modernizuje wiêc do zrobienia!!!
            //var zespolyRealizacyjne = ZespolRealizacyjny.find({idKwestia: newKwestia._id})

            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum){

                if(newKwestia.status == KWESTIA_STATUS.DELIBEROWANA){

                    var czasGlosowania = Rodzaj.find({_id: newKwestia.idRodzaj}).czasGlosowania;
                    newKwestia.dataGlosowania = new Date().addHours(czasGlosowania);
                    Meteor.call('updateStatusDataGlosowaniaKwestii', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, newKwestia.dataGlosowania);
                }
                else if (newKwestia.status == KWESTIA_STATUS.GLOSOWANA && new Date() > newKwestia.dataGlosowania){

                    newKwestia.dataRealizacji = new Date();
                    newKwestia.numerUchwaly = nadawanieNumeruUchwaly(newKwestia.dataRealizacji);
                    Meteor.call('updateStatNrUchwDtRealKwestii', newKwestia._id, KWESTIA_STATUS.REALIZOWANA, newKwestia.numerUchwaly, newKwestia.dataRealizacji);
                }
                else if (newKwestia.status == KWESTIA_STATUS.STATUSOWA){

                    Meteor.call('updateStatusKwestii', newKwestia._id, KWESTIA_STATUS.OCZEKUJACA);
                }
                else if (newKwestia.status == KWESTIA_STATUS.OCZEKUJACA){

                    newKwestia.dataRealizacji = new Date();
                    newKwestia.numerUchwaly = nadawanieNumeruUchwaly(newKwestia.dataRealizacji);
                    Meteor.call('updateStatNrUchwDtRealKwestii', newKwestia._id, KWESTIA_STATUS.REALIZOWANA, newKwestia.numerUchwaly, newKwestia.dataRealizacji);
                }
            }

        }
    });

    postyPodKwestiami.observe({
       changedAt: function(newPost, oldPost, atIndex) {

           var kworum = liczenieKworumZwykle();
           var usersCount = newPost.glosujacy.length;
           var kwestiaArchiwalna = Kwestia.find({_id: newPost.idKwestia});

           if(newPost.wartoscPriorytetu > 0 && usersCount >= kworum && kwestiaArchiwalna.status == KWESTIA_STATUS.ARCHIWALNA) {

               Meteor.call('updateStatusKwestii', newPost.idKwestia, KWESTIA_STATUS.DELIBEROWANA);
           }
       }
    });
});

nadawanieNumeruUchwaly = function(dataRealizacji) {

    var numerUchw = 1;

    var kwestieRealizowane = Kwestia.find({numerUchwaly: !null});
    kwestieRealizowane.forEach(function (kwestiaRealizowana) {

        if(kwestiaRealizowana.dataRealizacji.toDateString() == dataRealizacji.toDateString())
            numerUchw++
    });

    return numerUchw;
};