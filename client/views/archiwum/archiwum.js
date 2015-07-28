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
    }
});
Template.archiwum.helpers({
    kwestiaList: function(){
        Session.set('receivedData', new Date());
        Session.set('paginationCount', Math.ceil(Kwestia.find().count() / Session.get('tableLimit')));
        return Kwestia.find({czyAktywny:false, $or:[
            {dataWprowadzenia: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {kwestiaNazwa: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {priorytet: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {temat: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {rodzaj: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {dataDyskusji: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {dataGlosowania: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {historia: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }}
        ]
        },{limit: Session.get('tableLimit'), skip: Session.get('skipCount')});
    },
    kwestiaCount: function(){
        return Kwestia.find({czyAktywny: false}).count();
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

