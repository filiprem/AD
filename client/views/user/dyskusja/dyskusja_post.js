Template.discussionPostItem.helpers({
    'getSimpleDate':function(date){
        return moment(date).format("YYYY-MM-DD,");
    },
    'getFullHourDate':function(date){
        return moment(date).format("HH:mm:ss");
    },
    'getAnswers':function(id){
        return Posts.find({idParent:id, isParent:false, czyAktywny:true});
    },
    'getAnswersCount':function(id){
        return Posts.find({idParent:id, isParent:false, czyAktywny:true}).count();
    },
    'getLabelClass':function(value){
        return value >= 0 ? "label-success" : "label-danger";
    }
});

Template.discussionAnswerForm.events({
    'submit #dyskusjaAnswerForm':function(e){
        e.preventDefault();

        var wiadomosc = $(e.target).find('[name=answer_message]').val();
        var idKwestia = $(e.target).find('[name=idKwestiaAnswer]').val();
        var idParent = $(e.target).find('[name=idPost]').val();
        var idUser = Meteor.userId();
        var addDate = new Date();
        var isParent = false;
        var czyAktywny = true;
        var userFullName = Meteor.user().profile.full_name;
        var ratingValue = 0;
        var glosujacy = [];

        var post = [{
            idKwestia: idKwestia,
            wiadomosc: wiadomosc,
            idUser: idUser,
            userFullName: userFullName,
            addDate: addDate,
            isParent: isParent,
            idParent: idParent,
            czyAktywny: czyAktywny,
            wartoscPriorytetu: ratingValue,
            glosujacy: glosujacy
        }];

        if (isNotEmpty(post[0].idKwestia,'id kwestii') && isNotEmpty(post[0].wiadomosc,'komentarz') &&
            isNotEmpty(post[0].idUser,'id użytkownika') && isNotEmpty(post[0].addDate.toString(),'data dodania') &&
            isNotEmpty(post[0].idParent,'id parent') && isNotEmpty(post[0].userFullName,'e') &&
            !post[0].isParent && post[0].czyAktywny) {

            Meteor.call('addPostAnswer', post, function (error,ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                }else{
                    document.getElementById("answer_message").value = "";
                }
            });
        }
    }
});

Template.discussionAnswerItem.helpers({
    'getSimpleDate':function(date){
        return moment(date).format("YYYY-MM-DD,");
    },
    'getFullHourDate':function(date){
        return moment(date).format("HH:mm:ss");
    },
    'getLabelClass':function(value){
        return value >= 0 ? "label-success" : "label-danger";
    }
});