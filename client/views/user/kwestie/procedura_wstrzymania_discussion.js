Template.discussionMainPanel.helpers({
    'getPosts':function(id){
        return KwestiaSuspendedPosts.find({kwestia_suspended_id:id});
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
        var kwestia_suspended_id = $(e.target).find('[name=kwestia_suspended_id]').val();
        var userId = Meteor.userId();
        var add_date = new Date();
        var isParent = true;
        var czyAktywny = true;
        var user_full_name = Meteor.user().profile.full_name;

        var post = [{
            kwestia_suspended_id: kwestia_suspended_id,
            post_message: message,
            user_id: userId,
            user_full_name:user_full_name,
            add_date: add_date,
            isParent: isParent,
            czyAktywny: czyAktywny
        }];

        if (isNotEmpty(post[0].kwestia_suspended_id) && isNotEmpty(post[0].post_message) && isNotEmpty(post[0].user_id) &&
            isNotEmpty(post[0].add_date) && isNotEmpty(post[0].czyAktywny) && isNotEmpty(post[0].user_full_name && isNotEmpty(post[0].isParent))) {

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
        var kwestia_suspended_id = $(e.target).find('[name=answer_kwestia_suspended_id]').val();
        var parentId = $(e.target).find('[name=answer_post_id]').val();
        var userId = Meteor.userId();
        var add_date = new Date();
        var isParent = false;
        var czyAktywny = true;
        var user_full_name = Meteor.user().profile.full_name;

        var post = [{
            kwestia_suspended_id: kwestia_suspended_id,
            post_message: message,
            user_id: userId,
            user_full_name: user_full_name,
            add_date: add_date,
            isParent: isParent,
            parentId: parentId,
            czyAktywny: czyAktywny
        }];

        if (isNotEmpty(post[0].kwestia_suspended_id) && isNotEmpty(post[0].post_message) &&
            isNotEmpty(post[0].user_id) && isNotEmpty(post[0].add_date) &&
            isNotEmpty(post[0].parentId) && isNotEmpty(post[0].user_full_name) &&
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

