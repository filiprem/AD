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
                        Meteor.call('removeKwestia', newPost.idKwestia,function(error){
                            if(!error){
                                var kwestia=Kwestia.findOne({_id:newPost.idKwestia});
                                if(kwestia.status==KWESTIA_STATUS.REALIZOWANA) {
                                    if (kwestia.idZespolRealizacyjny) {
                                        if (kwestia.idZespolRealizacyjny != null)
                                            manageZR(kwestia);
                                    }
                                }
                                else if(kwestia.status==KWESTIA_STATUS.DELIBEROWANA){
                                    var zr=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
                                    if(zr) {
                                        rewriteZRMembersToList(zr, kwestia);
                                    }
                                }
                                //akcesyjne nie mają buttonów "do arch" i "do kosza"???
                                //if(_.contains([KWESTIA_TYPE.ACCESS_HONOROWY,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],kwestia.typ)) {
                                //    var userDraft = UsersDraft.findOne({_id: kwestia.idUser});
                                //    if (userDraft) {
                                //        Meteor.call("sendApplicationRejected", userDraft, function (error, ret) {
                                //            (!error)
                                //            Meteor.call("removeUserDraft", userDraft._id);
                                //        });
                                //    }
                                //}
                            }
                        });
                        break;

                    case POSTS_TYPES.ARCHIWUM:
                        var kwestia = Kwestia.findOne({czyAktywny: true, _id: newPost.idKwestia});
                        //if(kwestia.status == KWESTIA_STATUS.REALIZOWANA) {
                        //    //Marzena:{
                        //    //tworze ZR draft z danych ZR,do tkorego kwestia nalezy i go dodaje
                        //    var ZR=ZespolRealizacyjny.findOne({_id:kwestia._id});
                        //    var newZRDraft={
                        //        nazwa:ZR.nazwa,
                        //        zespol:ZR.zespol,
                        //        idZR:ZR._id
                        //    };
                        //    Meteor.call('addZespolRealizacyjnyDraft',newZRDraft,function(error,ret){
                        //        if (error) {
                        //            if (typeof Errors === "undefined")
                        //                Log.error('Error: ' + error.reason);
                        //            else
                        //                throwError(error.reason);
                        //
                        //        }
                        //        else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
                        //            var idZRDraft=ret;
                        //            Meteor.call('updateStatIdZespolu', kwestia._id, KWESTIA_STATUS.ARCHIWALNA, idZRDraft,function(error){
                        //                if (error) {
                        //                    if (typeof Errors === "undefined")
                        //                        Log.error('Error: ' + error.reason);
                        //                    else
                        //                        throwError(error.reason);
                        //                }
                        //                else {//usun z ZR tą kwestię
                        //                    var ZRKwestietoUpdate=ZR.kwestie.slice();
                        //                    ZRKwestietoUpdate= _.without(ZRKwestietoUpdate,kwestia._id);
                        //                    Meteor.call('updateKwestieZR', kwestia._id, ZRKwestietoUpdate,function(error){
                        //                        if (error) {
                        //                            if (typeof Errors === "undefined")
                        //                                Log.error('Error: ' + error.reason);
                        //                        }
                        //                    });
                        //                }
                        //            });
                        //        }
                        //    });
                        //}
                        //else {
                        Meteor.call('updateStatusKwestii', newPost.idKwestia, KWESTIA_STATUS.ARCHIWALNA,function(error){
                            if(!error){

                            }
                        });
                        //}
                        break;

                    case POSTS_TYPES.ZREALIZOWANA:
                        console.log("kwestia realizowana->zrealizowana");

                        Meteor.call('updateStatusKwestii', newPost.idKwestia, KWESTIA_STATUS.ZREALIZOWANA,function(error){
                            if(!error){
                                var kwestia=Kwestia.findOne({_id:newPost.idKwestia});
                                if(kwestia.idZespolRealizacyjny){
                                    if(kwestia.idZespolRealizacyjny!=null)
                                        manageZR(kwestia);
                                }
                                if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY,KWESTIA_TYPE.ACCESS_HONOROWY],kwestia.typ)) {
                                    var userDraft = UsersDraft.findOne({_id: kwestia.idUser});

                                    console.log("contains");
                                    console.log(userDraft);
                                    //jezeli userDraft mial idUser=byl juz doradcą,to tylko zmieniamy user type,wysylamy powiadomienie email,updateuserDraft
                                    if(userDraft.profile.idUser!=null){//moze todotyczyc apliakcji istniejacego na czlonka lub honorowego
                                        var user=Users.findOne({_id:userDraft.profile.idUser});
                                        if(user){
                                            //sprawdzamy czy ten ,który aplikował jeszcze jest w systemie!czyAktywny==true
                                            //if(user.profile.czyAktywny==true) {
                                                //if (user.profile.userType == USERTYPE.DORADCA) {//sprawdzamy cz ten wcześniej nie aplikował i już ma zmienione
                                            var newUserFields=null;
                                            var text=null;
                                            if(kwestia.typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY) {
                                                newUserFields = {
                                                    address: userDraft.profile.address,
                                                    zip: userDraft.profile.zip,
                                                    language: userDraft.profile.language,
                                                    userType: userDraft.profile.userType,
                                                    rADking: 0,
                                                    pesel: userDraft.profile.pesel
                                                };
                                                text="rewriteFromDraftToUser";
                                            }
                                            else if(kwestia.typ==KWESTIA_TYPE.ACCESS_HONOROWY){
                                                newUserFields=userDraft.profile.userType;
                                                text="updateUserType";
                                            }
                                            Meteor.call(text,user._id,newUserFields,function(error){
                                                if(!error){
                                                    Meteor.call("removeUserDraft",userDraft._id,function(error){
                                                        if(!error){
                                                            addPowiadomienieAplikacjaRespondMethodPosts(kwestia._id,new Date(),NOTIFICATION_TYPE.APPLICATION_ACCEPTED,user._id);
                                                            Meteor.call("sendApplicationAccepted",userDraft,"acceptExisting",function(error){
                                                                if(error)
                                                                    console.log(error.reason);
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                    else {//zupełnie nowy członek systemu
                                        var activationLink = CryptoJS.MD5(userDraft._id).toString();
                                        if (userDraft) {
                                            Meteor.call("setZrealizowanyActivationHashUserDraft", userDraft._id, activationLink, true, function (error, ret) {
                                                (!error)
                                                {
                                                    Meteor.call("sendApplicationAccepted", UsersDraft.findOne({_id: userDraft._id}), "acceptNew", function (error) {
                                                        (!error)
                                                        Meteor.cal("updateLicznikKlikniec", userDraft._id, 0);
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            }
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
            if(kwestie.length==0 && zespolRealizacyjny._id!=ZespolRealizacyjny.findOne()._id){
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
            if(zespolRealizacyjny._id!=ZespolRealizacyjny.findOne()._id){
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

    addPowiadomienieAplikacjaRespondMethodPosts=function(idKwestia,dataWprowadzenia,typ,idReceiver){
        var newPowiadomienie ={
            idOdbiorca: idReceiver,
            idNadawca: null,
            dataWprowadzenia: dataWprowadzenia,
            tytul: "",
            powiadomienieTyp: typ,
            tresc: "",
            idKwestia:idKwestia,
            czyAktywny: true,
            czyOdczytany:false
        };
        Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
            if(error)
                console.log(error.reason);
        });
    };
});
