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
    console.log("render!");
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
    console.log(Template.instance().data._id);
    var kwestia = Kwestia.findOne({_id: idKwestia});
    console.log("moja kwestia");
    console.log(kwestia);
    console.log("tablicaaa");
    console.log(_.pluck(kwestia.glosujacy.slice(),"idUser"));
    //var tabGlosujacy = getAllUsersWhoVoted(kwestia._id);
    if (!_.contains(_.pluck(kwestia.glosujacy.slice(),'idUser'), Meteor.userId())) {//jeżeli użytkownik jeszcze nie głosował
        console.log("Użyt jeszcze nie głosował");
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
        return this.typ=KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true : false;
    },
    isGlosowana:function(){
        return this.status==KWESTIA_STATUS.GLOSOWANA ? true :false;
    },
    thisKwestia: function () {
        var kw = Kwestia.findOne({_id: this._id});
        if (kw) {
            if (kw.isOption)
                Session.set("idKwestia", kw.idParent);
            else
                Session.set("idKwestia", this._id)
        }
    },
    // OPCJE
    ifHasOpcje: function () {
        var kwestiaGlownaId = this._id;
        var k = Kwestia.find({czyAktywny: true, idParent: kwestiaGlownaId, isOption: true}).fetch();
        if (k)
            return true;
        else
            return false;
    },
    //PRIORYTET
    mojPiorytet: function () {
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        if (kwestia) {
            var g = kwestia.glosujacy;
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
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        if (kwestia) {
            //console.log(_.pluck(kwestia.glosujacy,"idUser"));
            //return _.contains(_.pluck(kwestia.glosujacy,"idUser"),Meteor.userId()) ? false :true;
            var g = kwestia.glosujacy;
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
        var tab = Kwestia.findOne(currentKwestiaId);
        if (tab) {
            var liczba = tab.glosujacy.length;
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
    }
});
