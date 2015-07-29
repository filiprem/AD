Template.listTemat.rendered = function()
{};

Template.listTemat.events({
    'click .glyphicon-trash': function(event, template) {
        Session.set('tematInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
        Session.set('tematInScope', this);
    }
});
Template.listTemat.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: true,
            enableRegex: false,
            fields: [
                {key: 'nazwaTemat', label: "Nazwa"},
                {key: 'opis', label: "Opis"},
                {key: 'options', label: "Opcje", tmpl: Template.editColumnTemat }
            ]
        };
    },
    TematListAdmin: function(){
        return Temat.find({}).fetch();
    },
    tematCount: function(){
        return Temat.find().count();
    },
    isAdminUser: function() {
        return IsAdminUser();
    }
});
