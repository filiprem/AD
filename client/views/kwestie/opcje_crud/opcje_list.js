Template.opcjeList.helpers({
    OpcjeList: function () {
        var parent = this.idParent;
        var kwestia = Kwestia.findOne({_id: parent});
        var k = Kwestia.find({czyAktywny: true, _id: {$ne: this._id}, idParent: this.idParent, status: {$ne: KWESTIA_STATUS.KOSZ}}).fetch();
        if (k) return k;
        else return false;
    },
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: false,
            showNavigation: 'never',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji",
                        text: "Data"
                    },
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
                {
                    key: 'wartoscPriorytetu',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Kliknij, aby zmienić swój priorytet dla tej Kwestii",
                        text: "Priorytet"
                    },
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'descending'
                },
                {key: 'idTemat', label: "Temat", tmpl: Template.tematKwestia},
                {key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia},
                {key: 'status', label: "Status", tmpl: Template.statusKwestia}
            ],
            rowClass: function (item) {
                if (item.status==KWESTIA_STATUS.ARCHIWALNA) {
                    return 'danger';
                }
            }
        };
    }
});
Template.nazwaKwestiLink.helpers({
    isArchiwalna:function(){
        return this.status==KWESTIA_STATUS.ARCHIWALNA ? true :false;
    }
});