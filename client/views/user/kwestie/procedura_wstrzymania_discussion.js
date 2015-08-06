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
        var parentId = null;
        var ratingValue = null;
        var glosujacy = [];

        var post = [{
            kwestia_suspended_id: kwestia_suspended_id,
            post_message: message,
            user_id: userId,
            user_full_name:user_full_name,
            add_date: add_date,
            isParent: isParent,
            czyAktywny: czyAktywny,
            parentId: parentId,
            wartoscPriorytetu: ratingValue,
            glosujacy: glosujacy
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
        var ratingValue = null;
        var glosujacy = [];

        var post = [{
            kwestia_suspended_id: kwestia_suspended_id,
            post_message: message,
            user_id: userId,
            user_full_name: user_full_name,
            add_date: add_date,
            isParent: isParent,
            czyAktywny: czyAktywny,
            parentId: parentId,
            wartoscPriorytetu: ratingValue,
            glosujacy: glosujacy
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

Template.postRating.events({
   'click #ratingButton':function(e){

       var ratingValue = e.target.value;
       var ratingPostId = e.target.name;
       var glosujacy = [];

       console.log(ratingValue+" "+ratingPostId);

       var post = KwestiaSuspendedPosts.findOne({_id:ratingPostId});

       var flaga = false;
       for(var i=0; i < post.glosujacy.length; i++) {

           if(post.glosujacy[i][0] === Meteor.userId) {

               if(post.glosujacy[i][1] === e.target.value) {
                   throwError("Nadałeś już priorytet o tej wadze w tej kwestii!");
                   return false;
               } else if(post.glosujacy[i][1] > e.target.value) {

                   var roznica = post.glosujacy[i][1] - e.target.value;
                   roznica = -roznica;

                   KwestiaSuspendedPosts.update(ratingPostId, {$set: {glosujacy: [[user._id, liczba]]}, $inc: {wartoscPriorytetu: roznica}});
                   flaga = true;
               } else if(post.glosujacy[i][1] < liczba) {

                   var roznica = e.target.value - post.glosujacy[i][1];
                   Kwestia.update(ratingPostId, {$set: {glosujacy: [[user._id, liczba]]} , $inc: {wartoscPriorytetu: roznica}});
                   flaga = true;
               }
           }
       }
       if(flaga === false) {

           var srednia = (kwestia.wartoscPriorytetu + liczba)/(kwestia.glosujacy.length + 1);
           Kwestia.update(currentKwestiaId, {$addToSet: {glosujacy: [user._id, liczba]}, $inc: {wartoscPriorytetu: liczba}, $set: {sredniaPriorytet: srednia}});
           flaga = true;
       }


       var postUpdate = [{
           kwestia_suspended_id: post.kwestia_suspended_id,
           post_message: post.post_message,
           user_id: post.user_id,
           user_full_name: post.user_full_name,
           add_date: post.add_date,
           isParent: post.isParent,
           parentId: post.parentId,
           czyAktywny: post.czyAktywny,
           wartoscPriorytetu: ratingValue,
           glosujacy: glosujacy
       }]

       if (isNotEmpty(post[0].kwestia_suspended_id) && isNotEmpty(post[0].post_message)) {
           Meteor.call('updateKwestiaSuspendedPostsRating', post, function (error,ret) {
               if (error) {
                   if (typeof Errors === "undefined")
                       Log.error('Error: ' + error.reason);
                   else
                       throwError(error.reason);
               }else{
                   console.log("Update zaliczony");
               }
           });
       }
   }
});