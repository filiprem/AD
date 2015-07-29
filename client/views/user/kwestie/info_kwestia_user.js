Template.informacjeKwestia.events({
    'click .btn-success': function(event, template){
        Session.set('kwestiaInScope',this);
    },
    'click #backToList': function(e){
        Router.go('listKwestia');
    }
});
Template.informacjeKwestia.helpers({
    glosujacyCount: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        var liczba = tab.glosujacy.length;
        return liczba;
    },
    nazwa: function(){
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        return tab;
    },
    tematNazwa: function(){
        return Temat.findOne({_id: this.temat_id});
    },
    rodzajNazwa: function(){
        return Rodzaj.findOne({_id: this.rodzaj_id});
    },
    date: function () {
        var d = this.dataWprowadzenia;
        if(d){
            return moment(d).format("DD-MM-YYYY, HH:mm");
        }
    },
    dateG: function () {
        var d = this.dataGlosowania;
        if(d){
            return moment(d).format("DD-MM-YYYY, HH:mm");
        }
    }
});