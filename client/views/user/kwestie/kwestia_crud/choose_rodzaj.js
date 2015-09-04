Template.choseRodzajModal.helpers({
});

Template.choseRodzajModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'nazwaRodzaj', label: "Nazwa Rodzaju"},
                {key: 'idTemat', label: "Temat", tmpl: Template.tematRTemplate},
                {key: 'options', label: "", tmpl: Template.rodzajOptionsTemplate}
            ]
        };
    },
    rodzajeList: function(){//tutaj lista wszystkich zespołow juz zatweirdzonych
        return Rodzaj.find({});
    }
});

Template.rodzajOptionsTemplate.helpers({
});

Template.choseRodzajModalInner.events({
});

Template.rodzajOptionsTemplate.events({
    'click #wybierzRodzaj': function () {
        console.log(this._id);
        var rodzaj=Rodzaj.findOne({_id:this._id});
        if(rodzaj){//template.parent

        }
    }
});
Template.tematRTemplate.helpers({
   tematNazwa:function(){
       var temat=Temat.findOne({_id:this.idTemat});
       return (temat) ? temat.nazwaTemat :null;
   }
});