Template.listKwestiaAdmin.rendered = function()
{};

Template.listKwestiaAdmin.events({
    'click .glyphicon-trash': function(event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-repeat': function(event, template){
        Session.set('kwestiaInScope',this);
    },
    'click .glyphicon-info-sign': function(event, template){
        Session.set('kwestiaInScope',this);
    }
});
Template.listKwestiaAdmin.helpers({
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
                    sortDirection: 'descending'},
                {key: 'temat_id', label: "Temat", tmpl: Template.tematKwestia},
                {key: 'rodzaj_id', label: "Rodzaj", tmpl: Template.rodzajKwestia},
                {key: 'dataGlosowania', label: "Finał", tmpl: Template.dataGlKwestia},
                {key: 'status', label: "Status"},
                {key: 'options', label: "Opcje", tmpl: Template.editColumnKwestia }
            ]
        };
    },
    KwestiaListAdmin: function(){
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
    kwestiaCount: function(){
        return Kwestia.find({czyAktywny: true}).count();
    },
    isAdminUser: function() {
        return IsAdminUser();
    },
    tematNazwa: function(){
        return Temat.findOne({_id: this.temat_id});
    },
    rodzajNazwa: function(){
        return Rodzaj.findOne({_id: this.rodzaj_id});
    }
});