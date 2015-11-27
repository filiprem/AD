/**
 * Created by Bartłomiej Szewczyk on 2015-11-26.
 */
Template.addTopicModalInner.events({
    'click #addTopicBtn': function(){
        var topic = [{
            nazwaTemat: document.getElementById("topicName").value,
            opis: document.getElementById("topicDescription").value
        }];
        console.log(topic[0].nazwaTemat);
        var topicsCount = Temat.find({nazwaTemat: topic[0].nazwaTemat}).count();

        if(topicsCount > 0){
            GlobalNotification.error({
                title: 'Uwaga',
                content: "Podany temat już istnieje",
                duration: 5 // duration the notification should stay in seconds
            });
        }else{
            if(topic[0].nazwaTemat == "" || topic[0].nazwaTemat == null){
                GlobalNotification.error({
                    title: 'Uwaga',
                    content: "Pole temat nie może być puste",
                    duration: 5 // duration the notification should stay in seconds
                });
            }else {
                Meteor.call('addTemat', topic, function (error,ret) {
                    if (error) {
                        throwError(error.reason);
                    }
                    else {
                        Session.setPersistent("choosenTopicId", ret);
                        Session.setPersistent("choosenTypeId", null);
                        if(Rodzaj.find({idTemat: ret}).count()>0) {
                            document.getElementById("chooseTypeBtn").disabled = false;
                        }else{
                            document.getElementById("chooseTypeBtn").disabled = true;
                        }
                        document.getElementById("addTypeBtn").disabled = false;
                        $("#addTopicModalId").modal("hide");
                    }
                });
            }
        }
    }
});