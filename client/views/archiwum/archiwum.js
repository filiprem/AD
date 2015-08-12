Template.archiwum.rendered = function()
{};

Template.archiwum.events({
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
    },
    'click #backToList': function (e) {
        Router.go('home');
    },
});
Template.archiwum.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'dataWprowadzenia', label: Template.listKwestiaAdminColumnLabel, labelData: {title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji", text:"Data"}, tmpl:Template.dataUtwKwestia},
                {key: 'kwestiaNazwa', label: Template.listKwestiaAdminColumnLabel, labelData: {title: "Kliknij, aby zobaczyć szczegóły", text:"Nazwa kwestii"}, tmpl: Template.nazwaKwestiArchiwumLink},
                {
                    key: 'sredniaPriorytet',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Kliknij, aby zmienić swój priorytet dla tej Kwestii", text:"Priorytet"},
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'descending'},
                {key: 'idTemat', label: "Temat", tmpl: Template.tematKwestia},
                {key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestia},
                {key: 'dataGlosowania', label: Template.listKwestiaAdminColumnLabel, labelData: {title: "Data zakończenia głosowania", text:"Finał"}, tmpl: Template.dataGlKwestia},
                {key: 'status', label: Template.listKwestiaAdminColumnLabel, labelData: {title: "Etap, na którym znajduje sie ta Kwestia", text:"Status"}},
                {key: 'options', label: "Opcje", tmpl: Template.editColumnKwestiaArch }
            ]
        };
    },
    ArchiwumList: function(){
        //return Kwestia.find({$where:function(){return ((this.czyAktywny==false) || (moment(this.dataGlosowania) < moment()&& this.wartoscPriorytetu < this.pulapPriorytetu));}}).fetch();
        return  Kwestia.find({$or:[{czyAktywny: false}, {$and:[{dataGlosowania: {$lt:moment().format()}},{$where:function(){return this.wartoscPriorytetu < this.pulapPriorytetu}}]}]}).fetch();
    },
    kwestiaCount: function(){
        return Kwestia.find({czyAktywny: false}).count();
    },
    isAdminUser: function() {
        return IsAdminUser();
    },
    tematNazwa: function(){
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function(){
        return Rodzaj.findOne({_id: this.idRodzaj});
    },
    getWymaganyPriorytet: function(id){
        return 50;
    }
});

Template.archiwum.rendered = function(){
    $('[data-toggle="tooltip"]').tooltip();
}