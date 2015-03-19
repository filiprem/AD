Session.setDefault('receivedData', false);
Session.setDefault('kwestiaSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);
Template.listKwestia.events({
    'keyup #searchInput':function(){
        Session.set('kwestiaSearchFilter', $('#searchInput').val());
    },
    'click #twentyButton':function(){
        Session.set('tableLimit', 20);
    },
    'click #fiftyButton': function(){
        Session.set('tableLimit', 50);
    },
    'click #hundredButton': function(){
        Session.set('tableLimit', 100);
    },
    'click .pagination-btn':function(){
        //alert(JSON.stringify(this.index));
        Session.set('selectedPagination', this.index);
        Session.set('skipCount', this.index * Session.get('tableLimit'));
    },
    'click .glyphicon-trash': function(event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
        Session.set('kwestiaInScope', this);
    },
    //'click .glyphicon-info-sign': function(event, template){
    //    Session.set('kwestiaInScope',this);
    //},
    'click .glyphicon-thumbs-up': function(event, template){
        Session.set('kwestiaInScope',this);
    },
    'click .glyphicon-remove-circle': function(event, template){
        Session.set('kwestiaInScope',this);
    }
});
Template.listKwestia.helpers({
    kwestiaList: function(){
        Session.set('receivedData', new Date());
        Session.set('paginationCount', Math.ceil(Kwestia.find().count() / Session.get('tableLimit')));
        return Kwestia.find({czyAktywny: true, $or:[
            {dataWprowadzenia: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {kwestiaNazwa: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {priorytet: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {temat: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {rodzaj: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {dataDyskusji: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {dataGlosowania: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
            {historia: { $regex: Session.get('kwestiaSearchFilter'), $options: 'i' }},
        ]
        },{limit: Session.get('tableLimit'), skip: Session.get('skipCount')});
    },
    email: function () {
        return getEmail(this);
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
Template.listKwestia.rendered = function()
{
    $(this.find('#kwestiaTable')).tablesorter();
    Deps.autorun(function(){
        setTimeout(function(){
            $("#kwestiaTable").trigger("update");
        }, 200);
    });
}

