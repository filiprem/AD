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

            if(kwestia!=null) {
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
        }
    });
});
