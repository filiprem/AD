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
            idUser: Meteor.userId(),
            uzasadnienie: "",
            czyAktywny: true
        }];

        if (isNotEmpty(item[0].idKwestia) &&
            isNotEmpty(item[0].idUser)) {
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
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b-4': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b-3': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b-2': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b-1': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b0': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b1': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b2': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b3': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b4': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user, liczba]],
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
                $addToSet: {glosujacy: [user, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    },
    'click #b5': function (e) {
        e.preventDefault();
        var user = new Meteor.userId();
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
            if (kwestia.glosujacy[i][0] === user) {
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
                            glosujacy: [[user, liczba]],
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
                            glosujacy: [[user._id, liczba]],
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
                $addToSet: {glosujacy: [user._id, liczba]},
                $inc: {wartoscPriorytetu: liczba},
                $set: {sredniaPriorytet: srednia}
            });
            flaga = true;
        }
    }
});
Template.informacjeKwestia.helpers({
    isAdmin: function(){
        if(Meteor.user().roles=="admin")
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
        //if(s){
        var ss = s.toFixed(2);
        return ss;
        //}
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
    'isIssueSuspended': function (id) {
        return KwestiaSuspended.find({idKwestia: id, czyAktywny: true}).count() <= 0 ? false : true;
    },
    'getIssueSuspended': function (id) {
        return KwestiaSuspended.findOne({idKwestia: id, czyAktywny: true});
    }
});