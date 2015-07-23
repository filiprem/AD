Session.setDefault('receivedData', false);
Session.setDefault('usersSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);

Template.listUsers2.events({
    'keyup #searchInput':function(){
        Session.set('usersSearchFilter', $('#searchInput').val());
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
        Session.set('selectedPagination', this.index);
        Session.set('skipCount', this.index * Session.get('tableLimit'));
    },

    'click .glyphicon-trash': function(event, template) {
        Session.set('userInScope', this);
    },

    'click .glyphicon-info-sign': function(event, template) {
        Session.set('userInScope', this);
    },

    'click .glyphicon-pencil': function(event, template) {
        Session.set('userInScope', this);
    }
});
Template.listUsers2.helpers({
    usersList: function(){
        Session.set('receivedData', new Date());
        Session.set('paginationCount', Math.ceil(Users.find().count() / Session.get('tableLimit')));
        return Users.find({$or:[
            {username: { $regex: Session.get('usersSearchFilter'), $options: 'i' }},
            {'profile.first_name': { $regex: Session.get('usersSearchFilter'), $options: 'i' }},
            {'profile.last_name': { $regex: Session.get('usersSearchFilter'), $options: 'i' }},
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
    usersCount: function(){
        return Users.find().count();
    },
    myself: function(userId) {
        return Meteor.userId() === userId;
    }
});
Template.listUsers2.rendered = function()
{
    $(this.find('#usersTable')).tablesorter();
    Deps.autorun(function(){
        setTimeout(function(){
            $("#usersTable").trigger("update");
        }, 200);
    });
}