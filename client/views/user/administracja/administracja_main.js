Template.administracjaUserMain.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji", text: "Data"},
                    tmpl: Template.dataUtwKwestia
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Kliknij, aby zobaczyć szczegóły",
                        text: "Nazwa Kwestii"
                    },
                    tmpl: Template.nazwaKwestiLink
                },
                {key: 'status', label: "Status", tmpl: Template.statusKwestii},
                //{key: 'options', label: "Opcje", tmpl: Template.editTypeAndTopic }
            ]
        };
    },
    listOfIssues: function () {
     /*   var k = Kwestia.find({}).fetch();
        if (k) {
            return k;
        }*/
         var kwestie = Kwestia.find({
            $where: function () {
                return ((this.czyAktywny == true) && ((this.status==KWESTIA_STATUS.ADMINISTROWANA) ||(this.status==KWESTIA_STATUS.OSOBOWA) || (this.idUser==Meteor.userId())));
            }
        });
        if(kwestie) return kwestie;
        return null;
    },
    listOfIssuesCount: function () {
        var ile = Kwestia.find({}).count();
        return ile > 0 ? true : false;
    }
});