/**
 * je¿eli w kwestii zostanie skompelotwany 3ci cz³onek-
 * kwestia idzie do g³osowania
 * dotyczy to kwestii:
 * -deliberowanej(basic)
 * -osobowej nie,bo zr przypsujemy automatycznie
 *
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
    var zespoly = ZespolRealizacyjnyDraft.find({});

    zespoly.observe({
        changedAt: function(newZespol, oldZespol, atIndex) {
            console.log("weszlo w zespoly change");
            var kworum = liczenieKworumZwykle();
            var kwestia = Kwestia.findOne({czyAktywny: true, idZespolRealizacyjny: newZespol._id});
            if (kwestia != null) {
                //if(kwestia.wartoscPriorytetu > 0 && newZespol.zespol.length >= kworum && kwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {
                //    moveKwestiaToGlosowana(kwestia);
                //}

                if(kwestia.wartoscPriorytetu > 0 && kwestia.glosujacy.length >= kworum && newZespol.zespol.length >= 3 && kwestia.status != KWESTIA_STATUS.REALIZOWANA){
                    console.log("tu weszlo");
                    if(kwestia.status == KWESTIA_STATUS.DELIBEROWANA){
                        console.log("tu wesz³o 2");
                        moveKwestiaToGlosowana(kwestia);
                    }
                    else if (kwestia.status == KWESTIA_STATUS.STATUSOWA){

                        Meteor.call('updateStatusDataOczekwianiaKwestii', newKwestia._id, KWESTIA_STATUS.OCZEKUJACA,new Date());

                        Meteor.call("sendEmailHonorowyInvitation", newKwestia.idZgloszonego);
                    }
                }
            }
        }
    });
    moveKwestiaToGlosowana=function(newKwestia,ZRDraft,ifUpdateZR){//tu spirawdzic godziny. i warunek blokujacy wejscie kwestii do glosowania!
        if(kwestiaAllowedToGlosowana()) {//jezeli deliberowana vote w bosrverrze,gdy ta opuscila i wpuszczmy nowe- to obœ³uga zr musi by!
            var czasGlosowania = Parametr.findOne({}).voteDuration;
            var final = moment(new Date()).add(czasGlosowania, "hours").format();//do testów tylko!!
            //var final = moment(new Date()).add(czasGlosowania, "hours").format();
            var start = new Date();
            console.log(newKwestia._id);
            console.log(final);
            console.log(start);
            Meteor.call('updateStatusDataGlosowaniaKwestiiFinal', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, final,start,function(error){
                if(error)
                    console.log(error.reason);
            });
            Meteor.call("sendEmailStartedVoting",newKwestia._id);
            addPowiadomienieKwestiaGlosowanaMethod(newKwestia._id);
        }
    };

    addPowiadomienieKwestiaGlosowanaMethod=function(idKwestia){
        var users=Users.find({'profile.userType':USERTYPE.CZLONEK});
        var kwestia=Kwestia.findOne({_id:idKwestia});
        users.forEach(function(user){
            var newPowiadomienie ={
                idOdbiorca: user._id,
                idNadawca: null,
                dataWprowadzenia: new Date(),
                tytul: "",
                powiadomienieTyp: NOTIFICATION_TYPE.VOTE_BEGINNING,
                tresc: "",
                idKwestia:idKwestia,
                kwestia:kwestia,
                czyAktywny: true,
                czyOdczytany:false
            };
            Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
                if(error)
                    console.log(error.reason);
            });
        });
    };
});


