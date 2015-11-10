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

    kwestie.observe({
        changedAt: function(newKwestia, oldKwestia, atIndex) {
            console.log("kwestia observer weszło");
            var kworum = liczenieKworumZwykle();
            var usersCount = newKwestia.glosujacy.length;
            var ZRDraft=null;
            var zespolCount=null;
            if(newKwestia.idZespolRealizacyjny) {
                ZRDraft = ZespolRealizacyjnyDraft.findOne({_id: newKwestia.idZespolRealizacyjny});
                console.log("zr");
                console.log(newKwestia.idZespolRealizacyjny);
                if(ZRDraft)
                    zespolCount = ZRDraft.zespol.length;
                else {//to dla sytuacji,gdy observer wchodzi na zmiane kwestii glosowana->realizowana i wowczas juz jest zr!
                    ZRDraft = ZespolRealizacyjny.findOne({_id: newKwestia.idZespolRealizacyjny});
                    if(ZRDraft)
                        zespolCount = ZRDraft.zespol.length;
                    else
                        zespolCount=newKwestia.zespol.czlonkowie.length;
                }
            }
            //for global parameters(deliberowana->glosowanie) 2 conditions:wartoscPriorytetu>0,liczbaUsers>kworum
            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && newKwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE && newKwestia.status==KWESTIA_STATUS.ADMINISTROWANA) {
                console.log("global params change: adminitrowana->glosowana");
                moveKwestiaToGlosowana(newKwestia);
            }

            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && zespolCount >= 3 && newKwestia.status != KWESTIA_STATUS.REALIZOWANA){
                if(newKwestia.status == KWESTIA_STATUS.DELIBEROWANA){
                    console.log("basic: deliberowana->glosowana");
                    moveKwestiaToGlosowana(newKwestia);
                }
                else if(newKwestia.status==KWESTIA_STATUS.OSOBOWA && (newKwestia.typ==KWESTIA_TYPE.ACCESS_DORADCA || newKwestia.typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY)){
                    console.log("OSOBOWA(ACCESS)->GLOSOWANA");
                    moveKwestiaToGlosowana(newKwestia);
                }
                else if (newKwestia.status == KWESTIA_STATUS.STATUSOWA && newKwestia.typ==KWESTIA_TYPE.ACCESS_HONOROWY){
                    console.log("STATUSOWA(ACCESS HONOROWY)->OCZEKUJACA");
                    var userDraft=UsersDraft.findOne({_id:newKwestia.idUser});
                    var acceptInvitationLink = CryptoJS.MD5(userDraft._id).toString();
                    Meteor.call("setActivationHashUserDraft",userDraft._id,acceptInvitationLink,function(error){
                        if(!error){
                            Meteor.call('updateStatusDataOczekwianiaKwestii', newKwestia._id, KWESTIA_STATUS.OCZEKUJACA,new Date(),function(error){
                                if(error)
                                    console.log(error.reason);
                                else
                                    Meteor.call("sendEmailHonorowyInvitation", UsersDraft.findOne({_id:newKwestia.idUser}),"honorowyInvitation");
                            });
                        }
                    });
                }
                else if (newKwestia.status == KWESTIA_STATUS.OCZEKUJACA && newKwestia.typ==KWESTIA_TYPE.ACCESS_HONOROWY){//to finish
                    console.log("OCZEKUJĄCA (HONOROWY)->REALIZACJA");
                    console.log("to obsłużone w kodzie!");
                   if(newKwestia.isAnswerPositive==true){
                       //przepisz ZR
                       //te 2: jeśli zrealizowana:dopisz czlonka do userów
                       //drafta obsłuż
                       //kwestia realizacja
                   }
                    else{//drafta obsluz,przepisz ZR,kwestia do kosza

                   }
                }
            }

            if(newKwestia.status == KWESTIA_STATUS.REALIZOWANA && newKwestia.wartoscPriorytetuWRealizacji < (-newKwestia.wartoscPriorytetu)){
                console.log("gdy osiagnie minusowy priorytet: relizowana->kosz");
                Meteor.call('removeKwestia', newKwestia._id,function(error) {
                    if(!error) {
                        if (newKwestia.idZespolRealizacyjny) {
                            manageZR(newKwestia);
                        }
                        //jezeli osobowa,usun drafta i powiadomienie
                        
                        if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],newKwestia.typ)) {
                            var userDraft = UsersDraft.findOne({_id: newKwestia.idUser});
                            if (userDraft) {
                                Meteor.call("sendApplicationRejected", userDraft, function (error, ret) {
                                    (!error)
                                    Meteor.call("removeUserDraft", userDraft._id);
                                });
                            }
                        }
                    }
                    else
                        console.log(error.reason);
                });

            }

            // //jezeli kwestia idzie do zrealizowana,uwolinij hibernowane
            if(oldKwestia.status != newKwestia.status){
                console.log("zmiana statusu");
                if(oldKwestia.status == KWESTIA_STATUS.REALIZOWANA && (newKwestia.status == KWESTIA_STATUS.ZREALIZOWANA || newKwestia.status == KWESTIA_STATUS.ARCHIWALNA)){
                    unhibernateKwestieOpcje(newKwestia);
                }

                //sprawdzenie czy jakas kwestia opuściła głosowanie,jeśli tak,wpuść inne(zrealizowana dla param glob)
                if(oldKwestia.status == KWESTIA_STATUS.GLOSOWANA &&(newKwestia.status==KWESTIA_STATUS.ZREALIZOWANA || newKwestia.status==KWESTIA_STATUS.REALIZOWANA)){
                    console.log("hiere reakcja,bo zmiana glosowana-> realizowana");
                    console.log("hiere reakcja,bo zmiana glosowana-> zrealizowana");

                    var kwestie = Kwestia.find(
                        {   status: {
                            $in: [
                                KWESTIA_STATUS.DELIBEROWANA,
                                KWESTIA_STATUS.ADMINISTROWANA,
                                KWESTIA_STATUS.OSOBOWA
                            ]
                        }
                        },
                        {wartoscPriorytetu: {$gt: 0}},
                        {'glosujacy.length': {$gte: liczenieKworumZwykle()}},
                        {sort: {wartoscPriorytetu: -1}});

                    var arrayKwestie=[];
                    console.log("te kwestie");
                    console.log(kwestie.count());
                    var idParent=oldKwestia.idParent; //uwaga! jezeli kwestia,kotra poszla do realizacji miała idParent,to moze trzeba załadować wiecej
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

                    if(arrayKwestie.length>0) {//jezeli sa takowe spełniające warunki
                        arrayKwestie = _.sortBy(arrayKwestie, "wartoscPriorytetu");
                        arrayKwestie.reverse();
                        console.log(arrayKwestie);
                        console.log("sprawdzamy czy jest wiecej o tym prior");

                        //start new
                        var kwestieGlosowane=Kwestia.find({status:KWESTIA_STATUS.GLOSOWANA,czyAktywny:true});
                        var tab=null;
                        if(kwestieGlosowane.count()==0) {
                            console.log("moga wejsc  max 3");
                            console.log("ale wejdą ,bo tyle jest gotowych do głosowania "+arrayKwestie.length);
                            //tab = setInQueueToVote(arrayKwestie,3);
                            tab = setInQueueToVote(arrayKwestie,arrayKwestie.length);
                        }
                        else if(kwestieGlosowane.count()==1){
                            console.log("moga wejsc  max 2");
                            //var tab= _.first(setInQueueToVote(arrayKwestie,2),2);
                            console.log("ale wejdą ,bo tyle jest gotowych do głosowania "+arrayKwestie.length);
                            var tab= _.first(setInQueueToVote(arrayKwestie,arrayKwestie.length),2);
                        }
                        else{
                            console.log("moze wejsc max 1");
                            console.log("totez wejdzie jedna,tyle jest gotowych do głosowania: "+arrayKwestie.length);
                            //var tab= _.first(setInQueueToVote(arrayKwestie,1),1);
                            var tab= _.first(setInQueueToVote(arrayKwestie,1),1);
                        }
                        console.log("tablica");
                        console.log(tab);
                        _.each(tab,function(kwestiaId){
                            var kwestia=Kwestia.findOne({_id:kwestiaId});
                            if(kwestia){
                                if(kwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
                                    moveKwestiaToGlosowana(kwestia);
                                else {
                                    var zr = ZespolRealizacyjnyDraft.findOne({_id: arrayKwestie[0].idZespolRealizacyjny});
                                    moveKwestiaToGlosowana(kwestia);
                                }
                            }
                        });
                    }
                }
            }
            //jezeli kwestia idzie do kosza,uwolinij hibernowane
            if(oldKwestia.czyAktywny==true && oldKwestia.status==KWESTIA_STATUS.REALIZOWANA && newKwestia.czyAktywny==false){
                unhibernateKwestieOpcje(newKwestia);
            }
        }
    });

    kwestiaAllowedToGlosowana=function(){
        var allKwestieGlosowane=Kwestia.find({status:KWESTIA_STATUS.GLOSOWANA}).count();
        console.log("liczba kwestii");
        console.log(allKwestieGlosowane);
        return allKwestieGlosowane < 3 ? true : false;
    };
    changeParametersSuccessObserver=function(kwestia){//głosowana->zrealizowana
        var globalPramsDraft=ParametrDraft.findOne({czyAktywny:true});
        var obj={
            nazwaOrganizacji:globalPramsDraft.nazwaOrganizacji,
            terytorium:globalPramsDraft.terytorium,
            kontakty:globalPramsDraft.kontakty,
            regulamin: globalPramsDraft.regulamin,
            voteDuration: globalPramsDraft.voteDuration,
            voteQuantity:globalPramsDraft.voteQuantity,
            czasWyczekiwaniaKwestiiSpecjalnej:globalPramsDraft.czasWyczekiwaniaKwestiiSpecjalnej,
            addIssuePause:globalPramsDraft.addIssuePause,
            addCommentPause:globalPramsDraft.addCommentPause,
            addReferencePause:globalPramsDraft.addReferencePause
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
    moveKwestiaToGlosowana=function(newKwestia,ZRDraft,ifUpdateZR){//tu spirawdzic godziny. i warunek blokujacy wejscie kwestii do glosowania!
        if(kwestiaAllowedToGlosowana()) {//jezeli deliberowana vote w bosrverrze,gdy ta opuscila i wpuszczmy nowe- to obśługa zr musi by!
            var czasGlosowania = Parametr.findOne({}).voteDuration;
            var final = moment(new Date()).add(czasGlosowania, "hours").format();
            var start = new Date();
            console.log(newKwestia._id);
            console.log(final);
            console.log(start);
            Meteor.call('updateStatusDataGlosowaniaKwestiiFinal', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, final,start,function(error){
                if(error)
                    console.log(error.reason);
            });
        }
    };
    setInQueueToVote=function(kwestie,numberKwestieAvailable){
        var tab=[];
        var tabKwestie = [];
        kwestie.forEach(function (item) {
            tabKwestie.push(item);
        });
        console.log("tab kwestie");
        console.log(tabKwestie);
        //console.log("array with the same priority");
        var arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[0].wartoscPriorytetu});
        //console.log(arrayTheSameWartoscPrior.length);
        if (arrayTheSameWartoscPrior.length >= 3) {
            console.log("the same priority as first:>=3");
            var tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");


            if(numberKwestieAvailable==3) {
                tab=setTabValues(3,tabKwestieSort,tab);
            }
            else if(numberKwestieAvailable==2){
                tab=setTabValues(2,tabKwestieSort,tab);
            }
            else
                tab.push(tabKwestieSort[0]._id);
        }
        else if (arrayTheSameWartoscPrior.length == 2) {
            console.log("the same priority as first:2");
            var tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
            if(numberKwestieAvailable==3) {
                console.log("wezmiemy 3");
                tab.push(tabKwestieSort[0]._id);
                tab.push(tabKwestieSort[1]._id);
                //znajdz kolejny nizszy priorytet:usun z tablicy o tamtym priorytecie i posortuj na nowo
                tabKwestie = _.reject(tabKwestie, function (el) {
                    console.log(el.wartoscPriorytetu);
                    return el.wartoscPriorytetu == tabKwestieSort[0].wartoscPriorytetu
                });
                console.log("past values");
                console.log(tabKwestieSort[0].wartoscPriorytetu);
                //console.log(tabKwestie);
                tabKwestie = (_.sortBy(tabKwestie, "wartoscPriorytetu")).reverse();
                console.log(tabKwestie);
                arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[0].wartoscPriorytetu});
                //tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
                var tabKwestieSort2 = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
                tab.push(tabKwestieSort[0]._id);
            }
            else if(numberKwestieAvailable==2){
                console.log("wezmiemy 2");
                tab.push(tabKwestieSort[0]._id);
                tab.push(tabKwestieSort[1]._id);
            }
            else{
                console.log("wezmiemy 1");
                tab.push(tabKwestieSort[0]._id);
            }
        }
        else {//nie powtarzaja sie
            console.log("one priority");
            if(numberKwestieAvailable==3) {
                arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[1].wartoscPriorytetu});
                if (arrayTheSameWartoscPrior.length >= 2) {//jezeli 2 i 3 sie powtarzaja,to posortuj i wrzuć
                    tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
                    tab = setTabValues(numberKwestieAvailable, [tabKwestie[0]._id, tabKwestieSort[0]._id, tabKwestieSort[1]._id], tab);
                }
                else {//2 i 3 sa inne
                    tab = setTabValues(numberKwestieAvailable, [tabKwestie[0]._id, tabKwestie[1]._id, tabKwestie[2]._id], tab);
                }
            }
            else if(numberKwestieAvailable==2){
                console.log("wejda 2");
                console.log(tabKwestie[1].wartoscPriorytetu);
                arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[1].wartoscPriorytetu});
                console.log(arrayTheSameWartoscPrior);
                if (arrayTheSameWartoscPrior.length >= 2) {//jezeli 2 i 3 sie powtarzaja,to posortuj i wrzuć
                    tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
                    tab = setTabValues(numberKwestieAvailable, [tabKwestie[0]._id, tabKwestieSort[0]._id], tab);
                }
            }
            else{
                console.log("wejdzie 1");
                tab.push(tabKwestie[0]._id);
            }
        }
        return tab;
    };
    setTabValues=function(numberKwestieAvailable,tabKwestieSort,tab){
        for(var i=0;i<numberKwestieAvailable;i++){
            tab.push(tabKwestieSort[i]._id);
        }
        return tab;
    };
    rewriteZRMembersToList=function(zespolRealizacyjny,newKwestia){
        var czlonkowieZespolu = [];
        _.each(zespolRealizacyjny.zespol, function (idUser) {
            var user = Users.findOne({_id: idUser});
            czlonkowieZespolu.push(user.profile.firstName + " " + user.profile.lastName);
        });
        var obj={
            nazwa:zespolRealizacyjny.nazwa,
            czlonkowie:czlonkowieZespolu
        };
        Meteor.call("addConstZR", newKwestia._id, obj, function (error) {
            if (error)
                console.log(error);
        });
    };
    manageZR=function(newKwestia){
        var zespolRealizacyjny = ZespolRealizacyjny.findOne({_id: newKwestia.idZespolRealizacyjny});
        if (zespolRealizacyjny.kwestie.length > 0) {
            //wypisz mnie
            var kwestie = _.reject(zespolRealizacyjny.kwestie, function (kwestiaId) {
                return kwestiaId == newKwestia._id
            });
            console.log(kwestie);
            //jezeli bylem tylko ja,set false,o ile to nnie jestjest zr ds osób
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
    unhibernateKwestieOpcje=function(kwestia){
        console.log("realizowana->do jakakowliek (powrót opcji z hibernacji do realizacji");

        var kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: kwestia.idParent, status: KWESTIA_STATUS.HIBERNOWANA});
        kwestieOpcje.forEach(function (kwestiaOpcja){
                Meteor.call('updateStatusKwestii', kwestiaOpcja._id, KWESTIA_STATUS.DELIBEROWANA);
        });
    }
});
