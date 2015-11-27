/**
 * Created by Bartłomiej Szewczyk on 2015-11-23.
 */
Template.chooseTypeModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'nazwaRodzaj',
                    label: "Nazwa"
                },
                {
                    key: '_id',
                    label: "",
                    tmpl: Template.typeName
                }
            ]
        };
    },
    TypeList: function(){
        var topicId = Session.get("choosenTopicId");
        return Rodzaj.find({idTemat: topicId});
    }
});

Template.typeName.events({
    'click #chosenTypeBtn': function() {
        Session.setPersistent("choosenTypeId", this._id);
        $("#chooseTypeModalId").modal("hide");
    }
});