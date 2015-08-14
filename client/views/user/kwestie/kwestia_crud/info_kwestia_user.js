Template.informacjeKwestia.rendered = function() {
    var self = Template.instance();
    var currentKwestiaId=Session.get("idKwestia");
    var tabOfUsersVoted=[];
    tabOfUsersVoted=getAllUsersWhoVoted(currentKwestiaId);
    if(_.contains(tabOfUsersVoted,Meteor.userId())){
        self.ifUserVoted.set(true);
    }
    else{
        self.ifUserVoted.set(false);
    }
},
Template.informacjeKwestia.created = function(){
    this.ifUserVoted = new ReactiveVar();
},
Template.informacjeKwestia.events({
    'click #dyskusja': function (e){
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

        $('html, body').animate({
            scrollTop:  $("#dyskusja").offset().top
        }, 600);

        //$(document).scrollTop( $("#dyskusja").offset().top );

        var message = "Proponuję przenieść tę kwestię do Archiwum? Dyskusja i siła priorytetu w tym wątku o tym zdecyduje.";
        var idKwestia = Session.get("idKwestia");
        var idUser = Meteor.userId();
        var addDate = new Date();
        var isParent = true;
        var idParent = null;
        var czyAktywny = true;
        var userFullName = Meteor.user().profile.fullName;
        var ratingValue = 0;
        var glosujacy = [];
        var postType = POSTS_TYPES.ARCHIWUM;

        var post = [{
            idKwestia: idKwestia,
            wiadomosc: message,
            idUser: idUser,
            userFullName:userFullName,
            addDate: addDate,
            isParent: isParent,
            idParent: idParent,
            czyAktywny: czyAktywny,
            idParent: idParent,
            wartoscPriorytetu: ratingValue,
            glosujacy: glosujacy,
            postType: postType
        }]
        if (isNotEmpty(post[0].idKwestia,'') && isNotEmpty(post[0].wiadomosc,'komentarz') && isNotEmpty(post[0].idUser,'') &&
            isNotEmpty(post[0].addDate.toString(),'') && isNotEmpty(post[0].czyAktywny.toString(),'') &&
            isNotEmpty(post[0].userFullName,'' && isNotEmpty(post[0].isParent.toString(),''))) {

            Meteor.call('addPost', post, function (error,ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                }else{
                    document.getElementById("message").value = "";
                }
            });
        }
    },
    'click #doKosza': function(e){
        e.preventDefault();

        $('html, body').animate({
            scrollTop:  $("#dyskusja").offset().top
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
            userFullName:userFullName,
            addDate: addDate,
            isParent: isParent,
            idParent: idParent,
            czyAktywny: czyAktywny,
            idParent: idParent,
            wartoscPriorytetu: ratingValue,
            glosujacy: glosujacy,
            postType: postType
        }]
        if (isNotEmpty(post[0].idKwestia,'') && isNotEmpty(post[0].wiadomosc,'komentarz') && isNotEmpty(post[0].idUser,'') &&
            isNotEmpty(post[0].addDate.toString(),'') && isNotEmpty(post[0].czyAktywny.toString(),'') &&
            isNotEmpty(post[0].userFullName,'' && isNotEmpty(post[0].isParent.toString(),''))) {

            Meteor.call('addPost', post, function (error,ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                }else{
                    document.getElementById("message").value = "";
                }
            });
        }
    },
    'click #b-5': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt((document.getElementById("b-5")).value);
        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
        else{
            console.log("Użytkownik nadał już priorytet");
        }
    },
    'click #b-4': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b-4").value);
        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
        else{
            console.log("Użytkownik nadał już priorytet");
        }
    },
    'click #b-3': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b-3").value);
        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
        else{
            console.log("Użytkownik nadał już priorytet");
        }
    },
    'click #b-2': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b-2").value);
        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
        else{
            console.log("Użytkownik nadał już priorytet");
        }
    },
    'click #b-1': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b-1").value);
        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
        else{
            console.log("Użytkownik nadał już priorytet");
        }
    },
    'click #b0': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b0").value);
        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
    },
    'click #b1': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        var liczba = parseInt(document.getElementById("b1").value);
        var flaga = false;
        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
        else{
            console.log("Użytkownik nadał już priorytet");
        }
    },
    'click #b2': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b2").value)
        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
    },
    'click #b3': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b3").value);
        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
        else{
            console.log("Użytkownik nadał już priorytet");
        }
    },
    'click #b4': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b4").value);
        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
        else{
            console.log("Użytkownik nadał już priorytet");
        }
    },
    'click #b5': function (e) {
        e.preventDefault();
        var u = Meteor.userId();
        var currentKwestiaId = this._id;
        var parent = this.idParent;
        var kwestieOpcje = Kwestia.find({idParent: parent}).fetch();
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var liczba = parseInt(document.getElementById("b5").value);

        var flaga = false;

        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j][0];
                var oddanyGlos = kwestieOpcje[i].glosujacy[j][1];
                if (user == Meteor.userId()) {
                    if (oddanyGlos == liczba) {
                        throwError("Nadałeś już priorytet o tej wadze innej Kwestii!")
                        return false;
                    }
                }
            }
        }

        for (var i = 0; i < kwestia.glosujacy.length; i++) {
            if (kwestia.glosujacy[i][0] === u) {
                if (kwestia.glosujacy[i][1] === liczba) {
                    throwError("Nadałeś już priorytet o tej wadze w tej Kwestii!");
                    return false;
                }
                else if (kwestia.glosujacy[i][1] > liczba) {
                    var roznica = kwestia.glosujacy[i][1] - liczba;
                    roznica = -roznica;
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
                else if (kwestia.glosujacy[i][1] < liczba) {
                    var roznica = liczba - kwestia.glosujacy[i][1];
                    var srednia = (kwestia.wartoscPriorytetu + roznica) / kwestia.glosujacy.length;
                    Kwestia.update(currentKwestiaId, {
                        $set: {
                            glosujacy: [[u, liczba]],
                            sredniaPriorytet: srednia
                        }, $inc: {wartoscPriorytetu: roznica}
                    });
                    flaga = true;
                }
            }
        }
        if (flaga === false) {
            var srednia = (kwestia.wartoscPriorytetu + liczba) / (kwestia.glosujacy.length + 1);
            Kwestia.update(currentKwestiaId, {
                $addToSet: {glosujacy: [u, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }

        var self = Template.instance();
        if(self.ifUserVoted.get()==false)
        {
            console.log("Użytkownik nie nadał jeszcze priorytetu");
            var newValue=0;
            var pktAddPriorytet=Parametr.findOne({});
            newValue=Number(pktAddPriorytet.pktNadaniePriorytetu)+getUserRadkingValue(Meteor.userId());
            console.log(newValue);
            Meteor.call('updateUserRanking', Meteor.userId(),newValue, function (error) {
                if (error)
                {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                    {
                        throwError(error.reason);
                    }
                }
                else{
                    self.ifUserVoted.set(true);
                }
            });
        }
    }
});
Template.informacjeKwestia.helpers({
    isAdmin: function () {
        if (Meteor.user().roles == "admin")
            return true;
        else
            return false;
    },
    opcje: function () {
        var kwestiaGlownaId = Session.get("idKwestia");
        var op = Kwestia.find({idParent: kwestiaGlownaId}).fetch();
        if (op)
            return true;
        else
            return false;
    },
    czyOpcja: function () {
        if (this.isOption)
            return true;
        else
            return false;
    },
    thisKwestia: function () {
        var k = Session.get("idKwestia")
        var kwestia = Kwestia.findOne({_id: k});
    },
    mojPiorytet: function () {
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        if (kwestia) {
            var g = kwestia.glosujacy;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i][0]) {
                    return g[i][1];
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
                if (Meteor.userId() == g[i][0] && g[i][1] == 0) {
                    return true;
                }
                else {
                    return false;
                }
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
        if (tab) {
            return tab;
        }
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
    czyKliknietoArchiwum: function(){
        var idKw = this._id;
        var z = Posts.findOne({idKwestia: idKw, postType: "archiwum"});
        if(z) return true;
        else return false;
    },
    czyKliknietoKosz: function(){
        var idKw = this._id;
        var z = Posts.findOne({idKwestia: idKw, postType: "kosz"});
        if(z) return true;
        else return false;
    },
    'isIssueSuspended': function (id) {
        return KwestiaSuspended.find({idKwestia: id, czyAktywny: true}).count() <= 0 ? false : true;
    },
    'getIssueSuspended': function (id) {
        return KwestiaSuspended.findOne({idKwestia: id, czyAktywny: true});
    }
});
