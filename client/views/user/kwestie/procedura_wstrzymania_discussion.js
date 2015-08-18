Template.discussionMainPanel.helpers({
    'getPosts':function(id){
        return KwestiaSuspendedPosts.find({kwestiaSuspendedId:id,isParent:true});
    }
});

Template.postItem.helpers({
    'getSimpleDate':function(date){
        return moment(date).format("YYYY-MM-DD,");
    },
    'getFullHourDate':function(date){
        return moment(date).format("HH:mm:ss");
    },
    'getAnswers':function(id){
        return KwestiaSuspendedPosts.find({parentId:id, isParent:false, czyAktywny:true});
    },
    'getAnswersCount':function(id){
        return KwestiaSuspendedPosts.find({parentId:id, isParent:false, czyAktywny:true}).count();
    }
});

Template.postAnswerItem.helpers({
    'getSimpleDate':function(date){
        return moment(date).format("YYYY-MM-DD,");
    },
    'getFullHourDate':function(date){
        return moment(date).format("HH:mm:ss");
    }
});

Template.postForm.events({
    'submit #discussionFormId':function(e){
        e.preventDefault();

        var message = $(e.target).find('[name=message]').val();
        var kwestiaSuspendedId = $(e.target).find('[name=kwestia_suspended_id]').val();
        var idUser = Meteor.userId();
        var add_date = new Date();
        var isParent = true;
        var czyAktywny = true;
        var userFullName = Meteor.user().profile.fullName;

        var post = [{
            kwestiaSuspendedId: kwestiaSuspendedId,
            post_message: message,
            idUser: idUser,
            userFullName:userFullName,
            add_date: add_date,
            isParent: isParent,
            czyAktywny: czyAktywny
        }];
        if (isNotEmpty(post[0].kwestiaSuspendedId,'') && isNotEmpty(post[0].post_message,'komentarz') && isNotEmpty(post[0].idUser,'') &&
            isNotEmpty(post[0].add_date.toString(),'') && isNotEmpty(post[0].czyAktywny.toString(),'') && isNotEmpty(post[0].userFullName,'' && isNotEmpty(post[0].isParent.toString(),''))) {

            Meteor.call('addKwestiaSuspendedPosts', post, function (error,ret) {
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
    }
});

Template.postAnswerForm.events({
    'submit #postAnswerFormId':function(e){
        e.preventDefault();

        var message = $(e.target).find('[name=answer_message]').val();
        var kwestiaSuspendedId = $(e.target).find('[name=answer_kwestia_suspended_id]').val();
        var parentId = $(e.target).find('[name=answer_post_id]').val();
        var idUser = Meteor.userId();
        var add_date = new Date();
        var isParent = false;
        var czyAktywny = true;
        var userFullName = Meteor.user().profile.fullName;

        var post = [{
            kwestiaSuspendedId: kwestiaSuspendedId,
            post_message: message,
            idUser: idUser,
            userFullName: userFullName,
            add_date: add_date,
            isParent: isParent,
            parentId: parentId,
            czyAktywny: czyAktywny
        }];

        if (isNotEmpty(post[0].kwestiaSuspendedId,'a') && isNotEmpty(post[0].post_message,'komentarz') &&
            isNotEmpty(post[0].idUser,'b') && isNotEmpty(post[0].addDate,'c') &&
            isNotEmpty(post[0].parentId,'d') && isNotEmpty(post[0].userFullName,'e') &&
            !post[0].isParent && post[0].czyAktywny) {

            Meteor.call('addKwestiaSuspendedPostsAnswer', post, function (error,ret) {
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

