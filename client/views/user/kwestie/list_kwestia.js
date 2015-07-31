Template.listKwestia.rendered = function()
{};

Template.listKwestia.events({
    //usunięcie kwestii
    'click .glyphicon-trash': function(event, template) {
        Session.set('kwestiaInScope', this);
    },
    //edycja kwestii
    'click .glyphicon-pencil': function(event, template) {
        Session.set('kwestiaInScope', this);
        Router.go("editKwestia");
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
                {key: 'dataWprowadzenia', label: Template.listKwestiaColumnLabel, labelData: {title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji", text:"Data"}, tmpl:Template.dataUtwKwestia},
                {key: 'kwestiaNazwa', label: Template.listKwestiaColumnLabel, labelData: {title: "Kliknij, aby zobaczyć szczegóły", text:"Nazwa kwestii"}, tmpl: Template.nazwaKwestiLink},
                {
                    key: 'sredniaPriorytet',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {title: "Kliknij, aby zmienić swój priorytet dla tej Kwestii", text:"Priorytet"},
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'descending'},
                {key: 'temat_id', label: "Temat", tmpl: Template.tematKwestia},
                {key: 'rodzaj_id', label: "Rodzaj", tmpl: Template.rodzajKwestia},
                {key: 'dataGlosowania', label: Template.listKwestiaColumnLabel, labelData: {title: "Data zakończenia głosowania", text:"Finał"}, tmpl: Template.dataGlKwestia},
                {key: 'status', label: Template.listKwestiaColumnLabel ,labelData: {title: "Etap, na którym znajduje sie ta Kwestia", text:"Status"}},
                {key: 'options', label: "Opcje", tmpl: Template.editColumnKwestia }
            ]
        };
    },
    KwestiaList: function(){
        return Kwestia.find({czyAktywny: true}).fetch();
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
    //isMine: function(){
    //    var usr = Users.findOne({_id: this.userId});
    //    console.log(usr)
    //    var usrId = this.userId;
    //    if(usrId==Meteor.userId){
    //        return ;
    //    }
    //    else{
    //        return false;
    //    }
    //}
});

Template.editColumnKwestia.events({

});

Template.listKwestiaColumnLabel.rendered = function(){
    $('[data-toggle="tooltip"]').tooltip();
}
