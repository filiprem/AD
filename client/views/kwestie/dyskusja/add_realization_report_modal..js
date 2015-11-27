Template.addRealizationReportModal.rendered=function(){
    document.getElementById("addRR").disabled = false;
    //$("#addRealizationReportForm").validate({
    //    rules: {
    //        reportTitle: {
    //            maxlength: 100
    //        }
    //    },
    //    messages: {
    //        reportTitle: {
    //            required: fieldEmptyMessage(),
    //            maxlength: maxLengthMessage(100)
    //        },
    //        reportDescription: {
    //            required: fieldEmptyMessage()
    //        }
    //    },
    //    highlight: function (element) {
    //        highlightFunction(element);
    //    },
    //    unhighlight: function (element) {
    //        unhighlightFunction(element);
    //    },
    //    errorElement: 'span',
    //    errorClass: 'help-block',
    //    errorPlacement: function (error, element) {
    //        validationPlacementError(error, element);
    //    }
    //})
};
Template.addRealizationReportModal.events({
    'submit form':function(e){
    //'click #addRR': function (e) {
        e.preventDefault();
        console.log("bummmmmmmmmmmm");
       // var reportDescription = document.getElementById('reportDescription').value;
       // var reportTitle = document.getElementById('reportTitle').value;
        //if (reportDescription && reportTitle) {
           // if(reportDescription.trim()!="" && reportTitle.trim()!=""){
                //document.getElementById("addRR").disabled = true;
                //var message = "Proponuję uznanie tej kwestii za Zrealizowaną! Dyskusja i siła priorytetu w tym wątku o tym zdecyduje.";
                //var idKwestia = this.idKwestia;
                //var idUser = Meteor.userId();
                //var addDate = new Date();
                //var isParent = true;
                //var idParent = null;
                //var czyAktywny = true;
                //var userFullName = Meteor.user().profile.fullName;
                //var ratingValue = 0;
                //var glosujacy = [];
                //var postType = POSTS_TYPES.ZREALIZOWANA;
                //
                //var post = [{
                //    idKwestia: idKwestia,
                //    wiadomosc: message,
                //    idUser: idUser,
                //    uzasadnienie:message,
                //    userFullName: userFullName,
                //    addDate: addDate,
                //    isParent: isParent,
                //    idParent: idParent,
                //    czyAktywny: czyAktywny,
                //    idParent: idParent,
                //    wartoscPriorytetu: ratingValue,
                //    glosujacy: glosujacy,
                //    postType: postType
                //}];
                //
                //Meteor.call('addPost', post, function (error, ret) {
                //    if (error) {
                //        if (typeof Errors === "undefined")
                //            Log.error('Error: ' + error.reason);
                //        else {
                //            throwError(error.reason);
                //        }
                //    }
                //    else {
                //        var newValue = 0;
                //        newValue = Number(RADKING.DODANIE_ODNIESIENIA) + getUserRadkingValue(Meteor.userId());
                //        Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                //            if (error) {
                //                if (typeof Errors === "undefined")
                //                    Log.error('Error: ' + error.reason);
                //                else
                //                    throwError(error.reason);
                //            }
                //        });
                //        document.getElementById("message").value = "";
                //        $("#addRealizationReport").modal("hide");
                //        $('html, body').animate({
                //            scrollTop: $(".doZrealizowaniaClass").offset().top
                //        }, 600);
                //    }
                //
                //});
                //}
            //}
        //}
    },
    'click .btn btn-danger': function (e) {
        e.preventDefault();
        console.log("anulujjjjjjjjjjjjjjjjjjjjjjj");
       // document.getElementById('reportDescription').value = "";
        $("#addRealizationReport").modal("hide");
    }
});