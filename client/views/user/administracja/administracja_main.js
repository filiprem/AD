Template.administracjaUserMain.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'dataWprowadzenia', label: Template.listKwestiaAdminColumnLabel, labelData: {title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji", text:"Data"}, tmpl:Template.dataUtwKwestia},
                {key: 'kwestiaNazwa', label: Template.listKwestiaAdminColumnLabel, labelData: {title: "Kliknij, aby zobaczyć szczegóły", text:"Nazwa Kwestii"}, tmpl: Template.nazwaKwestii},
                {key: 'status', label: "Status",  tmpl: Template.statusKwestii},
                //{key: 'options', label: "Opcje", tmpl: Template.editTypeAndTopic }
            ]
        };
    },
    listOfIssues: function(){
        return Kwestia.find().fetch();
    }
});