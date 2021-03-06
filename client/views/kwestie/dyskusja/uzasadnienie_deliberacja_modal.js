Template.uzasadnienieDeliberacjaModal.events({
    'click #zatwierdzPrzeniesDoWK': function (e) {
        e.preventDefault();
        var uzasadnienie = document.getElementById('uzasadnienieWK').value;
        if (uzasadnienie) {
            var message = "Proponuję przenieść tę Kwestię do Deliberacji! Dyskusja i siła priorytetu w tym wątku o tym zdecyduje.";
            var idKwestia = Session.get("idkwestiiWK");
            var idUser = Meteor.userId();
            var addDate = new Date();
            var isParent = true;
            var idParent = null;
            var czyAktywny = true;
            var userFullName = Meteor.user().profile.fullName;
            var ratingValue = 0;
            var glosujacy = [];
            var postType = POSTS_TYPES.DELIBERACJA;

            var post = [{
                idKwestia: idKwestia,
                wiadomosc: message,
                idUser: idUser,
                uzasadnienie:uzasadnienie,
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
                        else {
                            throwError(error.reason);
                        }
                    }
                    else {
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
                        document.getElementById("message").value = "";
                        $("#uzasadnijWyborWK").modal("hide");
                        Session.set("idkwestiiWK", null);
                        $('html, body').animate({
                            scrollTop: $(".doWKClass").offset().top
                        }, 600);
                    }
                });
            }
        }
    },
    'click #anulujButton': function (e) {
        e.preventDefault();
        document.getElementById('uzasadnienieArchiwum').value = "";
        $("#uzasadnijWyborArchiwum").modal("hide");
    }
});