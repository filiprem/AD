Template.listaKwestiiOczekujacych.helpers({
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
                {key: 'sugerowanyTemat', label: "Sugerowany temat",  tmpl: Template.sugerowanyTemat},
                {key: 'sugerowanyRodzaj', label: "Sugerowany rodzaj", tmpl: Template.sugerowanyRodzaj},
                {key: 'options', label: "Opcje", tmpl: Template.editTypeAndTopic }
            ]
        };
    },
    listOfIssues: function(){
        var status = KWESTIA_STATUS.KATEGORYZOWANA;
        return Kwestia.find({status:status,czyAktywny:true}).fetch();
    }
});
