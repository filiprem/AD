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
    'click #addTypeBtn': function(){
        var type = [{
            idTemat: Session.get("choosenTopicId"),
            nazwaRodzaj: document.getElementById("typeName").value
        }];

        Meteor.call('addRodzaj', type, function (error,ret) {
            if (error) {
                throwError(error.reason);
            }
            else {
                Session.setPersistent("choosenTypeId", ret);
                $("#addTypeModalId").modal("hide");
            }
        });
    }
});