Session.setDefault('receivedData', false);
Session.setDefault('raportSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);
Template.listRaport.events({
    'keyup #searchInput':function(){
        Session.set('raportSearchFilter', $('#searchInput').val());
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
        Session.set('raportInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
        Session.set('raportInScope', this);
    }
});
Template.listRaport.helpers({
    raportList: function(){
        Session.set('receivedData', new Date());
        Session.set('paginationCount', Math.ceil(Raport.find().count() / Session.get('tableLimit')));
        return Raport.find({$or:[
            {terminyGlosowan: { $regex: Session.get('raportSearchFilter'), $options: 'i' }},
            {uzytkownicy: { $regex: Session.get('raportSearchFilter'), $options: 'i' }},
            {realizacja: { $regex: Session.get('raportSearchFilter'), $options: 'i' }},
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
    raportCount: function(){
        return Raport.find().count();
    },
    isAdminUser: function() {
        return IsAdminUser();
    }
});

Template.listRaport.rendered = function()
{
    $(this.find('#raportTable')).tablesorter();
    Deps.autorun(function(){
        setTimeout(function(){
            $("#raportTable").trigger("update");
        }, 200);
    });
};

