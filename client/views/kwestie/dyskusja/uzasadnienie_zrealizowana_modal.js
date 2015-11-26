Template.uzasadnienieZrealizowanaModalInner.rendered=function(){
    document.getElementById("zatwierdzPrzeniesDoWK").disabled = false;
};
Template.uzasadnienieZrealizowanaModalInner.events({
    'click #zatwierdzPrzeniesDoWK': function (e) {
        e.preventDefault();
        var uzasadnienie = document.getElementById('uzasadnienieZrealizowana').value;
        if (uzasadnienie) {
            if(uzasadnienie.trim()!=""){
                document.getElementById("zatwierdzPrzeniesDoWK").disabled = true;
                var message = "Proponuję uznanie tej kwestii za Zrealizowaną! Dyskusja i siła priorytetu w tym wątku o tym zdecyduje.";
                var idKwestia = this.idKwestia;
                var idUser = Meteor.userId();
                var addDate = new Date();
                var isParent = true;
                var idParent = null;
                var czyAktywny = true;
                var userFullName = Meteor.user().profile.fullName;
                var ratingValue = 0;
                var glosujacy = [];
                var postType = POSTS_TYPES.ZREALIZOWANA;

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
                }];
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
                            //    }
                            //});
                            document.getElementById("message").value = "";
                            $("#uzasadnijRealizacjeKwesti").modal("hide");
                            $('html, body').animate({
                                scrollTop: $(".doZrealizowaniaClass").offset().top
                            }, 600);
                        }

                    });
                }
            }
        }
    },
    'click #anulujButton': function (e) {
        e.preventDefault();
        document.getElementById('uzasadnienieZrealizowana').value = "";
        $("#uzasadnijRealizacjeKwesti").modal("hide");
    }
});