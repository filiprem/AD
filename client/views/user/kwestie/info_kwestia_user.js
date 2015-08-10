Template.informacjeKwestia.events({
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
    'click #proceduraWstrzymaniaButton': function () {
        Router.go('proceduraWstrzymania', {_id: ret});
    },
    'click #wstrzymajKwestieButton': function (e) {
        var item = [{
            idKwestia: this._id,
            userId: Meteor.userId(),
            uzasadnienie: "",
            czyAktywny: true
        }];

        if (isNotEmpty(item[0].idKwestia) &&
            isNotEmpty(item[0].userId)) {
            Meteor.call('addKwestiaSuspended', item, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                } else {
                    Router.go('proceduraWstrzymania', {_id: ret});
                }
            });
        }
    },
    'click #addOptionButton': function () {
        Router.go("addKwestiaOpcja");
    },
    'click #b-5': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt((document.getElementById("b-5")).value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b-4': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b-4").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b-3': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b-3").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b-2': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b-2").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b-1': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b-1").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b0': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b0").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b1': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b1").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b2': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b2").value)
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b3': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b3").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b4': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b4").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
    'click #b5': function (e) {
        e.preventDefault();
        var user = new Meteor.user();
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b5").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if(kwestia.glosujacy[i][0] === user._id)
            {
                if(kwestia.glosujacy[i][1] === liczba)
                {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if(kwestia.glosujacy[i][1] > liczba)
                {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia}, $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
                else if(kwestia.glosujacy[i][1] < liczba)
                {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica)/kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {$set: {glosujacy: [[user._id, liczba]], sredniaPriorytet: srednia} , $inc: {wartoscPriorytetu: roznica}});
                    flaga = true;
                }
            }
        }
        if(flaga === false)
        {
            var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
            flaga = true;
        }
    },
});
Template.informacjeKwestia.helpers({
    thisKwestia: function () {
        var k = Session.get("idKwestia")
    },
    mojPiorytet: function () {
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var g = kwestia.glosujacy;
        for (var i = 0; i < g.length; i++) {
            if (Meteor.userId() == g[i][0]) {
                return g[i][1];
            }
        }
    },
    glosujacyCount: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        var liczba = tab.glosujacy.length;
        return liczba;
    },
    nazwa: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        return tab;
    },
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    },
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) {
            return moment(d).format("DD-MM-YYYY, HH:mm");
        }
    },
    dateG: function () {
        var d = this.dataGlosowania;
        if (d) {
            return moment(d).format("DD-MM-YYYY, HH:mm");
        }
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
    'isIssueSuspended': function (id) {
        return KwestiaSuspended.find({idKwestia: id, czyAktywny: true}).count() <= 0 ? false : true;
    },
    'getIssueSuspended': function (id) {
        return KwestiaSuspended.findOne({idKwestia: id, czyAktywny: true});
    }
});