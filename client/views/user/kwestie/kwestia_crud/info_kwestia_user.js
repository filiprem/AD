Template.informacjeKwestia.rendered = function () {
};
Template.informacjeKwestia.created = function () {
};
Template.informacjeKwestia.events({
    'click #wyczyscPriorytety': function() {
        var me = Meteor.userId();
        var currentKwestiaId = Session.get("idKwestia");
        var kwestie = Kwestia.find({'glosujacy.idUser': me,idParent:currentKwestiaId }).fetch()
        if(Kwestia.find({'glosujacy.idUser': me,idParent:currentKwestiaId }).count()==0){//zmienic,czy wszedzie są zero!
            throwError("Nie nadałeś priorytetu tej Kwestii, ani jej opcjom");
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
                                var array = [];
                                var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
                                var flag2=false;
                                var tabGlosujacych = kwestia.glosujacy;
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
                    danger: {
                        label: "Anuluj",
                        className: "btn-danger"
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
        Router.go("addKwestiaOpcja");
    },
    'click #doArchiwum': function (e) {
        e.preventDefault();
        var idKw = this._id;
        Session.set("idkwestiiArchiwum", this._id);
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
        var idKw = this._id;
        Session.set("idkwestiiKosz", this._id);
        var z = Posts.findOne({idKwestia: idKw, postType: "kosz"});
        if (z) {
            $('html, body').animate({
                scrollTop: $(".doKoszaClass").offset().top
            }, 600);
        }
        else {
            $("#uzasadnijWyborKosz").modal("show");
        }
    },
    'click #priorytetButton': function (e) {
        var aktualnaKwestiaId = Session.set("idK", this._id);
        var u = Meteor.userId();
        var ratingValue = parseInt(e.target.value);
        var ratingKwestiaId = this._id;
        var kwestia = Kwestia.findOne({_id: ratingKwestiaId});
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var glosujacy = [];
        var glosujacy = kwestia.glosujacy;
        var glosujacyTab = kwestia.glosujacy.slice();
        var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
        var object = {
            idUser: Meteor.userId(),
            value: ratingValue
        }
        var flag = false;
        for (var i = 0; i < kwestieOpcje.length; i++) {//dla kwestii opcji- z trgo chyba juz nie korzystamy!!
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {//przechodizmy po kazdych użytkownikach,ktory zagloswoali
                var user = kwestieOpcje[i].glosujacy[j].idUser;
                var oddanyGlos = kwestieOpcje[i].glosujacy[j].value;
                if (user == Meteor.userId()) {
                    if (oddanyGlos == ratingValue) {
                        return false;
                    }
                }
            }
        }
        var oldValue=0;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i].idUser === Meteor.userId()) {
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
                newValue = ratingValue + getUserRadkingValue(kwestiaOwner)- oldValue;
                Meteor.call('updateUserRanking', kwestiaOwner, newValue, function (error) {
                    if (error) {
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else {
                            throwError(error.reason);
                        }
                    }
                });
            }
        });
    }
});
Template.informacjeKwestia.helpers({
    kwestiaOpcjaCount: function(){
        var ile = Kwestia.find({idParent: this.idParent}).count();
        if(ile == 10) return false;
        else return true;
    },
    ifHasOpcje: function () {
        var kwestiaGlownaId = this._id;
        var k = Kwestia.find({idParent: kwestiaGlownaId,isOption: true}).fetch();
        if(k) return true;
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
    opcje: function () {
        var kwestiaGlownaId = Session.get("idKwestia");
        var op = Kwestia.find({idParent: kwestiaGlownaId}).fetch();
        if (op) return true;
        else return false;
    },
    thisKwestia: function () {
        var kw = Kwestia.findOne({_id: this._id});
        if(kw.isOption) Session.set("idKwestia",kw.idParent);
        else Session.set("idKwestia", this._id)
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