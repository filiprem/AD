Template.addRealizationReportModal.rendered=function(){
    $("#addRRForm").validate({
        rules: {
            raportTitle: {
                maxlength: 400
            },
            raportDescription: {
                maxlength: 4000
            }
        },
        messages: {
            raportTitle: {
                required: fieldEmptyMessage(),
                maxlength: maxLengthMessage(400)
            },
            raportDescription: {
                required: fieldEmptyMessage(),
                maxlength: maxLengthMessage(4000)
            }
        },
        highlight: function (element) {
            highlightFunction(element);
        },
        unhighlight: function (element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            validationPlacementError(error, element);
        }
    })
};
Template.addRealizationReportModal.events({
    'click #anuluj':function(e){
        e.preventDefault();
        document.getElementById("addRRForm").reset();
    },
    'submit form': function (e) {
        e.preventDefault();
        if ($('#addRRForm').valid()) {
            var message=$(e.target).find('[name=raportTitle]').val();
            console.log("Messageeee");
            var uzasadnienie=$(e.target).find('[name=raportDescription]').val();
            var idKwestia = this.idKwestia;
            var idUser = Meteor.userId();
            var addDate = new Date();
            var isParent = true;
            var idParent = null;
            var czyAktywny = true;
            var userFullName = Meteor.user().profile.fullName;
            var ratingValue = 0;
            var glosujacy = [];
            var postType = POSTS_TYPES.RAPORT;

            var post = [{
                idKwestia: idKwestia,
                wiadomosc: message,
                uzasadnienie: uzasadnienie,
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
                    var idPost=ret;
                    var newRaport={
                        idAutor:idUser,
                        autorFullName:userFullName,
                        dataUtworzenia:new Date(),
                        idKwestia:idKwestia,
                        tytul:message,
                        opis:uzasadnienie,
                        idPost:idPost
                    };
                    Meteor.call("addRaportMethod",newRaport,function(error){
                       if(error)
                            throwError(error.reason);
                    });

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
                    document.getElementById("addRRForm").reset();
                    $("#addRRModal").modal("hide");
                    $('html, body').animate({
                        scrollTop: $(".doRealizationRaportClass").offset().top
                    }, 600);
                }
            });
        }
        else document.getElementById("addRR").disabled = false;
    }
});