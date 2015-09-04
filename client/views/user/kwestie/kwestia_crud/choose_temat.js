Template.choseTematModal.helpers({
});

Template.choseTematModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'nazwaTemat', label: "Nazwa Tematu"},
                {key: 'opis', label: "Opis"},
                {key: 'options', label: "", tmpl: Template.tematOptionsTemplate}
            ]
        };
    },
    tematyList: function(){//tutaj lista wszystkich zespołow juz zatweirdzonych
        return Temat.find({});
    }
});

Template.tematOptionsTemplate.helpers({
});

Template.choseTematModalInner.events({
});

Template.tematOptionsTemplate.events({
    'click #wybierzTemat': function () {
        console.log(this._id);
        var temat=Temat.findOne({_id:this._id});
        if(temat){//template.parent

        }
    }
});