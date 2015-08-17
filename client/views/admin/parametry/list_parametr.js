Template.listParametr.rendered = function () {
};

Template.listParametr.events({
    'click .glyphicon-trash': function (event, template) {
        Session.set('parametrInScope', this);
    },
    'click .glyphicon-pencil': function (event, template) {
        Session.set('parametrInScope', this);
    }
});
Template.listParametr.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'nazwaOrganizacji', label: "Nazwa Organizacji"},
                {key: 'terytorium', label: "Terytorium"},
                {key: 'kontakty', label: "Kontakt"},
                {key: 'regulamin', label: "Regulamin"},
                {key: 'options', label: "Opcje", tmpl: Template.editColumnParametr}
            ]
        };
    },
    ParametrListAdmin: function () {
        return Parametr.find({}).fetch();
    },
    email: function () {
        return getEmail(this);
    },
    parametrCount: function () {
        return Parametr.find().count();
    },
    isAdminUser: function () {
        return IsAdminUser();
    }
});