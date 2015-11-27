/**
 * Created by Bartłomiej Szewczyk on 2015-11-26.
 */
Template.addTypeModalInner.helpers({
    topicName: function() {
        var topicId = Session.get("choosenTopicId");
        if (topicId!=null)
            return Temat.findOne({_id: topicId}).nazwaTemat;
        else
            return null
    }
});

Template.addTypeModalInner.events({
    'click #addTypeModalBtn': function(){
        document.getElementById("addTypeModalBtn").disabled = true;
        Meteor.setTimeout(function(){
            document.getElementById("addTypeModalBtn").disabled = false;
        }, 2000);
        var type = [{
            idTemat: Session.get("choosenTopicId"),
            nazwaRodzaj: document.getElementById("typeName").value
        }];

        typesCount = Rodzaj.find({idTemat: type[0].idTemat, nazwaRodzaj: type[0].nazwaRodzaj}).count();
        console.log(typesCount);
        if(typesCount>0){
            GlobalNotification.error({
                title: 'Uwaga',
                content: "Podany rodzaj dla tego tematu już istnieje",
                duration: 5 // duration the notification should stay in seconds
            });
        }else{
            if(type[0].nazwaRodzaj == "" || type[0].nazwaRodzaj == null) {
                GlobalNotification.error({
                    title: 'Uwaga',
                    content: "Pole rodzaj nie może być puste",
                    duration: 5 // duration the notification should stay in seconds
                });
            }else{
                Meteor.call('addRodzaj', type, function (error, ret) {
                    if (error) {
                        throwError(error.reason);
                    }
                    else {
                        Session.setPersistent("choosenTypeId", ret);
                        $("#addTypeModalId").modal("hide");
                        document.getElementById("chooseTypeBtn").disabled = false;
                    }
                });
            }
        }

        if(Rodzaj.find({idTemat: type[0].idTemat}).count()>0) {
            document.getElementById("chooseTypeBtn").disabled = false;
        }else{
            document.getElementById("chooseTypeBtn").disabled = true;
        }
    }
});