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