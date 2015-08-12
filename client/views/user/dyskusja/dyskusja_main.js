Template.discussionMain.helpers({
    'getPosts':function(id){
        return Posts.find({idKwestia:id,isParent:true},{sort:{wartoscPriorytetu:-1}});
    }
});

Template.discussionPostForm.events({
    'submit #dyskusjaForm':function(e){
        e.preventDefault();

        var message = $(e.target).find('[name=message]').val();
        var idKwestia = $(e.target).find('[name=idKwestia]').val();
        var idUser = Meteor.userId();
        var addDate = new Date();
        var isParent = true;
        var idParent = null;
        var czyAktywny = true;
        var userFullName = Meteor.user().profile.full_name;
        var idParent = null;
        var ratingValue = 0;
        var glosujacy = [];

        var post = [{
            idKwestia: idKwestia,
            wiadomosc: message,
            idUser: idUser,
            userFullName:userFullName,
            addDate: addDate,
            isParent: isParent,
            idParent: idParent,
            czyAktywny: czyAktywny,
            idParent: idParent,
            wartoscPriorytetu: ratingValue,
            glosujacy: glosujacy
        }];

        if (isNotEmpty(post[0].idKwestia,'') && isNotEmpty(post[0].wiadomosc,'komentarz') && isNotEmpty(post[0].idUser,'') &&
            isNotEmpty(post[0].addDate.toString(),'') && isNotEmpty(post[0].czyAktywny.toString(),'') &&
            isNotEmpty(post[0].userFullName,'' && isNotEmpty(post[0].isParent.toString(),''))) {

            Meteor.call('addPost', post, function (error,ret) {
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

Template.discussionRating.events({
    'click #ratingButton':function(e){

        var ratingValue = parseInt(e.target.value);
        var ratingPostId = e.target.name;
        var glosujacy = [];
        console.log(ratingValue+" "+ratingPostId);
        var post = Posts.findOne({_id:ratingPostId});
        var glosujacy = post.glosujacy;
        var glosujacyTab = post.glosujacy.slice();
        var wartoscPriorytetu = parseInt(post.wartoscPriorytetu);
        var object = {
            idUser: Meteor.userId(),
            value: ratingValue
        }
        var flag = false;

        for(var i=0; i < post.glosujacy.length; i++) {
            console.log("for");
            if(post.glosujacy[i].idUser === Meteor.userId()) {
                flag=false;
                if(post.glosujacy[i].value === ratingValue) {
                    throwError("Nadałeś już priorytet o tej wadze w tym poście!");
                    return false;
                } else {
                    wartoscPriorytetu -=glosujacyTab[i].value;
                    glosujacyTab[i].value =  ratingValue;
                    wartoscPriorytetu +=glosujacyTab[i].value;
                }
            } else{
                flag = true;
            }
        }

        if(flag){
            glosujacyTab.push(object);
            wartoscPriorytetu+=ratingValue;
        }

        if(glosujacy.length==0){
            glosujacyTab.push(object);
            wartoscPriorytetu+=ratingValue;
        }

        var postUpdate = [{
            wartoscPriorytetu: wartoscPriorytetu,
            glosujacy: glosujacyTab
        }];

        Meteor.call('updatePostRating',ratingPostId, postUpdate, function (error,ret) {
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
});