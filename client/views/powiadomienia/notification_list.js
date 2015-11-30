Template.notificationList.created = function(){
};

Template.notificationList.rendered = function () {
};
Template.notificationList.helpers({
    'settings': function () {
        var self = Template.instance();
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'powiadomienieTyp', label: "Temat",tmpl: Template.tematLink,sortOrder: 1, sortDirection: 'descending' },
                { key: 'dataWprowadzenia', label: "Data", tmpl: Template.dataWpr }
            ],
            rowClass:function(item){
                console.log(item.czyOdczytany);
                if(item.czyOdczytany==false)
                return "danger";
            }
        };
    },
    //PowiadomieniaList: function () {
    //    //console.log(this._id);
    //    console.log(Powiadomienie.find({idOdbiorca:Meteor.userId()}).count());
    //    return Powiadomienie.find({idOdbiorca:Meteor.userId(),czyAktywny:true},{$sort:{dataWprowadzenia:-1}});
    //},
    usersCount: function () {
        return Users.find().count() - 1;
    }

});
Template.dataWpr.helpers({
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format("DD-MM-YYYY, HH:mm");
    }
});
Template.tematLink.helpers({
    notificationTitle:function(){
        console.log(this.powiadomienieTyp);
        var idNadawca=this.idNadawca;
        var idKwestia=this.idKwestia;
        return getTopicTypeNotification(this.powiadomienieTyp,idNadawca,idKwestia);
    }
});

getTopicTypeNotification=function(powiadomienieTyp,idNadawca,idKwestia){
    console.log(idNadawca);
    switch(powiadomienieTyp){
        case NOTIFICATION_TYPE.MESSAGE_FROM_USER:{
            var user = Users.findOne({_id: idNadawca});
            return powiadomienieTyp+" "+ user.profile.fullName;break;
        }
        case NOTIFICATION_TYPE.NEW_ISSUE:{//sth wrong,when applies guest
            var kwestia=Kwestia.findOne({_id:idKwestia});
            return powiadomienieTyp +": "+kwestia.kwestiaNazwa;break;
        }
        case NOTIFICATION_TYPE.LOOBBING_MESSAGE:{
            var user=Users.findOne({_id:idNadawca});
            if(user)
                return powiadomienieTyp+" przez "+ user.profile.fullName;break;
        }
        default : return powiadomienieTyp;
    }
};