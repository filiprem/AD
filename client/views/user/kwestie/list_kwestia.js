Template.listKwestia.rendered = function()
{
    $(this.find('#kwestiaTable')).tablesorter();
    Deps.autorun(function(){
        setTimeout(function(){
            $("#kwestiaTable").trigger("update");
        }, 200);
    });
};

Template.listKwestia.events({
    'click .glyphicon-trash': function(event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
        Session.set('kwestiaInScope', this);
    },
    //'click .glyphicon-info-sign': function(event, template){
    //    Session.set('kwestiaInScope',this);
    //},
    'click #kwestiaId': function(e) {
        var idKwestii = this._id;
        console.log(idKwestii);
    },
    'click .glyphicon-thumbs-up': function(event, template){
        Session.set('kwestiaInScope',this);
    },
    'click .glyphicon-remove-circle': function(event, template){
        Session.set('kwestiaInScope',this);
    }
});
Template.listKwestia.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: true,
            enableRegex: false,
            fields: [
                {key: 'dataWprowadzenia', label: "Data", tmpl:Template.dataUtwKwestia},
                {key: 'kwestiaNazwa', label: "Nazwa Kwestii", tmpl: Template.nazwaKwestiLink},
                {
                    key: 'sredniaPriorytet',
                    label: "Priorytet",
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'ascending'},
                {key: 'temat_id', label: "Temat", tmpl: Template.tematKwestia},
                {key: 'rodzaj_id', label: "Rodzaj", tmpl: Template.rodzajKwestia},
                {key: 'dataGlosowania', label: "Finał", tmpl: Template.dataGlKwestia},
                {key: 'status', label: "Status"},
                {key: 'options', label: "Opcje", tmpl: Template.editColumnKwestia }
            ]
        };
    },
    KwestiaList: function(){
        return Kwestia.find({}).fetch();
    },
    priorytetsr: function() {
        var i=0;

        var kwestia = Kwestia.findOne({_id: this._id});
        kwestia.glosujacy.forEach(function(item)
        {
            i++;
        });
        if(kwestia.priorytet === 0)
            var srPriorytet = kwestia.priorytet;
        else
            var srPriorytet = kwestia.priorytet/i ;

        return srPriorytet
    },
    email: function () {
        return getEmail(this);
    },
    kwestiaCount: function(){
        return Kwestia.find({czyAktywny: true}).count();
    },
    isAdminUser: function() {
        return IsAdminUser();
    }
});

Template.tematKwestia.helpers({
    tematNazwa: function(){
        var t = Temat.findOne({_id: this.temat_id});
        if(t){
            return t.nazwaTemat;
        }
    }
});

Template.rodzajKwestia.helpers({
    rodzajNazwa: function(){
        var r = Rodzaj.findOne({_id: this.rodzaj_id});
        if(r){
            return r.nazwaRodzaj;
        }
    }
});

Template.dataGlKwestia.helpers({
    date: function () {
        var d = this.dataGlosowania;
        if(d){
            return moment(d).format("DD-MM-YYYY");
        }
    }
});

Template.dataUtwKwestia.helpers({
    date: function () {
        var d = this.dataWprowadzenia;
        if(d){
            return moment(d).format("DD-MM-YYYY");
        }
    }
});

Template.priorytetKwestia.helpers({
   priorytet: function () {
       var p = this.sredniaPriorytet;
       //if(p){
           return p.toFixed(2);
       //}
   }
});

Template.editColumnKwestia.helpers({

});

Template.editColumnKwestia.events({

});

Template.nazwaKwestiLink.events({

})