Template.editTypeAndTopic.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
}

Template.listaKwestiiOczekujacych.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'dataWprowadzenia', label: "Data wprowadzenia", tmpl: Template.dataUtwKwestia },
                { key: 'kwestiaNazwa', label: "Nazwa kwestii", tmpl: Template.nazwaKwestii },
                { key: 'sugerowanyTemat', label: "Sugerowany temat", tmpl: Template.sugerowanyTemat },
                { key: 'sugerowanyRodzaj', label: "Sugerowany rodzaj", tmpl: Template.sugerowanyRodzaj },
                { key: '_id', label: "Opcje", tmpl: Template.editTypeAndTopic }
            ]
        };
    },
    listOfIssues: function () {
        var status = KWESTIA_STATUS.KATEGORYZOWANA;
        return Kwestia.find({status: status, czyAktywny: true}).fetch();
    }
});
