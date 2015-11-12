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
                    labelData: {//title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji",
                     text: "Data"},
                    tmpl: Template.dataUtwKwestia,
                    sortDirection: "descending"
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        //title: "Kliknij, aby zobaczyć szczegóły",
                        text: "Nazwa Kwestii"
                    },
                    tmpl: Template.nazwaKwestiLink
                },
                {
                    key: 'options',
                    label: "Opcje",
                    tmpl: Template.lobbujZaKwestia
                }
                //{key: 'status', label: "Status", tmpl: Template.statusKwestii},
                //{key: 'options', label: "Opcje", tmpl: Template.editTypeAndTopic }
            ]
        };
    },
    listOfIssues: function () {
        var kwestie = Kwestia.find({
            $where: function () {
                    return ((this.czyAktywny == true) && ((this.status==KWESTIA_STATUS.ADMINISTROWANA)
                    || (this.idUser==Meteor.userId()))
                    || this.typ==KWESTIA_TYPE.ACCESS_DORADCA
                    || this.typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY
                    || this.idZglaszajacego==Meteor.userId());//dla kwesti statusowych
            }
        });
        if(kwestie) return kwestie;
        return null;
    },
    listOfIssuesCount: function () {
        var ile = Kwestia.find({czyAktywny: true}).count();
        return ile > 0 ? true : false;
    }
});

Template.lobbujZaKwestia.helpers({
    IAmOwnerKwestiaGlosowanaOrDEliberowana:function(){
        console.log(this.idUser);
        console.log(Meteor.userId());
        console.log("brr");
        return (this.idUser==Meteor.userId() || this.idZglaszajacego==Meteor.userId()) &&
        (this.status==KWESTIA_STATUS.GLOSOWANA ||
        this.status==KWESTIA_STATUS.DELIBEROWANA ||
        this.status==KWESTIA_STATUS.OSOBOWA ||
        this.status==KWESTIA_STATUS.ADMINISTROWANA) ? true: false;
    }
});