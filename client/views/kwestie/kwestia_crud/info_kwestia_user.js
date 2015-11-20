/*
 Po odesłaniu do Kosza Kwestii-Opcji powinna ona zniknąć z wykazu Kwestii-Opcji.
 Trzeba ja trwale odłączyć od grupy, a miejsce zwolnione będzie dla ewentualnego dołożenia innej Opcji. ->
 trzeba usunąć idParent z Kwestii-Opcji aby już nie była powiązana z Kwestią-Główna.
 Automatycznie zwolni się miejsce dla kolejnej Opcji i przycisk "Dodaj Opcję" się pojawi.

 Po odesłaniu do Archiwym odłączać i zwalniać miejsca nie należy.
 Archiwalna Kwestia-Opcja nadal jest częścią grupy, a w wykazie "podglądowym" (pod szczegółami) powinna być wykazana
 i jakoś inaczej oznaczona (może napisem "archiwalna"), a po kloknięciu w nią - oczywiście - prowadzić do niej (czyli do Archiwum).
 -> Dodać mechanizm, który będzie dopisywał "ARCHIWALNA" do Kwestii-Opcji, która została przeniesiona do Archiwum.
 * */

/*
 Dopóki Kwestia jest w Deliberacji, nie wyświetlamy jej dat GLOSOWANIA i FINALU.
 Jak Kwestia przejdzie do panelu GLOSOWANIE to daty się pojawiaja.
 * */

Template.informacjeKwestia.rendered = function () {
    //nadajemy priorytet automatycznie po wejściu na kwestię + dajemy punkty
    //za wyjątkiem ,gdy użytkownik nie jest zalogowany lub jest kims innym niz czlonek
    if(Meteor.userId()==null)
        return;
    var me=Users.findOne({_id:Meteor.userId()});
    if(me){
        if(me.profile.userType!=USERTYPE.CZLONEK || Meteor.user().roles == "admin")
            return;
    }
    var idKwestia=Template.instance().data._id;
    var kwestia = Kwestia.findOne({_id: idKwestia});
    if(kwestia.status!=KWESTIA_STATUS.REALIZOWANA) {
        //var tabGlosujacy = getAllUsersWhoVoted(kwestia._id);
        if (!_.contains(_.pluck(kwestia.glosujacy.slice(), 'idUser'), Meteor.userId())) {//jeżeli użytkownik jeszcze nie głosował
            var glosujacy = {
                idUser: Meteor.userId(),
                value: 0
            };
            var voters = kwestia.glosujacy.slice();
            voters.push(glosujacy);
            Meteor.call('setGlosujacyTab', kwestia._id, voters, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
            });
            //dodanie pkt za głosowanie
            var newValue = 0;

            newValue = Number(RADKING.NADANIE_PRIORYTETU) + getUserRadkingValue(Meteor.userId());

            Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
            });
        }
    }

    if(Meteor.userId()) {
        var myNotifications = Powiadomienie.find({idOdbiorca: Meteor.userId(),
            powiadomienieTyp:{$in:[NOTIFICATION_TYPE.ISSUE_NO_PRIORITY,NOTIFICATION_TYPE.ISSUE_NO_PRIORITY_REALIZATION]},
            czyAktywny:true,czyOdczytany:false
        });
        myNotifications.forEach(function(powiadomienie){
           //if(powiadomienie.typ==NOTIFICATION_TYPE.ISSUE_NO_PRIORITY){
               Meteor.call("setOdczytaneAktywnoscPowiadomienie",powiadomienie._id,true,false);
          //}
        });
    }
};
Template.informacjeKwestia.created = function () {
    this.listaCzlonkow = new ReactiveVar();
};
Template.informacjeKwestia.events({
    'click #dyskusja': function (e) {
        var id = document.getElementById("dyskusja").name;
        Router.go('dyskusjaKwestia', {_id: id})
    },
    'click .btn-success': function (event, template) {
        Session.set('kwestiaInScope', this);
    }
});

Template.informacjeKwestia.helpers({
    isGlobalParamChange: function(){
        return this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true : false;
    },
    isGlosowana:function(){
        return this.status==KWESTIA_STATUS.GLOSOWANA ? true :false;
    },
    isRealizowana:function(){
        return this.status==KWESTIA_STATUS.REALIZOWANA ? true :false;
    },
    kwestiaInKosz:function(){
        return this.czyAktywny==false ? true : false;
    },
    wartoscPriorytetuG:function(){
        if(this.wartoscPriorytetu>0)
            return "+"+this.wartoscPriorytetu;
        else return this.wartoscPriorytetu;
    },
    //thisKwestia: function () {
    //    var kw = Kwestia.findOne({_id: this._id});
    //    if (kw) {
    //        if (kw.isOption)
    //            Session.set("idKwestia", kw.idParent);
    //        else
    //            Session.set("idKwestia", this._id)
    //    }
    //},
    // OPCJE
    ifHasOpcje: function () {
        var kwestiaGlownaId = this.idParent;
        var k = Kwestia.find({czyAktywny: true, idParent: kwestiaGlownaId, isOption: true});
        if (k) {
            if(k.count()>0)
                return true;
            else
                return false;
        }
    },
    //PRIORYTET
    mojPiorytet: function () {
        var kwestia = Kwestia.findOne({_id:this._id});
        if (kwestia) {
            var g=null;
            if(kwestia.status==KWESTIA_STATUS.REALIZOWANA)
                g = kwestia.glosujacyWRealizacji;
            else
                g = kwestia.glosujacy;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser) {
                    if (g[i].value > 0) {
                        g[i].value = "+" + g[i].value;
                        return g[i].value;
                    }
                    else {
                        return g[i].value;
                    }
                }
            }
        }
    },
    mojPriorytetZero: function () {
        var kwestia = Kwestia.findOne({_id:this._id});
        if (kwestia) {
            var g=null;
            if(kwestia.status==KWESTIA_STATUS.REALIZOWANA)
                g = kwestia.glosujacyWRealizacji;
            else
                g = kwestia.glosujacy;
            var flag=false;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser && g[i].value == 0)
                    flag=true;
            }
            return flag==true ? true : false;
        }
    },
    glosujacyCount: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne({_id:this._id});
        if (tab) {
            var liczba=null;
            if(tab.status==KWESTIA_STATUS.REALIZOWANA)
                liczba = tab.glosujacyWRealizacji.length;
            else
                liczba = tab.glosujacy.length;
            return liczba;
        }
    },
    //TEMAT I RODZAJ
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    },
    //DATY
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format("DD-MM-YYYY, HH:mm");
    },
    dateVoteStart:function(){
        var d = this.startGlosowania;
        return (d) ? moment(d).format("DD-MM-YYYY, HH:mm") : "---";
    },
    dateVoteFinish: function () {
        var d = this.dataGlosowania;
        return (d) ? moment(d).format("DD-MM-YYYY, HH:mm") : "---";
    },
    //USERS
    isNotAdminOrDoradca: function () {//jezeli nie jest adminem ani doradcą
        if (Meteor.user()) {
            if (Meteor.user().roles) {
                if (Meteor.user().roles == "admin")
                    return false;
                else {
                    var user = Users.findOne({_id: Meteor.userId()});
                    if (user) {
                        return user.profile.userType == 'doradca' ? false : true;
                    }
                    return true;
                }
            }
        }
        return false;
    },
    kworumComplete:function(){
        var kworum = liczenieKworumZwykle();
        var usersCount = this.glosujacy.length;
        return usersCount>=kworum ? true : false;
    },
    textKworum:function(){
        var kworum = liczenieKworumZwykle();
        var usersCount = this.glosujacy.length;
        var lock=kworum-usersCount;
        return lock==1 ? lock+ " osoby" : lock+ " osób";
    },
    ZRComplete:function(){
        var zespol=null;
        if(this.zespol) {//kwestia archiwalna lub w koszu
            zespol = this.zespol.czlonkowie;
            console.log("uwagaaaaaaaaaaaaaaaaaaaaaa");
            console.log(zespol.czlonkowie);
            return zespol.length >= 3 ? true : false;
        }
        else
            return getZRCount(this.idZespolRealizacyjny) >=3 ? true : false;
    },
    ZRText:function(){
        var count=null;
        if(this.zespol)
            count = this.zespol.czlonkowie.length;
        else
            count=getZRCount(this.idZespolRealizacyjny);
        var result=3-count;
        return (result >1)  ? result+ " członków" : result+ " członka";
    }
});
getZRCount=function(idZR){
    console.log("weszło tutaj");
    console.log(idZR);
    var zespol = ZespolRealizacyjny.findOne({_id: idZR});
    if (!zespol)
        zespol = ZespolRealizacyjnyDraft.findOne({_id: idZR});
    return zespol.zespol.length;
};