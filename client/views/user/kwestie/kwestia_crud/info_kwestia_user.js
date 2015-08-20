Template.informacjeKwestia.rendered = function () {
};
Template.informacjeKwestia.created = function () {
};
Template.informacjeKwestia.events({
    'click #wyczyscPriorytety': function(){
        var me = Meteor.userId();
        console.log(me);
        var currentKwestiaId = Session.get("idKwestia");
        var kwestie = Kwestia.find({'glosujacy.idUser': me,idParent:currentKwestiaId }).fetch()
        console.log(Kwestia.find({'glosujacy.idUser': me,idParent:currentKwestiaId }).count());
        if(Kwestia.find({'glosujacy.idUser': me,idParent:currentKwestiaId }).count()==0){//zmienic,czy wszedzie są zero!
            throwError("Nie nadałeś priorytetu tej kwestii, ani jej opcjom");
            //sprawdzić czy sa zzero->jak zero,to tez nie updatujemy na darmo!
        }
        else {
            bootbox.dialog({
                title:"Potwierdzenie",
                message:"Czy napewno chcesz zresetować nadane priorytety we wszystkich Opcjach tej Kwestii?",
                buttons:{
                    success: {
                        label: "Potwierdź",
                        className: "btn-success",
                        callback: function () {
                            var tabWlascicieliKwestii=[];
                            kwestie.forEach(function (kwestia) {//dla wszystkich kwestii,w kótrech ja głosowałam
                                console.log("id kwestii " + kwestia._id);
                                var array = [];
                                var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
                                var flag2=false;
                                var tabGlosujacych = kwestia.glosujacy;
                                console.log("Liczba glosujacych :" + tabGlosujacych.length);//+update wartosci priorytetu!!
                                for (var j = 0; j < tabGlosujacych.length; j++) {
                                    var idUser = tabGlosujacych[j].idUser;
                                    var value = 0;
                                    if (tabGlosujacych[j].idUser == me) {
                                        value = 0;

                                        flag2=true;
                                        wartoscPriorytetu -= tabGlosujacych[j].value;

                                        var givenPriorytet=tabGlosujacych[j].value;
                                        var kwestiaOwner=kwestia.idUser;

                                        var flag=false;
                                        var userKwestia=Users.findOne({_id:kwestiaOwner});
                                        var actualValue=Number(userKwestia.profile.rADking);
                                        //sprawdzam czy juz mam w tablicy,jak nie,to dodaje,jak jest-to znowu odejmuje
                                        for (var i = 0; i < tabWlascicieliKwestii.length; i++) {
                                            if (tabWlascicieliKwestii[i].kwestiaOwner == kwestiaOwner) {
                                                tabWlascicieliKwestii[i].newRanking -= givenPriorytet;
                                                flag = true;
                                            }
                                        }
                                        if (flag == false) {
                                            var object = {
                                                kwestiaOwner: kwestiaOwner,
                                                newRanking: actualValue - givenPriorytet
                                            };
                                            tabWlascicieliKwestii.push(object);
                                            console.log("Obiekt tablicy: " + object.kwestiaOwner+", new Ranking: "+object.newRanking+", wielkosc tablicy: "+tabWlascicieliKwestii.length);
                                        }
                                    }
                                    else {
                                        value = tabGlosujacych[j].value;
                                    }
                                    var glosujacy = {
                                        idUser: idUser,
                                        value: value
                                    };
                                    array.push(glosujacy);
                                }
                                Meteor.call('setGlosujacyTab', kwestia._id, array, function (error, ret) {
                                    if (error) {
                                        if (typeof Errors === "undefined")
                                            Log.error('Error: ' + error.reason);
                                        else
                                            throwError(error.reason);
                                    }
                                    else{
                                        if(flag2==true){
                                        Meteor.call('updateWartoscPriorytetu', kwestia._id, wartoscPriorytetu, function (error, ret) {
                                            if (error) {
                                                if (typeof Errors === "undefined")
                                                    Log.error('Error: ' + error.reason);
                                                else
                                                    throwError(error.reason);
                                            }
                                        });}
                                    }
                                });
                            });
                            tabWlascicieliKwestii.forEach(function(kwestiaOwner){
                                console.log("KWESTIA USER: "+kwestiaOwner.kwestiaOwner);
                                console.log("KWESTIA RANKING: "+kwestiaOwner.newRanking);
                                Meteor.call('updateUserRanking', kwestiaOwner.kwestiaOwner,kwestiaOwner.newRanking, function (error, ret) {
                                    if (error) {
                                        if (typeof Errors === "undefined")
                                            Log.error('Error: ' + error.reason);
                                        else
                                            throwError(error.reason);
                                    }
                                });
                            });
                        }
                    },
                    danger:{
                        label:"Anuluj",
                        className:"btn-danger"
                    }
                }
            });
        }
    },
    'click #dyskusja': function (e) {
        var id = document.getElementById("dyskusja").name;
        Router.go('dyskusjaKwestia', {_id: id})
    },
    'click .btn-success': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click #backToList': function (e) {
        Router.go('listKwestia');
    },
    'click #addOptionButton': function () {
        console.log(Session.get("idKwestia"));
        Router.go("addKwestiaOpcja");
    },
    'click #doArchiwum': function (e) {
        e.preventDefault();
        var idKw = this._id;
        var z = Posts.findOne({idKwestia: idKw, postType: "archiwum"});
        if (z) {
            $('html, body').animate({
                scrollTop: $(".doArchiwumClass").offset().top
            }, 600);
        }
        else {
            $("#uzasadnijWyborArchiwum").modal("show");
        }
    },
    'click #doKosza': function (e) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $("#dyskusja").offset().top
        }, 600);

        var message = "Proponuję przenieść tę kwestię do Kosza? Dyskusja i siła priorytetu w tym wątku o tym zdecyduje.";
        var idKwestia = Session.get("idKwestia");
        var idUser = Meteor.userId();
        var addDate = new Date();
        var isParent = true;
        var idParent = null;
        var czyAktywny = true;
        var userFullName = Meteor.user().profile.fullName;
        var ratingValue = 0;
        var glosujacy = [];
        var postType = POSTS_TYPES.KOSZ;

        var post = [{
            idKwestia: idKwestia,
            wiadomosc: message,
            idUser: idUser,
            userFullName: userFullName,
            addDate: addDate,
            isParent: isParent,
            idParent: idParent,
            czyAktywny: czyAktywny,
            idParent: idParent,
            wartoscPriorytetu: ratingValue,
            glosujacy: glosujacy,
            postType: postType
        }]
        if (isNotEmpty(post[0].idKwestia, '') && isNotEmpty(post[0].wiadomosc, 'komentarz') && isNotEmpty(post[0].idUser, '') &&
            isNotEmpty(post[0].addDate.toString(), '') && isNotEmpty(post[0].czyAktywny.toString(), '') &&
            isNotEmpty(post[0].userFullName, '' && isNotEmpty(post[0].isParent.toString(), ''))) {

            Meteor.call('addPost', post, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                } else {
                    document.getElementById("message").value = "";
                }
            });
        }
        else {
            $("#uzasadnijWyborKosz").modal("show");
        }
    },
    'click #priorytetButton': function (e) {
        var aktualnaKwestiaId = Session.set("idK", this._id);
        var u = Meteor.userId();
        var ratingValue = parseInt(e.target.value);
        console.log("Rating value"+ ratingValue);
        var ratingKwestiaId = this._id;
        var kwestia = Kwestia.findOne({_id: ratingKwestiaId});
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var glosujacy = [];
        var glosujacy = kwestia.glosujacy;
        var glosujacyTab = kwestia.glosujacy.slice();
        var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
        console.log("WARTO")
        var object = {
            idUser: Meteor.userId(),
            value: ratingValue
        }
        var flag = false;
        for (var i = 0; i < kwestieOpcje.length; i++) {//dla kwestii opcji- z trgo chyba juz nie korzystamy!!
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {//przechodizmy po kazdych użytkownikach,ktory zagloswoali
                console.log("GLOSUJACY[j]");
                console.log(kwestieOpcje[i].glosujacy[j]);
                var user = kwestieOpcje[i].glosujacy[j].idUser;
                console.log("USER idUser");
                console.log(user);
                var oddanyGlos = kwestieOpcje[i].glosujacy[j].value;
                if (user == Meteor.userId()) {
                    if (oddanyGlos == ratingValue) {
                        //throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }
        var oldValue=0;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i].idUser === Meteor.userId()) {
                console.log("Ostatnio nadałeś priorytet: " +glosujacyTab[i].value);
                console.log("Nowy,który dałeś: "+ratingValue);
                flag = false;
                    oldValue=glosujacyTab[i].value;

                wartoscPriorytetu -= glosujacyTab[i].value;
                glosujacyTab[i].value = ratingValue;
                wartoscPriorytetu += glosujacyTab[i].value;
            }
        }

        var kwestiaUpdate = [{
            wartoscPriorytetu: wartoscPriorytetu,
            glosujacy: glosujacyTab
        }];
        Meteor.call('updateKwestiaRating', ratingKwestiaId, kwestiaUpdate, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            }
            else {
                var newValue = 0;
                var kwestiaOwner=kwestia.idUser;
                console.log("Właściciel kwestii: "+kwestiaOwner);
                console.log("Właściciel ma pkt: "+getUserRadkingValue(kwestiaOwner));
                console.log("Taka dodamy: "+ratingValue);
                console.log("Taka odejmiemy: "+oldValue);
                newValue = ratingValue + getUserRadkingValue(kwestiaOwner)- oldValue;
                console.log("Nowa wartosc dla właściciela kwestii: "+newValue);
                Meteor.call('updateUserRanking', kwestiaOwner, newValue, function (error) {
                    if (error) {
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else {
                            throwError(error.reason);
                        }
                    }
                });


                //if (self.ifUserVoted.get() == false) {
                //    console.log("Użytkownik jeszcze nie głosował");
                //    var newValue = 0;
                //    var pktAddPriorytet = Parametr.findOne({});
                //    newValue = Number(pktAddPriorytet.pktNadaniePriorytetu) + getUserRadkingValue(Meteor.userId());
                //    console.log("Nadanie priorytetu: "+Number(pktAddPriorytet.pktNadaniePriorytetu));
                //    console.log("Aktualnie ma pkt: "+getUserRadkingValue(Meteor.userId()));
                //    var kw = Kwestia.findOne({_id: Session.get("idK")});
                //    var kwestiaOwner = kw.idUser;
                //    if (kwestiaOwner == Meteor.userId()) {//jezeli nadajacy priorytet jest tym,który utworzył kwestię
                //        newValue += ratingValue;
                //    }
                //    else {
                //        var newValueOwner = 0;
                //        newValueOwner = Number(ratingValue) + getUserRadkingValue(kwestiaOwner);
                //        console.log("Nowa wartosc: "+newValueOwner);
                //        Meteor.call('updateUserRanking', kwestiaOwner, newValueOwner, function (error) {
                //            if (error) {
                //                if (typeof Errors === "undefined")
                //                    Log.error('Error: ' + error.reason);
                //                else {
                //                    throwError(error.reason);
                //                }
                //            }
                //        });
                //    }
                //    Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                //        if (error) {
                //            if (typeof Errors === "undefined")
                //                Log.error('Error: ' + error.reason);
                //            else {
                //                throwError(error.reason);
                //            }
                //        }
                //        else {
                //            self.ifUserVoted.set(true);
                //        }
                //    });
                //}
                //else {
                //    console.log("Użytkownik nadał już priorytet -> nie doliczamy mu rankingu");
                //}
            }
        });
    }});
Template.informacjeKwestia.helpers({
    kwestiaOpcjaCount: function(){
        var ile = Kwestia.find({idParent: this.idParent}).count();
        if(ile == 10) return false;
        else return true;
    },
    ifHasOpcje: function () {
        var kwestiaGlownaId = this._id;
        var k = Kwestia.find({idParent: kwestiaGlownaId, isOption: true}).fetch();
        if (k) return true;
        else return false;
    },
    isAdmin: function () {
        if (Meteor.user().roles) {
            if (Meteor.user().roles == "admin")
                return true;
            else
                return false;
        }
        else return false;
    },
    //opcje: function () {
    //    var kwestiaGlownaId = Session.get("idKwestia");
    //    var op = Kwestia.find({idParent: kwestiaGlownaId}).fetch();
    //    if (op) return true;
    //    else return false;
    //},
    czyOpcja: function () {
        if (this.isOption) return true;
        else return false;
    },
    thisKwestia: function () {
        var kw = Kwestia.findOne({_id: this._id});
        if(kw.isOption){
            Session.set("idKwestia",kw.idParent);
        }
        else{
            Session.set("idKwestia", this._id)
        }
    },
    mojPiorytet: function () {
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        if (kwestia) {
            var g = kwestia.glosujacy;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser) {
                    return g[i].value;
                }
            }
        }
    },
    mojPriorytetZero: function () {
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        if (kwestia) {
            var g = kwestia.glosujacy;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser && g[i].value == 0)
                    return true;
                else return false;
            }
        }
    },
    glosujacyCount: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        if (tab) {
            var liczba = tab.glosujacy.length;
            return liczba;
        }
    },
    srednia: function () {
        var s = this.sredniaPriorytet;
        if (s) {
            var ss = s.toFixed(2);
            return ss;
        }
    },
    nazwa: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        if (tab) return tab;
    },
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    },
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format("DD-MM-YYYY, HH:mm");
    },
    dateG: function () {
        var d = this.dataGlosowania;
        if (d) return moment(d).format("DD-MM-YYYY, HH:mm");
    },
    dataGlosowaniaObliczana: function () {
        var dataG = this.dataGlosowania;
        var rodzajId = this.idRodzaj;
        var r = Rodzaj.findOne({_id: this.idRodzaj});
        if (r) {
            var czasGlRodzaj = r.czasGlosowania;
            var k = moment(dataG).subtract(czasGlRodzaj, 'h').format("DD-MM-YYYY, HH:mm");
            return k;
        }
    },
    isSelected: function( number) {
        var flag=false;
        var currentKwestiaId = Session.get("idKwestia");
        var kwestie = Kwestia.find({'glosujacy.idUser': Meteor.userId(),idParent:currentKwestiaId }).fetch();
        kwestie.forEach(function (kwestia) {
            var array = [];
            var tabGlosujacych = kwestia.glosujacy;
            for (var j = 0; j < tabGlosujacych.length; j++) {
                if(tabGlosujacych[j].idUser==Meteor.userId()){
                    if(tabGlosujacych[j].value==number){
                        flag=true;
                    }
                }

            }
        });
        if(flag==true)
            return "disabled";
        else
            return "";
    },
    isAvailable:function(){
        var i=0;
        var currentKwestiaId = Session.get("idKwestia");
        var kwestie = Kwestia.find({'glosujacy.idUser': Meteor.userId(),idParent:currentKwestiaId }).fetch();
        var globalCounter=0;
        kwestie.forEach(function (kwestia) {
            var array = [];
            var tabGlosujacych = kwestia.glosujacy;
            for (var j = 0; j < tabGlosujacych.length; j++) {
                if(tabGlosujacych[j].idUser==Meteor.userId()){
                    globalCounter+=1;
                    if(tabGlosujacych[j].value==0){
                        i=i+1;
                    }
                }
            }
        });
        if(i==globalCounter)
            return "disabled";
        else
            return "";
    }
});
