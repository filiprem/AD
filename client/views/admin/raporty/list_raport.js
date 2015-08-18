Template.listRaport.rendered = function () {
};

Template.listRaport.events({
    'click .glyphicon-trash': function (event, template) {
        Session.set('raportInScope', this);
    },
    'click .glyphicon-pencil': function (event, template) {
        Session.set('raportInScope', this);
    }
});
Template.listRaport.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'terminyGlosowan', label: "Terminy głosowań"},
                {key: 'uzytkownicy', label: "Użytkownicy"},
                {key: 'realizacja', label: "Realizacja"},
                {key: 'options', label: "Opcje", tmpl: Template.editColumnRaport}
            ]
        };
    },
    RaportListAdmin: function () {
        return Raport.find({}).fetch();
    },
    email: function () {
        return getEmail(this);
    },
    raportCount: function () {
        return Raport.find().count();
    },
    isAdminUser: function () {
        return IsAdminUser();
    }
});

