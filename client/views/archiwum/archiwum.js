Template.archiwum.rendered = function () {
};

Template.archiwum.events({
    'click .glyphicon-trash': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-pencil': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-repeat': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-info-sign': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click #kwestiaIdClick':function(){//nadajemy priorytet automatycznie po wejściu na kwestię + dajemy punkty
        var kwestia=Kwestia.findOne({_id:this._id});
        var tabGlosujacy=getAllUsersWhoVoted(kwestia._id);
        if(!_.contains(tabGlosujacy,Meteor.userId())){//jeżeli użytkownik jeszcze nie głosował
            var glosujacy = {
                idUser: Meteor.userId(),
                value: 0
            };
            var voters=kwestia.glosujacy.slice();
            voters.push(glosujacy);
            Meteor.call('setGlosujacyTab', kwestia._id, voters, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                }
            });
            //dodanie pkt za głosowanie
            var newValue = 0;
            var pktAddPriorytet = Parametr.findOne({});
            newValue = Number(pktAddPriorytet.pktNadaniePriorytetu) + getUserRadkingValue(Meteor.userId());

            Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
            });
        }

    }
});
Template.archiwum.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji", text: "Data"},
                    tmpl: Template.dataUtwKwestia
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Kliknij, aby zobaczyć szczegóły", text: "Nazwa Kwestii"},
                    tmpl: Template.nazwaKwestiiArchiwumLink
                },
                {
                    key: 'sredniaPriorytet',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Kliknij, aby zmienić swój priorytet dla tej Kwestii", text: "Priorytet"},
                    tmpl: Template.priorytetKwestia,
                    sortOrder: 1,
                    sortDirection: 'descending'
                },
                {key: 'idTemat', label: "Temat", tmpl: Template.tematKwestiiArchiwum},
                {key: 'idRodzaj', label: "Rodzaj", tmpl: Template.rodzajKwestiiArchiwum},
                {
                    key: 'dataGlosowania',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Data zakończenia głosowania", text: "Finał"},
                    tmpl: Template.dataGlKwestia
                },
                {
                    key: 'status',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {title: "Etap, na którym znajduje sie ta Kwestia", text: "Status"}
                },
                {key: 'options', label: "Opcje", tmpl: Template.editColumnKwestiaArch}
            ]
        };
    },
    ArchiwumList: function () {
        //return Kwestia.find({$where:function(){return ((this.czyAktywny==false) || (moment(this.dataGlosowania) < moment()&& this.wartoscPriorytetu < this.pulapPriorytetu));}}).fetch();
        return Kwestia.find({
            $or: [
                {czyAktywny: false},
                {$and: [{dataGlosowania: {$lt: moment().format()}}, {$where: function () {return this.wartoscPriorytetu <=0}}]},
                {status:KWESTIA_STATUS.ARCHIWALNA},
                {status: KWESTIA_STATUS.HIBERNOWANA}
            ]
        }).fetch();
    },
    'ArchiwumListCount':function(){
        var count =  Kwestia.find({
            $or: [
                {czyAktywny: false},
                {$and: [{dataGlosowania: {$lt: moment().format()}}, {$where: function () {return this.wartoscPriorytetu <=0}}]},
                {status:KWESTIA_STATUS.ARCHIWALNA},
                {status: KWESTIA_STATUS.HIBERNOWANA}
            ]
        }).count();
        return count>0 ? true : false;
    },
    //kwestiaCount: function () {
    //    return Kwestia.find({czyAktywny: false}).count();
    //},
    isAdminUser: function () {
        return IsAdminUser();
    },
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    }
});

Template.archiwum.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
}

Template.tematKwestiiArchiwum.helpers({
    'getTemat':function(id){
        var item = Temat.findOne({_id:id});
        return !!item && !!item.nazwaTemat ?item.nazwaTemat : id;
    }
});

Template.rodzajKwestiiArchiwum.helpers({
    'getRodzaj':function(id){
        var item = Rodzaj.findOne({_id:id});
        return !!item && !!item.nazwaRodzaj ?item.nazwaRodzaj : id;
    }
});