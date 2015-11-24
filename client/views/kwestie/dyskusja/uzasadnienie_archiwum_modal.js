Template.uzasadnienieArchiwumModal.events({
    'click #zatwierdzPrzeniesDoArchiwum': function (e) {
        e.preventDefault();
        var uzasadnienie = document.getElementById('uzasadnienieArchiwum').value;
        if (uzasadnienie) {
            var message = "Proponuję przenieść tę Kwestię do Archiwum! Dyskusja i siła priorytetu w tym wątku o tym zdecyduje.";
            var idKwestia = this.idKwestia;
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
                uzasadnienie:uzasadnienie,
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
            }];
                Meteor.call('addPost', post, function (error, ret) {
                    if (error) {
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else {
                            throwError(error.reason);
                        }
                    }
                    else {
                        //var wiadomosc = uzasadnienie;
                        //var idParent = ret;
                        //var idUser = Meteor.userId();
                        //var addDate = new Date();
                        //var isParent = false;
                        //var czyAktywny = true;
                        //var userFullName = Meteor.user().profile.fullName;
                        //var ratingValue = 0;
                        //var glosujacy = [];
                        //
                        //var post = [{
                        //    idKwestia: idKwestia,
                        //    wiadomosc: wiadomosc,
                        //    idUser: idUser,
                        //    userFullName: userFullName,
                        //    addDate: addDate,
                        //    isParent: isParent,
                        //    idParent: idParent,
                        //    czyAktywny: czyAktywny,
                        //    wartoscPriorytetu: ratingValue,
                        //    glosujacy: glosujacy
                        //}];
                        //
                        //Meteor.call('addPostAnswer', post, function (error, ret) {
                        //    if (error) {
                        //        if (typeof Errors === "undefined")
                        //            Log.error('Error: ' + error.reason);
                        //        else
                        //            throwError(error.reason);
                        //    } else {
                                //document.getElementsByName("answer_message" + idParent)[0].value = "";
                                var newValue = 0;
                                newValue = Number(RADKING.DODANIE_ODNIESIENIA) + getUserRadkingValue(Meteor.userId());
                                Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                                    if (error) {
                                        if (typeof Errors === "undefined")
                                            Log.error('Error: ' + error.reason);
                                        else
                                            throwError(error.reason);
                                    }
                                });
                        //    }
                        //});
                        document.getElementById("message").value = "";
                        $("#uzasadnijWyborArchiwum").modal("hide");
                        $('html, body').animate({
                            scrollTop: $(".doArchiwumClass").offset().top
                        }, 600);
                    }
                });
        }
    },
    'click #anulujButton': function (e) {
        e.preventDefault();
        document.getElementById('uzasadnienieArchiwum').value = "";
        $("#uzasadnijWyborArchiwum").modal("hide");
    }
});