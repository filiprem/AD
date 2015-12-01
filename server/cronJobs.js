/**
 * Created by Bartłomiej Szewczyk on 2015-09-10.
 */

//START CRONA
SyncedCron.start();

//USTAWIENIA CRONA do sprawdzania głosowanych kwestii - co minute
SyncedCron.add({
    name: 'checking dates crone',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 30 seconds');
    },
    job: function() {
        return checkingEndOfVote();
    }
});

SyncedCron.add({
    name: 'checking RR',
    schedule: function(parser) {
        // parser is a later.parse object
        var RRFrequency = Parametr.findOne({}).okresSkladaniaRR;
        //return parser.text('every '+ voteFreq + ' day'); domyslnie bedzie w dniach?
        return parser.text('every 20 minutes');
        //return parser.text('every '+ RRFrequency + ' minute');
    },
    job: function() {
        return checkingRRExist();
    }
});

SyncedCron.add({
    name: 'checking if deliberation expired',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 day');
    },
    job: function() {
        return checkingDeliberationExpiration();
    }
});


//==================================== wywoływane metody ======================================================//

//Sprawdzanie dat dla głosowania oraz dla kwestii oczekujących
//oczekujące do zrobienia - potrzebne dodanie do bazy jakiejś daty kiedy kwestia przeszła na oczekującą
//i wtedy dodawać 30 dni (taki jest termin) lub odrazu zapisywać termin wygaśniecia kwesti oczekującej.

//sprawdzanie kiedy koniec glosowania i dopowiednie dzzialania-realizacja lub kosz lub sth else
checkingRRExist=function(){
    console.log("checking rr exists");
    var kwestie=Kwestia.find({
        czyAktywny:true,
        status:{$in:[KWESTIA_STATUS.ZREALIZOWANA,KWESTIA_STATUS.REALIZOWANA]},
        typ:{$nin:[KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE]}});
    kwestie.forEach(function(kwestia){
    //moment(new Date()).add(Parametr.findOne().okresSkladaniaRR,"minutes").format()
       //var nextCheck= _.last(kwestia.listaDatRR);
        var initial=_.last(kwestia.listaDatRR);
        var nextCheck= moment(initial).add(Parametr.findOne().okresSkladaniaRR,"minutes").format();
        var currentTime=moment(new Date()).format();
        console.log("Daty miedzy którymi musi pojawić się raport");
        console.log(initial);
        console.log(nextCheck);
        console.log("Obecna godzina");
        console.log(currentTime);
       if(nextCheck<=currentTime){
           //sprawdzamy czy jest raport-jeśli jest,to git, jeśli nie-powiad
           var raporty=Raport.find({idKwestia:kwestia._id,
               dataUtworzenia: {
                   $gte: initial,
               }},{sort:{dataWprowadzenia:-1}});

           if(raporty.count()==0) {
                console.log("brak raportów");
               Meteor.call("sendEmailNoRealizationReport", kwestia._id, function (error) {
                   if (error)
                       console.log(error.reason);
               });
               var users = Users.find({'profile.userType': USERTYPE.CZLONEK});
               users.forEach(function (user) {
                   //dodaj!-wybranie z zespolu tych czlonkow,którzy czyAtywny==true
                   var zr = ZespolRealizacyjny.findOne({_id: kwestia.idZespolRealizacyjny});
                   addPowiadomienieAplikacjaRespondMethodPosts(kwestia._id, new Date(), NOTIFICATION_TYPE.LACK_OF_REALIZATION_REPORT, user._id, zr.zespol);
               });
           }
           else console.log("jest raport ->git");
           var array=kwestia.listaDatRR;
           array.push(currentTime);
           Meteor.call("updateDeadlineNextRR",kwestia._id,array,function(error){
              if(!error){
              }
           });
       }
    });
    //var kwestie=Kwestia.find({czyAktywny:true,status:{$in:[KWESTIA_STATUS.ZREALIZOWANA,KWESTIA_STATUS.REALIZOWANA]},typ:{$nin:[KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE]}});
    //console.log("liczba kwestii:"+kwestie.count());
    //kwestie.forEach(function(kwestia){
    //    var param=Parametr.findOne().okresSkladaniaRR;
    //    var timeNow=moment(new Date()).format();
    //    //w previousCheck- ustwienia zgodnie z param glob domyślnymi ma być! czylo sub -days
    //    var previousCheck=moment(new Date()).subtract(param,"minutes").format();
    //    console.log("time now");
    //    console.log(timeNow);
    //    console.log("previous check");
    //    console.log(previousCheck);
    //    console.log(Raport.find({idKwestia:kwestia._id}).count());
    //    var raporty=Raport.find({idKwestia:kwestia._id,
    //        dataWprowadzenia: {
    //            $gte: previousCheck,
    //            $lt: timeNow
    //        }},{sort:{dataWprowadzenia:-1}});
    //
    //    if(raporty.count()==0){
    //        var notifications=Powiadomienie.find({idKwestia:kwestia._id,powiadomienieTyp:NOTIFICATION_TYPE.LACK_OF_REALIZATION_REPORT});
    //        if(notifications.count()==0) {
    //            console.log("wysyłamy powiadomienie");
    //            Meteor.call("sendEmailNoRealizationReport", kwestia._id, function (error) {
    //                if (error)
    //                    console.log(error.reason);
    //            });
    //            var users = Users.find({'profile.userType': USERTYPE.CZLONEK});
    //            users.forEach(function (user) {
    //                //dodaj!-wybranie z zespolu tych czlonkow,którzy czyAtywny==true
    //                var zr = ZespolRealizacyjny.findOne({_id: kwestia.idZespolRealizacyjny});
    //                addPowiadomienieAplikacjaRespondMethodPosts(kwestia._id, new Date(), NOTIFICATION_TYPE.LACK_OF_REALIZATION_REPORT, user._id, zr.zespol);
    //            });
    //        }
    //        else{
    //            var n=Powiadomienie.find({idKwestia:kwestia._id,
    //                dataWprowadzenia: {
    //                    $gte: previousCheck,
    //                    $lt: timeNow
    //                }},{sort:{dataWprowadzenia:-1}});
    //            if(n.count()>0)
    //            console.log("jest takie");
    //            else
    //                console.log("nie ma takiego");
    //        }
    //    }
    //    else console.log("jest raport!");
    //
    //});
};
checkingEndOfVote = function() {

    var pktZaUdzialWZesp = RADKING.UDZIAL_W_ZESPOLE_REALIZACYJNYM;
    var actualDate = moment(new Date()).format();
    var kwestie = Kwestia.find(
        {
            czyAktywny: true,
            status: {$in: [KWESTIA_STATUS.GLOSOWANA, KWESTIA_STATUS.OCZEKUJACA]}
        },
        {
            sort: {wartoscPriorytetu: -1, dataWprowadzenia: 1}
        }
    );

    kwestie.forEach(function (kwestia) {
        var issueUpdated = Kwestia.findOne({_id: kwestia._id});
        if(issueUpdated.status == KWESTIA_STATUS.GLOSOWANA) {
            if(actualDate >= issueUpdated.dataGlosowania) {
                if (issueUpdated.wartoscPriorytetu > 0) {
                    //for global prameters- jeśli minął czas głosowania,wartPrior>0-> update parametrów, zmiana na zrealizowaną
                    if (issueUpdated.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
                        changeParametersSuccess(issueUpdated);

                    //for kwestia type basic,osobowa-jesli minal czas glosowania,wartPrior>0->
                    //-dodajemy pkt uzytkownikom za udzial w zespole(zepsol bierzemy z ZrDraft)
                    //-jezeli zrDraft ma idZR- to odszukujemy ten ZR i o ile istnieje(mogl byc w miedzyczasie rozwiazany)
                    //to dopisujemy do tego zr tą kwestię i tej kwestii zeminiamy idZr,stary ZRDraft usuwamy
                    //-else: tworzymy nowy ZR przepisujac ZRDraft,dodajemy do niego kwestie,W kwestii zmeiniamy idZr, ZRDraft usuwamy
                    //-kwestia zmienia status na realizowana
                    else {
                        console.log("GLOSOWANA->REALIZAZCJA");
                        //awansUzytkownika(issueUpdated.idZespolRealizacyjny, pktZaUdzialWZesp);
                        issueUpdated.dataRealizacji = new Date();
                        issueUpdated.numerUchwaly = issueUpdated.issueNumber;//nadawanieNumeruUchwaly(kwestia.dataRealizacji);

                        if(issueUpdated.idParent!=null) {
                            //var kwestieOpcje=Kwestia.find({idParent:kwestia.idParent});
                            //if(kwestieOpcje.count()>1)
                            hibernateKwestieOpcje(issueUpdated);
                        }

                        var zrDraft = ZespolRealizacyjnyDraft.findOne({_id: issueUpdated.idZespolRealizacyjny});
                        if (zrDraft.idZR != null) {//jezeli draft ma id ZR( kopiuje od istniejącego ZR), to dopisz do kisty ZR tego drafta
                            var ZR = ZespolRealizacyjny.findOne({_id: zrDraft.idZR});
                            if(ZR) {
                                console.log("updetujemy zr istniejący");
                                updateListKwestie(ZR, issueUpdated);
                                Meteor.call('removeZespolRealizacyjnyDraft',issueUpdated.idZespolRealizacyjny);
                            }
                            else {
                                createNewZR(zrDraft, issueUpdated);
                                Meteor.call('removeZespolRealizacyjnyDraft',issueUpdated.idZespolRealizacyjny);
                            }
                        }
                        else {
                            createNewZR(zrDraft, issueUpdated);
                            Meteor.call('removeZespolRealizacyjnyDraft',issueUpdated.idZespolRealizacyjny);
                        }



                        //W przypadku przejścia Kwestii-Opcji do Realizacji - pozostałe Opcje przechodzą na status HIBERNOWANA


                        //TO BĘDZIE ZREALIZOWANA!
                        ////dla kwestii osobowych akcesyjnych bezpośrednich:
                        ////powiadom o pozytywnej decyzji.nadaj login i hasło
                        ////email
                        ////przepisz user draft do user
                        ////ustaw kwestię jako zrealizowaną
                        //ZMIANA!!!20.11
                        if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY,KWESTIA_TYPE.ACCESS_HONOROWY],issueUpdated.typ)) {
                            var userDraft = UsersDraft.findOne({_id: issueUpdated.idUser});

                            console.log("contains");
                            console.log(userDraft);
                            //jezeli userDraft mial idUser=byl juz doradcą,to tylko zmieniamy user type,wysylamy powiadomienie email,updateuserDraft
                            if(userDraft.profile.idUser!=null){//moze todotyczyc apliakcji istniejacego na czlonka lub honorowego
                                var user=Users.findOne({_id:userDraft.profile.idUser});
                                if(user){
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
                                                    addPowiadomienieAplikacjaRespondMethodPosts(issueUpdated._id,new Date(),NOTIFICATION_TYPE.APPLICATION_ACCEPTED,user._id,null);
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
                                                    Meteor.call("updateLicznikKlikniec", userDraft._id, 0);
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
                else {
                    console.log("admnistrowna/deliberowana w glosowaniu->kosz");


                    //dla kwestii osobowych akcesyjnych bezpośrednich:
                    //powiadom o negatywnej decyzji
                    //usuń Zrdrat,userDraft->set to false
                    //set w kwestii czyaktywny:false

                    var ZRDraft=ZespolRealizacyjnyDraft.findOne({_id:issueUpdated.idZespolRealizacyjny});
                    if(ZRDraft){
                        var zr=null;
                        if(ZRDraft.idZR!=null)
                            zr=ZespolRealizacyjny.findOne({_id:ZRDraft.idZR});
                        else zr=ZRDraft;
                        if(zr)
                            rewriteZRMembersToList(zr, issueUpdated);
                        Meteor.call('removeZespolRealizacyjnyDraft', ZRDraft._id, function (error) {
                            if (error)
                                console.log(error.reason);
                        });
                    }
                    if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],issueUpdated.typ)){
                        var userDraft=UsersDraft.findOne({_id:issueUpdated.idUser});
                        if(userDraft) {
                            //jezeli to jest existing user- powiadom o negatywnej w powiadomieniach
                            if(userDraft.profile.idUser!=null) {
                                var user = Users.findOne({_id:userDraft.profile.idUser});
                                console.log("to jest existing user- powiadom o negatywnej w powiadomieniach");
                                addPowiadomienieAplikacjaRespondMethod(issueUpdated._id,new Date(),NOTIFICATION_TYPE.APPLICATION_REJECTED,user._id);
                            }
                            Meteor.call("sendApplicationRejected",userDraft,function(error,ret){
                                if(!error)
                                    Meteor.call("removeUserDraft",userDraft);
                            });
                            //set userDraft to false
                            //ad to kwestia idUserDraft
                        }
                        Meteor.call('removeUserDraftNotZrealizowany',userDraft._id);
                    }
                    Meteor.call('removeKwestiaSetReason', issueUpdated._id,KWESTIA_ACTION.NEGATIVE_PRIORITY_VOTE);

                }
            }
        }
        else if(issueUpdated.status == KWESTIA_STATUS.OCZEKUJACA){ //DO ZROBIENIA!!!!! po miesiącu idzie do kosza
            console.log("oczekujaca crone");
            //to bedzie do wyrzucenia? bo nie ma głosowania w tyh kwestiach
            //awansUzytkownika(kwestia.idZespolRealizacyjny, pktZaUdzialWZesp);
            //kwestia.dataRealizacji = new Date();
            //kwestia.numerUchwaly = nadawanieNumeruUchwaly(kwestia.dataRealizacji);
            //Meteor.call('updateStatNrUchwDtRealKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji);
           //to samo,co dla tej powyzej, +zmiana statusu na w realizacji
        }
    });
};

checkingDeliberationExpiration=function(){
    var kwestie = Kwestia.find({czyAktywny: true, status:
    {$in: [
        KWESTIA_STATUS.DELIBEROWANA,
        KWESTIA_STATUS.ADMINISTROWANA,
        KWESTIA_STATUS.STATUSOWA
    ]}});
    kwestie.forEach(function(kwestia){
        var date=moment(kwestia).add(1,"month").format();
        if(date<=moment(new Date().format()))
           Meteor.call("removeKwestia",kwestia._id);
        //+ zarządzanie zr!
    });
};
//RAZ NA 7 DNI 3 NAJWYŻEJ OCENIANE KWESTIE PRZECHODZĄ DO GŁOSOWANIA
// 7 i 3 mają być wczytywane z parametru z tym że 7 jest ustawiane w cronie
//checkingIssuesToVote = function () {
//
//    var kworum = liczenieKworumZwykle();
//    var voteQuant = Parametr.findOne({}).voteQuantity;
//    var issues = Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.DELIBEROWANA});
//    var kwestie = [];
//
//    issues.forEach(function (issue) {
//
//        var usersCount = issue.glosujacy.length;
//        var teamCount = ZespolRealizacyjnyDraft.findOne({_id: issue.idZespolRealizacyjny}).zespol.length;
//
//        if(issue.wartoscPriorytetu > 0 && usersCount >= kworum && teamCount >= 3) {
//
//            kwestie.push(issue);
//        }
//    });
//
//    if(kwestie!=null){
//        kwestie = kwestie.sort({ wartoscPriorytetu: -1});
//        var iloscKwestii = 0;
//
//        kwestie.forEach(function (kwestia) {
//            if(iloscKwestii<voteQuant){
//
//                var czasGlosowania = Rodzaj.findOne({_id: kwestia.idRodzaj}).czasGlosowania;
//                kwestia.dataGlosowania = new Date().addHours(czasGlosowania);
//                Meteor.call('updateStatusDataGlosowaniaKwestii', kwestia._id, KWESTIA_STATUS.GLOSOWANA, kwestia.dataGlosowania);
//            }
//            iloscKwestii++;
//        });
//    }
//};


//=========================================== metody pomocnicze ===============================================//

awansUzytkownika = function(idZespoluRealiz, pktZaUdzialWZesp) {
    console.log(ZespolRealizacyjnyDraft.findOne({_id: idZespoluRealiz}));
    var zespol = ZespolRealizacyjnyDraft.findOne({_id: idZespoluRealiz}).zespol;

    zespol.forEach(function (idUzytkownikaZespolu){
        var uzytkownikAwansujacy = Users.findOne({_id: idUzytkownikaZespolu});
        if(uzytkownikAwansujacy) {
            uzytkownikAwansujacy.profile.rADking += pktZaUdzialWZesp;
            Meteor.call('updateUserRanking', idUzytkownikaZespolu, uzytkownikAwansujacy.profile.rADking);
        }
    });
};

//Nadawanie numeru uchwały - dla kwesti które przechodzą do realizacji, każdego dnia numery idą od 1
nadawanieNumeruUchwaly = function(dataRealizacji) {

    var numerUchw = 1;
    var kwestieRealizowane = Kwestia.find({czyAktywny: true, numerUchwaly: !null});

    kwestieRealizowane.forEach(function (kwestiaRealizowana) {

        if(kwestiaRealizowana.dataRealizacji.toDateString() == dataRealizacji.toDateString())
            numerUchw++
    });

    return numerUchw;
};
//...................................................................................
changeParametersSuccess=function(kwestia){
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
        addReferencePause:globalPramsDraft.addReferencePause,
        okresSkladaniaRR:globalPramsDraft.okresSkladaniaRR
    };
    console.log("new Parameter");
    console.log(obj);
    var globalParam=Parametr.findOne();
    Meteor.call("updateParametr",globalParam._id,obj,function(error){
        if(!error)
            Meteor.call("setActivityParametrDraft",globalPramsDraft._id,false,function(error){
                if(!error)
                    Meteor.call("updateStatusNrUchwalyDataRealizacjiiKwestii",kwestia._id,KWESTIA_STATUS.ZREALIZOWANA,kwestia.issueNumber,new Date());
                else
                    console.log("update param failed");
            });
        else{
            console.log("nie udało się");
        }
    });
};

updateListKwestie=function(ZR,kwestia){
    //var kwestia=Kwestia.findOne({_id:kwestiaId});
    if(kwestia) {
        var listKwestii = ZR.kwestie.slice();
        listKwestii.push(kwestia._id);
        Meteor.call('updateListKwesti', ZR._id, listKwestii, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);

            }
            else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
                console.log("update kwestii");
                //if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],kwestia.typ)){
                //    var issueName=kwestia.kwestiaNazwa;
                //    if (issueName.contains("Aplikowanie-")){
                //       var  newIssueName=issueName.substring(issueName.indexOf("-")+1);
                //        Meteor.call('updateStatNrUchwDtRealIdZespolKwestiiNazwa', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, ZR._id,newIssueName);
                //    }
                //    Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, ZR._id);
                //}
                //else
                Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, ZR._id);
            }
        });
    }
};

createNewZR=function(zrDraft,kwestia){
    var arrayKwestie = [];
    arrayKwestie.push(kwestia._id);
    var newZR = [{
        nazwa: zrDraft.nazwa,
        zespol: zrDraft.zespol,
        kwestie: arrayKwestie,
        czyAktywny: true
    }];
    console.log("ten zespol");
    console.log(newZR);
    Meteor.call('addZespolRealizacyjny', newZR, function (error, ret) {
        if (error) {
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else
                throwError(error.reason);

        }
        else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
            var idZR = ret;
            Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, idZR);
        }
    });
};
hibernateKwestieOpcje=function(kwestia){
    kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: kwestia.idParent,
        status:{$in:[KWESTIA_STATUS.GLOSOWANA,KWESTIA_STATUS.DELIBEROWANA]}});
    if(kwestieOpcje.count()>1){
        console.log("kwestie opcje");
        console.log(kwestieOpcje);
        kwestieOpcje.forEach(function (kwestiaOpcja) {
            if(kwestiaOpcja._id!=kwestia._id) {
                console.log("update kwestii opcjii");
                Meteor.call('updateStatusKwestii', kwestiaOpcja._id, KWESTIA_STATUS.HIBERNOWANA);
            }
        });
    }
};

addPowiadomienieAplikacjaRespondMethod=function(idKwestia,dataWprowadzenia,typ,idReceiver){
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