Session.setDefault('receivedData', false);
Session.setDefault('tematSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);
Template.listTemat.events({
    'keyup #searchInput':function(){
        Session.set('tematSearchFilter', $('#searchInput').val());
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
        Session.set('tematInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
        Session.set('tematInScope', this);
    }
});
Template.listTemat.helpers({
    tematList: function(){
        Session.set('receivedData', new Date());
        Session.set('paginationCount', Math.ceil(Temat.find().count() / Session.get('tableLimit')));
        return Temat.find({$or:[
            {nazwaTemat: { $regex: Session.get('tematSearchFilter'), $options: 'i' }},
            {opis: { $regex: Session.get('tematSearchFilter'), $options: 'i' }},
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
    tematCount: function(){
        return Temat.find().count();
    },
    isAdminUser: function() {
        return IsAdminUser();
    }
});
Template.listTemat.rendered = function()
{
    $(this.find('#tematTable')).tablesorter();
    Deps.autorun(function(){
        setTimeout(function(){
            $("#tematTable").trigger("update");
        }, 200);
    });
}

