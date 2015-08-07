Template.informacjeKwestia.events({
    'click .btn-success': function(event, template){
        Session.set('kwestiaInScope',this);
    },
    'click #backToList': function(e){
        Router.go('listKwestia');
    },
    'click #proceduraWstrzymaniaButton':function(){
        Router.go('proceduraWstrzymania',{_id:ret});
    },
    'click #wstrzymajKwestieButton': function (e) {
        var item = [{
                kwestia_id: this._id,
                user_id:Meteor.userId(),
                uzasadnienie:"",
                czyAktywny:true
            }];

        if (isNotEmpty(item[0].kwestia_id) &&
            isNotEmpty(item[0].user_id)) {
            Meteor.call('addKwestiaSuspended', item, function (error,ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                }else {
                    Router.go('proceduraWstrzymania',{_id:ret});
                }
            });
        }
    },
    'click #addOptionButton':function (){
        Router.go("addKwestiaOpcja");
    }
});
Template.informacjeKwestia.helpers({
    thisKwestia: function(){
        var k = Session.get("idKwestia")
    },
    mojPiorytet: function(){
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        var g = kwestia.glosujacy;
        for(var i=0; i < g.length; i++){
            if(Meteor.userId()==g[i][0]){
                return g[i][1];
            }
        }
    },
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
    },
    dataGlosowaniaObliczana: function(){
        var dataG = this.dataGlosowania;
        var rodzajId = this.rodzaj_id;
        var r = Rodzaj.findOne({_id: this.rodzaj_id});
        if(r){
            var czasGlRodzaj = r.czasGlosowania;
            var k = moment(dataG).subtract(czasGlRodzaj, 'h').format("DD-MM-YYYY, HH:mm");
            return k;
        }
    },
    'isIssueSuspended':function(id){
        return KwestiaSuspended.find({kwestia_id:id,czyAktywny:true}).count()<=0 ? false : true;
    },
    'getIssueSuspended':function(id){
        return KwestiaSuspended.findOne({kwestia_id:id,czyAktywny:true});
    }
});