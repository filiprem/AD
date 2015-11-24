/**
 * Created by Bartłomiej Szewczyk on 2015-11-23.
 */
Template.chooseTopicModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'nazwaTemat',
                    label: "Nazwa"
                },
                {
                    key: 'opis',
                    label: "Opis"
                },
                {
                    key: '_id',
                    label: "",
                    tmpl: Template.topicName
                }
            ]
        };
    },
    TopicList: function(){
            return Temat.find({});
    }
});

Template.topicName.events({
    'click #choosenTopicBtn': function() {
        Session.setPersistent("choosenTopicId", this._id);
        document.getElementById("chooseTypeBtn").disabled = false;
        document.getElementById("addTypeBtn").disabled = false;
        $("#chooseTopicModalId").modal("hide");
    }
});