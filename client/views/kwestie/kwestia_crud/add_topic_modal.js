/**
 * Created by Bartłomiej Szewczyk on 2015-11-26.
 */
Template.addTopicModalInner.rendered = function(){
    document.getElementById("addTopicModalBtn").disabled = false;
};
Template.addTopicModalInner.events({
    'click #addTopicModalBtn': function(){
        document.getElementById("addTopicModalBtn").disabled = true;
        Meteor.setTimeout(function(){
            document.getElementById("addTopicModalBtn").disabled = false;
        }, 2000);

        var topicName = document.getElementById("topicName").value;

        //var topic = [{
        //    nazwaTemat: document.getElementById("topicName").value,
        //    opis: document.getElementById("topicDescription").value
        //}];

        var topicsCount = Temat.find({nazwaTemat: topicName}).count();

        if(topicsCount > 0){
            GlobalNotification.error({
                title: 'Uwaga',
                content: "Podany temat już istnieje",
                duration: 5 // duration the notification should stay in seconds
            });
        }else{
            if(topicName == "" || topicName == null){
                GlobalNotification.error({
                    title: 'Uwaga',
                    content: "Pole temat nie może być puste",
                    duration: 5 // duration the notification should stay in seconds
                });
            }else {
                //Meteor.call('addTemat', topic, function (error,ret) {
                //    if (error) {
                //        throwError(error.reason);
                //    }
                //    else {
                //        Session.setPersistent("choosenTopicId", ret);
                //        Session.setPersistent("choosenTypeId", null);
                //        if(Rodzaj.find({idTemat: ret}).count()>0) {
                //            document.getElementById("chooseTypeBtn").disabled = false;
                //        }else{
                //            document.getElementById("chooseTypeBtn").disabled = true;
                //        }
                //        document.getElementById("addTypeBtn").disabled = false;
                //        $("#addTopicModalId").modal("hide");
                //    }
                //});

                document.getElementById("addTypeBtn").disabled = false;
                Session.setPersistent("choosenTopic", topicName);
                Session.setPersistent("choosenType", null);
                $("#addTopicModalId").modal("hide");
            }
        }
    }
});