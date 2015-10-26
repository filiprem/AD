/**
 * Created by Bartłomiej Szewczyk on 2015-08-31.

Badanie zmian w postach, zespołach i kwestii w celu sprawdzenia czy kwestia powinna zmienić status z:
 deliberowana na glosowana
 glosowana na realizowana
 glosowana na archiwalna
 statusowa na oczekująca
 oczekująca na realizowana
 archiwalna na deliberowana
 */

Meteor.startup(function(){
    var kwestie = Kwestia.find({
        czyAktywny: true,
        status: {
            $in: [
                KWESTIA_STATUS.DELIBEROWANA,
                KWESTIA_STATUS.STATUSOWA,
                KWESTIA_STATUS.REALIZOWANA,
                KWESTIA_STATUS.ADMINISTROWANA
            ]
        }
    });
    var postyPodKwestiami = Posts.find({czyAktywny: true});
    var zespoly = ZespolRealizacyjnyDraft.find({});

    kwestie.observe({
        changedAt: function(newKwestia, oldKwestia, atIndex) {
            var kworum = liczenieKworumZwykle();
            var usersCount = newKwestia.glosujacy.length;
            var ZRDraft=null;
            var zespolCount=null;
            if(newKwestia.idZespolRealizacyjny) {
                ZRDraft = ZespolRealizacyjnyDraft.findOne({_id: newKwestia.idZespolRealizacyjny});
                zespolCount = ZRDraft.zespol.length;
            }
            //for global parameters(deliberowana->glosowanie) 2 conditions:wartoscPriorytetu>0,liczbaUsers>kworum
            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && newKwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {
                var globalParam=Parametr.findOne();
                var czasGlosowania = globalParam.voteDuration;
                var final = moment(new Date()).add(1,"hours").format();
                var start=new Date();
                console.log(start);
                console.log(final);
                Meteor.call("updateStatusDataGlosowaniaKwestiiFinal",newKwestia._id,KWESTIA_STATUS.GLOSOWANA,final,start);
            }

            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && zespolCount >= 3 && newKwestia.status != KWESTIA_STATUS.REALIZOWANA){

                if(newKwestia.status == KWESTIA_STATUS.DELIBEROWANA){
                    console.log("zmiana na glosowana");
                    var czasGlosowania = Parametr.findOne({}).voteDuration;
                    newKwestia.dataGlosowania = new Date().addHours(czasGlosowania);
                    Meteor.call('updateStatusDataGlosowaniaKwestii', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, newKwestia.dataGlosowania);
                    //przepisz zespoly
                    var idZR=ZRDraft.idZR;
                    if(idZR){
                        if(idZR!=null){
                            var zr=ZespolRealizacyjny.findOne({_id:idZR});
                            if(zr){
                                var kwestie=zr.kwestie.slice();
                                kwestie.push(newKwestia._id);
                                Meteor.call("updateListKwesti",zr._id,kwestie,function (error, ret) {
                                    if(!error)
                                        Meteor.call("removeZespolRealizacyjnyDraft",ZRDraft);
                                });
                            }
                        }
                        else{//to nowy zespoł
                            var kwestie=[];
                            kwestie.push(newKwestia._id);
                            var zr={
                                nazwa: ZRDraft.nazwa,
                                zespol:ZRDraft.zespol,
                                kwestie:kwestie,
                                czyAktywny:true
                            };
                            Meteor.call("addZespolRealizacyjny",zr,function (error, ret) {
                                if(!error)
                                    Meteor.call("removeZespolRealizacyjnyDraft",ZRDraft);
                            });

                        }
                    }
                }
                else if (newKwestia.status == KWESTIA_STATUS.STATUSOWA){

                    //Meteor.call('updateStatusKwestii', newKwestia._id, KWESTIA_STATUS.OCZEKUJACA);
                    Meteor.call('updateStatusDataOczekwianiaKwestii', newKwestia._id, KWESTIA_STATUS.OCZEKUJACA,new Date());

                    Meteor.call("sendEmailHonorowyInvitation", newKwestia.idZgloszonego);
                }
                //else if (newKwestia.status == KWESTIA_STATUS.ADMINISTROWANA){//to finish
                //    newKwestia.dataGlosowania = new Date().addHours(24);
                //    Meteor.call('updateStatusDataGlosowaniaKwestii', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, newKwestia.dataGlosowania);
                //}
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

                       //Meteor.call('updateStatusKwestii', kwestia._id, KWESTIA_STATUS.OCZEKUJACA);
                        Meteor.call('updateStatusDataOczekwianiaKwestii', kwestia._id, KWESTIA_STATUS.OCZEKUJACA,new Date());

                        Meteor.call("sendEmailHonorowyInvitation", kwestia.idZgloszonego);
                    }
                }
            }
        }
    });
});
