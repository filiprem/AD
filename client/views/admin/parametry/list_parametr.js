Session.setDefault('receivedData', false);
Session.setDefault('parametrSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);
Template.listParametr.events({
    'keyup #searchInput':function(){
        Session.set('parametrSearchFilter', $('#searchInput').val());
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
        Session.set('parametrInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
        Session.set('parametrInScope', this);
    }
});
Template.listParametr.helpers({
    parametrList: function(){
        Session.set('receivedData', new Date());
        Session.set('paginationCount', Math.ceil(Parametr.find().count() / Session.get('tableLimit')));
        return Parametr.find({$or:[
            {nazwaOrganizacji: { $regex: Session.get('parametrSearchFilter'), $options: 'i' }},
            {terytorium: { $regex: Session.get('parametrSearchFilter'), $options: 'i' }},
            {kontakty: { $regex: Session.get('parametrSearchFilter'), $options: 'i' }},
            {regulamin: { $regex: Session.get('parametrSearchFilter'), $options: 'i' }}
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
    parametrCount: function(){
        return Parametr.find().count();
    },
    isAdminUser: function() {
        return IsAdminUser();
    }
});
Template.listParametr.rendered = function()
{
    $(this.find('#parametrTable')).tablesorter();
    Deps.autorun(function(){
        setTimeout(function(){
            $("#parametrTable").trigger("update");
        }, 200);
    });
}