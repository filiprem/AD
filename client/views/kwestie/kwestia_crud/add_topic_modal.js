/**
 * Created by Bartłomiej Szewczyk on 2015-11-26.
 */
Template.addTopicModalInner.events({
    'click #addTopicBtn': function(){
        var topic = [{
            nazwaTemat: document.getElementById("topicName").value,
            opis: document.getElementById("topicDescription").value
        }];

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
});