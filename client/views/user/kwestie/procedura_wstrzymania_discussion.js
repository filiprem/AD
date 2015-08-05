Template.discussionMainPanel.helpers({
    'getPosts':function(id){
        return KwestiaSuspensionPosts.find({kwestia_suspension_id:id});
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
        return KwestiaSuspensionPosts.find({parentId:id, isParent:false, czyAktywny:true});
    },
    'getAnswersCount':function(id){
        return KwestiaSuspensionPosts.find({parentId:id, isParent:false, czyAktywny:true}).count();
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
        var kwestia_suspension_id = $(e.target).find('[name=kwestia_suspension_id]').val();
        var userId = Meteor.userId();
        var add_date = new Date();
        var isParent = true;
        var czyAktywny = true;
        var user_full_name = Meteor.user().profile.full_name;

        var post = [{
            kwestia_suspension_id: kwestia_suspension_id,
            post_message: message,
            user_id: userId,
            user_full_name:user_full_name,
            add_date: add_date,
            isParent: isParent,
            czyAktywny: czyAktywny
        }];

        if (isNotEmpty(post[0].kwestia_suspension_id) && isNotEmpty(post[0].post_message) && isNotEmpty(post[0].user_id) &&
            isNotEmpty(post[0].add_date) && isNotEmpty(post[0].czyAktywny) && isNotEmpty(post[0].user_full_name && isNotEmpty(post[0].isParent))) {

            Meteor.call('addKwestiaSuspensionPosts', post, function (error,ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                }
            });
        }
    }
});

Template.postAnswerForm.events({
    'submit #postAnswerFormId':function(e){
        e.preventDefault();

        var message = $(e.target).find('[name=answer_message]').val();
        var kwestia_suspension_id = $(e.target).find('[name=answer_kwestia_suspension_id]').val();
        var parentId = $(e.target).find('[name=answer_post_id]').val();
        var userId = Meteor.userId();
        var add_date = new Date();
        var isParent = false;
        var czyAktywny = true;
        var user_full_name = Meteor.user().profile.full_name;

        var post = [{
            kwestia_suspension_id: kwestia_suspension_id,
            post_message: message,
            user_id: userId,
            user_full_name: user_full_name,
            add_date: add_date,
            isParent: isParent,
            parentId: parentId,
            czyAktywny: czyAktywny
        }];

        if (isNotEmpty(post[0].kwestia_suspension_id) && isNotEmpty(post[0].post_message) &&
            isNotEmpty(post[0].user_id) && isNotEmpty(post[0].add_date) &&
            isNotEmpty(post[0].parentId) && isNotEmpty(post[0].user_full_name) &&
            !post[0].isParent && post[0].czyAktywny) {

            Meteor.call('addKwestiaSuspensionPostsAnswer', post, function (error,ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                }
            });
        }
    }
});

