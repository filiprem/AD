Template.listKwestiaAdmin.rendered = function()
{
    $(this.find('#kwestiaTable')).tablesorter();
    Deps.autorun(function(){
        setTimeout(function(){
            $("#kwestiaTable").trigger("update");
        }, 200);
    });
};

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
    kwestiaList: function(){
        Session.set('receivedData', new Date());
        Session.set('paginationCount', Math.ceil(Kwestia.find().count() / Session.get('tableLimit')));
        return Kwestia.find({czyAktywny: true, $or:[
            {dataWprowadzenia: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {kwestiaNazwa: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {priorytet: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {sredniaPriorytet: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {temat: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {rodzaj: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {dataDyskusji: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {dataGlosowania: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            //{historia: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }}
        ]
        },{limit: Session.get('tableLimit'), skip: Session.get('skipCount')},{sort:{priorytet: -1}});
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
    getPaginationCount: function(){
        return Session.get('paginationCount');
    },
    paginationButtonList: function(){
        var paginationArray = [];
        for (var i = 0; i < Session.get('paginationCount'); i++) {
            paginationArray[i] = {
                index: i
            };
        };
        return paginationArray;
    },
    isTwentyActive: function(){
        if(Session.get('tableLimit') === 20){
            return "active";
        }
    },
    isFiftyActive: function(){
        if(Session.get('tableLimit') === 50){
            return "active";
        }
    },
    isHundredActive: function(){
        if(Session.get('tableLimit') === 100){
            return "active";
        }
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