Session.setDefault('receivedData', false);
Session.setDefault('rodzajSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);
Template.listRodzaj.events({
    'keyup #searchInput':function(){
        Session.set('rodzajSearchFilter', $('#searchInput').val());
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
        Session.set('rodzajInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
        Session.set('rodzajInScope', this);
    }
});
Template.listRodzaj.helpers({
    rodzajList: function(){
        Session.set('receivedData', new Date());
        Session.set('paginationCount', Math.ceil(Rodzaj.find().count() / Session.get('tableLimit')));
        return Rodzaj.find({$or:[
            {nazwaRodzaj: { $regex: Session.get('rodzajSearchFilter'), $options: 'i' }},
            {czasDyskusji: { $regex: Session.get('rodzajSearchFilter'), $options: 'i' }},
            {czasGlosowania: { $regex: Session.get('rodzajSearchFilter'), $options: 'i' }},
            {pulapPriorytetu: { $regex: Session.get('rodzajSearchFilter'), $options: 'i' }}
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
    rodzajCount: function(){
        return Rodzaj.find().count();
    },
    isAdminUser: function(){
        return IsAdminUser();
    },
    tematNazwa: function(){
        return Temat.findOne({_id: this.temat_id});
    }

});
Template.listRodzaj.rendered = function()
{
    $(this.find('#rodzajTable')).tablesorter();
    Deps.autorun(function(){
        setTimeout(function(){
            $("#rodzajTable").trigger("update");
        }, 200);
    });
}