/**
 * Created by Bartłomiej Szewczyk on 2015-08-31.

 Badanie zmian w postach w celu sprawdzenia czy kwestia powinna zmienić ccoś:
 jezeli w dodanym poscie "do archwium","do kosza","zrealizowana", spełni warunki:
 kworum>=l.uzytk && wartPrior>0, to
 obłsużone i sprawdzone:
 realizacja->kosz
 realizacja->zrealizowana
 */

Meteor.startup(function(){
    var kwestie = Kwestia.find({
        //czyAktywny: true,
        status: {
            $in: [
                KWESTIA_STATUS.DELIBEROWANA,
                KWESTIA_STATUS.GLOSOWANA,
                KWESTIA_STATUS.STATUSOWA,
                KWESTIA_STATUS.REALIZOWANA,
                KWESTIA_STATUS.ADMINISTROWANA,
                KWESTIA_STATUS.ZREALIZOWANA,
                KWESTIA_STATUS.OSOBOWA
            ]
        }
    });
    var postyPodKwestiami = Posts.find({czyAktywny: true});
    var zespoly = ZespolRealizacyjnyDraft.find({});

    postyPodKwestiami.observe({
        changedAt: function(newPost, oldPost, atIndex) {
            console.log("posty pod kwestiami observer");
            var kworum = liczenieKworumZwykle();
            console.log("wymagane kworum");
            console.log(kworum);
            var usersCount = newPost.glosujacy.length;
            if(newPost.wartoscPriorytetu > 0 && usersCount >= kworum) {
                switch(newPost.postType){

                    case POSTS_TYPES.DELIBERACJA:
                        Meteor.call('updateStatusDataGlosowaniaKwestii', newPost.idKwestia, KWESTIA_STATUS.DELIBEROWANA, null);
                        break;

                    case POSTS_TYPES.KOSZ:
                        console.log("kwestia realizowana->kosz(bo post)");
                        Meteor.call('removeKwestiaSetReason', newPost.idKwestia,KWESTIA_ACTION.SPECIAL_COMMENT_BIN,function(error){
                            if(!error){
                                var kwestia=Kwestia.findOne({_id:newPost.idKwestia});

                                if(kwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){//deliberowana,glosowana
                                    Meteor.call("setActivityParametrDraft",kwestia.idParametr,false);
                                    if(kwestia.status==KWESTIA_STATUS.ZREALIZOWANA){//TODO

                                    }
                                }
                                if(kwestia.status==KWESTIA_STATUS.REALIZOWANA || kwestia.status==KWESTIA_STATUS.ZREALIZOWANA) {
                                    if (kwestia.idZespolRealizacyjny) {
                                        if (kwestia.idZespolRealizacyjny != null)
                                            manageZR(kwestia);
                                    }
                                }
                                else if((kwestia.status==KWESTIA_STATUS.DELIBEROWANA || kwestia.status==KWESTIA_STATUS.OSOBOWA) && kwestia.typ!=KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){//osobowa,parametry,
                                    var zr=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
                                    if(zr) {
                                        rewriteZRMembersToList(zr, kwestia);
                                    }
                                }
                            }
                        });
                        break;

                    case POSTS_TYPES.ARCHIWUM:
                        console.log("kwestia realizowana->Archiwum(bo post)");
                        var kwestia=Kwestia.findOne({_id:newPost.idKwestia});
                        Meteor.call('updateStatusKwestii', newPost.idKwestia,KWESTIA_STATUS.ARCHIWALNA,function(error){
                            if(!error){//poprzedni status
                                if(kwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){//administrowana,glosowana
                                    Meteor.call("setActivityParametrDraft",kwestia.idParametr,false);
                                    if(kwestia.status==KWESTIA_STATUS.ZREALIZOWANA){//TODO

                                    }
                                }
                                //TODO
                                if((kwestia.status==KWESTIA_STATUS.REALIZOWANA || kwestia.status==KWESTIA_STATUS.ZREALIZOWANA) && kwestia.typ!=KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {//osobowa+powiad?
                                    if (kwestia.idZespolRealizacyjny) {
                                        if (kwestia.idZespolRealizacyjny != null)
                                            manageZR(kwestia);
                                    }
                                }
                                else if((kwestia.status==KWESTIA_STATUS.DELIBEROWANA || kwestia.status==KWESTIA_STATUS.OSOBOWA) && kwestia.typ!=KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){//osobowa,parametry,
                                    var zr=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
                                    if(zr) {
                                        rewriteZRMembersToList(zr, kwestia);
                                    }
                                }
                            }
                            else throwError(error.reason);

                        });
                        break;
                }
            }
            else{
                //obsluga gdy, komentarz specjalny nie spełni kworum i prior
                //gdy "zrealizowana"->kosz
                //gdy "kosz","do archiwum"->nic?
            }
        }
    });

    manageZR=function(newKwestia){
        var zespolRealizacyjny = ZespolRealizacyjny.findOne({_id: newKwestia.idZespolRealizacyjny});
        if (zespolRealizacyjny.kwestie.length > 0) {
            //wypisz mnie
            var kwestie = _.reject(zespolRealizacyjny.kwestie, function (kwestiaId) {
                return kwestiaId == newKwestia._id
            });
            console.log(kwestie);
            //jezeli bylem tylko ja,set false,o ile to jest zr ds osób
            if(kwestie.length==0 && zespolRealizacyjny._id!=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"})._id){
                Meteor.call("updateKwestieZRChangeActivity", zespolRealizacyjny._id, kwestie,false, function (error) {
                    if (error)
                        console.log(error.reason);
                    else
                        rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
                });
            }
            else {
                Meteor.call("updateKwestieZR", zespolRealizacyjny._id, kwestie, function (error) {
                    if (error)
                        console.log(error.reason);
                    else
                        rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
                });
            }
        }
        else {//jezeli nie ma zadnych kwestii,ustaw na false, o ile
            console.log("delete zespol");
            if(zespolRealizacyjny._id!=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"})._id){
                Meteor.call('removeZespolRealizacyjny', zespolRealizacyjny._id, function (error) {
                    if (error)
                        console.log(error.reason);
                    else
                        rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
                });
            }
            else
                rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
        }
    };

    addPowiadomienieAplikacjaRespondMethodPosts=function(idKwestia,dataWprowadzenia,typ,idReceiver,zespol){
        var newPowiadomienie ={
            idOdbiorca: idReceiver,
            idNadawca: null,
            dataWprowadzenia: dataWprowadzenia,
            tytul: "",
            powiadomienieTyp: typ,
            tresc: "",
            idKwestia:idKwestia,
            czyAktywny: true,
            czyOdczytany:false,
            zespol:zespol
        };
        Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
            if(error)
                console.log(error.reason);
        });
    };
});
