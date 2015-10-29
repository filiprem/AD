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
                KWESTIA_STATUS.GLOSOWANA,
                KWESTIA_STATUS.STATUSOWA,
                KWESTIA_STATUS.REALIZOWANA,
                KWESTIA_STATUS.ADMINISTROWANA,
                KWESTIA_STATUS.ZREALIZOWANA
            ]
        }
    });
    var postyPodKwestiami = Posts.find({czyAktywny: true});
    var zespoly = ZespolRealizacyjnyDraft.find({});

    kwestie.observe({
        changedAt: function(newKwestia, oldKwestia, atIndex) {
            console.log("kwestia observer weszło");
            var kworum = liczenieKworumZwykle();
            var usersCount = newKwestia.glosujacy.length;
            var ZRDraft=null;
            var zespolCount=null;
            if(newKwestia.idZespolRealizacyjny) {
                ZRDraft = ZespolRealizacyjnyDraft.findOne({_id: newKwestia.idZespolRealizacyjny});
                if(ZRDraft)
                    zespolCount = ZRDraft.zespol.length;
                else {//to dla sytuacji,gdy observer wchodzi na zmiane kwestii glosowana->realizowana i wowczas juz jest zr!
                    ZRDraft = ZespolRealizacyjny.findOne({_id: newKwestia.idZespolRealizacyjny});
                    zespolCount = ZRDraft.zespol.length;
                }
            }
            //for global parameters(deliberowana->glosowanie) 2 conditions:wartoscPriorytetu>0,liczbaUsers>kworum
            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && newKwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE && newKwestia.status==KWESTIA_STATUS.ADMINISTROWANA) {
                console.log("global params change: adminitrowana->glosowana");
                globalParamChangeVote(newKwestia);
            }

            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && zespolCount >= 3 && newKwestia.status != KWESTIA_STATUS.REALIZOWANA){
                if(newKwestia.status == KWESTIA_STATUS.DELIBEROWANA){
                    console.log("basic: deliberowana->glosowana");
                    deliberowanaVote(newKwestia,ZRDraft);
                }
                else if (newKwestia.status == KWESTIA_STATUS.STATUSOWA){
                    console.log("basic: deliberowana?->statusowa");
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
                console.log("gdy osiagnie minusowy priorytet: relizowana->kosz");
                Meteor.call('removeKwestia', newKwestia._id);
            }

            // uaktywnienie z hibernacji w przypadku degradacji innej kwesti-opcji z Realizacji
            if(oldKwestia.status != newKwestia.status){
                console.log("zmiana statusu");
                if(oldKwestia.status == KWESTIA_STATUS.REALIZOWANA && (newKwestia.status != KWESTIA_STATUS.ZREALIZOWANA)){
                    console.log("realizowana->zrealizowana");
                    if(newKwestia.idParent!=newKwestia._id) {

                        kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: kwestia.idParent, status: KWESTIA_STATUS.HIBERNOWANA});
                        kwestieOpcje.forEach(function (kwestiaOpcja){

                            if(kwestiaOpcja.idParent!=kwestiaOpcja._id && kwestiaOpcja._id!=newKwestia._id){

                                Meteor.call('updateStatusKwestii', kwestiaOpcja._id, KWESTIA_STATUS.DELIBEROWANA);
                            }
                        });
                    }
                }
                //sprawdzenie czy jakas kwestia opuściła głosowanie,jeśli tak,wpuść inne
                if(oldKwestia.status == KWESTIA_STATUS.GLOSOWANA &&(newKwestia.status==KWESTIA_STATUS.ZREALIZOWANA || newKwestia.status==KWESTIA_STATUS.REALIZOWANA)){
                    console.log("hiere reakcja,bo zmiana glosowana-> realizowana");
                    console.log("hiere reakcja,bo zmiana glosowana-> zrealizowana");

                    var kwestie = Kwestia.find(
                        {   status: {
                            $in: [
                                KWESTIA_STATUS.DELIBEROWANA,
                                KWESTIA_STATUS.ADMINISTROWANA
                            ]
                        }
                        },
                        {wartoscPriorytetu: {$gt: 0}},
                        {'glosujacy.length': {$gte: liczenieKworumZwykle()}},
                        {sort: {wartoscPriorytetu: -1}});

                    var arrayKwestie=[];
                    console.log("te kwestie");
                    console.log(kwestie.count());
                    var idParent=oldKwestia.idParent; //uwaga! jezeli kwestia,kotra poszla do realizacji miała idParent,to one nie idą
                    kwestie.forEach(function (kwestia) {
                        if (kwestia.idZespolRealizacyjny) {
                            var zespol = ZespolRealizacyjny.findOne({_id: kwestia.idZespolRealizacyjny});
                            if (!zespol) {
                                zespol = ZespolRealizacyjnyDraft.findOne({_id: kwestia.idZespolRealizacyjny});
                            }
                            console.log(zespol);
                            if (zespol.zespol.length >= 3)
                                arrayKwestie.push(kwestia);
                        }
                        else
                            arrayKwestie.push(kwestia);
                    });

                    if(arrayKwestie.length>0) {
                        arrayKwestie = _.sortBy(arrayKwestie, "wartoscPriorytetu");
                        arrayKwestie.reverse();
                        console.log(arrayKwestie);
                        console.log("sprawdzamy czy jest wiecej o tym prior");
                        //sprawdzamy czy jest wiecej kwestii o tym samym priorytecie,jesli tak, to przepisz do tablicy
                        //kwestii chetnych do glosowania tylko te,ktore maja taki sam priorytet
                        //i posortuj po dacie.wez pierwsza,czyli z najstarsza data
                        var arrayTheSameWartoscPrior = _.where(arrayKwestie, {'wartoscPriorytetu': arrayKwestie[0].wartoscPriorytetu});
                        if (arrayTheSameWartoscPrior > 0) {
                            console.log('jest wiecej o tym samym priorytecie');
                            console.log(arrayTheSameWartoscPrior.count());
                            arrayKwestie = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
                            console.log(arrayKwestie[0]);
                        }
                        //if (!idParent) {
                            if (arrayKwestie[0].typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
                                globalParamChangeVote(arrayKwestie[0]);
                            else {
                                var zr = ZespolRealizacyjnyDraft.findOne({_id: arrayKwestie[0].idZespolRealizacyjny});
                                deliberowanaVote(arrayKwestie[0], zr);
                            }
                        //}
                        //else {
                        //    console.log("jest id parent");
                        //    //is it needed?
                        //    var arrayWithIdParent = _.where(arrayKwestie, {'idParent': idParent});
                        //    console.log("tablica z idParent");
                        //    console.log(arrayWithIdParent);
                        //    //arrayKwestie.pop();
                        //    //arrayKwestie.pop()
                        //}
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
            console.log("weszlo w zespoly change");
            var kworum = liczenieKworumZwykle();
            var kwestia = Kwestia.findOne({czyAktywny: true, idZespolRealizacyjny: newZespol._id});
            //var ZRDraft=null;
            //if(kwestia.idZespolRealizacyjny) {
            //    ZRDraft = ZespolRealizacyjnyDraft.findOne({_id: newKwestia.idZespolRealizacyjny});
            //    zespolCount = ZRDraft.zespol.length;
            //}
            if (kwestia != null) {
                if(kwestia.wartoscPriorytetu > 0 && newZespol.zespol.length >= kworum && kwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {
                    globalParamChangeVote(kwestia);
                }

                if(kwestia.wartoscPriorytetu > 0 && kwestia.glosujacy.length >= kworum && newZespol.zespol.length >= 3 && kwestia.status != KWESTIA_STATUS.REALIZOWANA){
                    console.log("tu weszlo");
                    if(kwestia.status == KWESTIA_STATUS.DELIBEROWANA){
                        console.log("tu weszło 2");
                        deliberowanaVote(kwestia,newZespol);
                    }
                    else if (kwestia.status == KWESTIA_STATUS.STATUSOWA){

                        Meteor.call('updateStatusDataOczekwianiaKwestii', newKwestia._id, KWESTIA_STATUS.OCZEKUJACA,new Date());

                        Meteor.call("sendEmailHonorowyInvitation", newKwestia.idZgloszonego);
                    }
                }


                //if (kwestia.wartoscPriorytetu > 0 && kwestia.glosujacy.length >= kworum && newZespol.zespol.length >= 3) {
                //
                //    if (kwestia.status == KWESTIA_STATUS.DELIBEROWANA) {
                //        console.log("tu sie wykonało!");
                //        var czasGlosowania = Rodzaj.findOne({_id: kwestia.idRodzaj}).czasGlosowania;
                //        kwestia.dataGlosowania = new Date().addHours(czasGlosowania);
                //        Meteor.call('updateStatusDataGlosowaniaKwestii', kwestia._id, KWESTIA_STATUS.GLOSOWANA, kwestia.dataGlosowania);
                //    }
                //    else if (kwestia.status == KWESTIA_STATUS.STATUSOWA) {
                //
                //        //Meteor.call('updateStatusKwestii', kwestia._id, KWESTIA_STATUS.OCZEKUJACA);
                //        Meteor.call('updateStatusDataOczekwianiaKwestii', kwestia._id, KWESTIA_STATUS.OCZEKUJACA, new Date());
                //
                //        Meteor.call("sendEmailHonorowyInvitation", kwestia.idZgloszonego);
                //    }
                //}
            }
        }
    });
    kwestiaAllowedToGlosowana=function(){
        var allKwestieGlosowane=Kwestia.find({status:KWESTIA_STATUS.GLOSOWANA}).count();
        console.log("liczba kwestii");
        console.log(allKwestieGlosowane);
        return allKwestieGlosowane < 3 ? true : false;
    };
    globalParamChangeVote=function(newKwestia){
        if(kwestiaAllowedToGlosowana()) {
            var globalParam = Parametr.findOne();
            var czasGlosowania = globalParam.voteDuration;
            var final = moment(new Date()).add(czasGlosowania, "hours").format();
            var start = new Date();
            Meteor.call("updateStatusDataGlosowaniaKwestiiFinal", newKwestia._id, KWESTIA_STATUS.GLOSOWANA, final, start);
        }
    };
    deliberowanaVote=function(newKwestia,ZRDraft){//tu spirawdzic godziny. i warunek blokujacy wejscie kwestii do glosowania!
        if(kwestiaAllowedToGlosowana()) {
            var czasGlosowania = Parametr.findOne({}).voteDuration;
            var final = moment(new Date()).add(czasGlosowania, "hours").format();
            var start = new Date();
            console.log(final);
            console.log(start);
            Meteor.call('updateStatusDataGlosowaniaKwestiiFinal', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, final,start);
            //przepisz zespoly
            var idZR = ZRDraft.idZR;
            if (idZR) {
                if (idZR != null) {
                    var zr = ZespolRealizacyjny.findOne({_id: idZR});
                    if (zr) {
                        var kwestie = zr.kwestie.slice();
                        kwestie.push(newKwestia._id);
                        Meteor.call("updateListKwesti", zr._id, kwestie, function (error, ret) {
                            if (!error)
                                Meteor.call("removeZespolRealizacyjnyDraft", ZRDraft);
                        });
                    }
                }
                else {//to nowy zespoł
                    var kwestie = [];
                    kwestie.push(newKwestia._id);
                    var zr = {
                        nazwa: ZRDraft.nazwa,
                        zespol: ZRDraft.zespol,
                        kwestie: kwestie,
                        czyAktywny: true
                    };
                    Meteor.call("addZespolRealizacyjny", zr, function (error, ret) {
                        if (!error)
                            Meteor.call("removeZespolRealizacyjnyDraft", ZRDraft);
                    });

                }
            }
        }
    };
});
