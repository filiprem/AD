Template.informacjeKwestia.events({
    'click #dyskusja':function(e){
        var id = document.getElementById("dyskusja").name;
        Router.go('dyskusjaKwestia',{_id:id})
    },
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
                idKwestia: this._id,
                userId:Meteor.userId(),
                uzasadnienie:"",
                czyAktywny:true
            }];

        if (isNotEmpty(item[0].idKwestia) &&
            isNotEmpty(item[0].userId)) {
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
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function(){
        return Rodzaj.findOne({_id: this.idRodzaj});
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
        var rodzajId = this.idRodzaj;
        var r = Rodzaj.findOne({_id: this.idRodzaj});
        if(r){
            var czasGlRodzaj = r.czasGlosowania;
            var k = moment(dataG).subtract(czasGlRodzaj, 'h').format("DD-MM-YYYY, HH:mm");
            return k;
        }
    },
    'isIssueSuspended':function(id){
        return KwestiaSuspended.find({idKwestia:id,czyAktywny:true}).count()<=0 ? false : true;
    },
    'getIssueSuspended':function(id){
        return KwestiaSuspended.findOne({idKwestia:id,czyAktywny:true});
    }
});