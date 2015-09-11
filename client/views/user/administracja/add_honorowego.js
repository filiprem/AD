Template.listDoradcyModal.helpers({
});

Template.listDoradcyModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'profile.fullName',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        title: "Kliknij w imię, aby zobaczyć",
                        text: "Imię i nazwisko"
                    },
                    tmpl: Template.nazwaHonorowegoLinkTemplate
                },
                {key: 'profile.userType',label:"Stanowisko"}
            ]
        };
    },
    doradcyList: function(){
        var users=Users.find({$where:function(){
            return this.profile.userType==USERTYPE.DORADCA && this._id != Meteor.userId();
        }});
        return users;
    }
});

Template.listDoradcyModalInner.events({
    'click #zglosNaHonorowegoNowegoClick':function(){

    },
    'click #zglosNaHonorowegoZListyClick':function(){
        console.log(this._id);
                var user = Users.findOne({_id: this._id});
        if (user) {
            zglosNaHonorowegoForm(user);

        }
    }
});
zglosNaHonorowegoForm=function(user){
    bootbox.dialog({
        title: "Dane aplikanta do zgłoszenia na stanowisko członka honorowego",
        message: '<div class="row">' +
        '<div class="col-md-12"><strong>' + "Imię i nazwisko: " + '</strong>' + user.profile.fullName + '</div>' +
        '<div class="col-md-12"><strong>' + "Stanowisko: " + '</strong>' + user.profile.userType + '</div>' +
        '<div class="col-md-12"><strong>' + "Telefon: " + '</strong>' + user.profile.phone + '</div>' +
        '<div class="col-md-12"><strong>' + "e-mail: " + '</strong>' + user.emails[0].address + '<br /><br /></div>' + '<p></p>' +

        '<label class="col-md-12 control-label" for="uwagi">Uzasadnienie</label> ' +
        '<div class="col-md-12"> ' +
        '<textarea id="uwagi" name="uwagi" type="text" placeholder="Uzasadnienie" class="form-control"></textarea> ' +
        '</div> ' +

        '</div>',
        buttons: {
            success: {
                label: "Wyślij zgłoszenie",
                className: "btn-success",
                callback: function () {
                    var uwagi = $('#uwagi').val();
                    addUserHonorowyDraft(user,uwagi);
                }
            },
            danger: {
                label: "Anuluj",
                className: "btn-danger"
            }
        }
    });
};
addUserHonorowyDraft=function(user,uwagi){
    var newUserDraft = [
        {
            idUser: user.idUser
        }];
    Meteor.call('addUserDraft', newUserDraft, function (error, ret) {
        if (error) {
            // optionally use a meteor errors package
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else {
                throwError(error.reason);
            }
        }
        else{
            addKwestiaUserHonorowy(user,uwagi,ret);
        }
    });
};
addKwestiaUserHonorowy=function(user,uwagi,idUserDraft){

    var dataG = new Date();
    var d = dataG.setDate(dataG.getDate() + 7);
    var daneAplikanta = "DANE APLIKANTA: \r\n " +
        user.profile.firstName + ", " + user.profile.lastName + " \r\n " +
        user.emails[0].address + ", \r\n " +
        user.profile.phone + ", \r\n " +
        uwagi;
    var newKwestia = [
        {
            idUser: Meteor.userId(),
            dataWprowadzenia: new Date(),
            kwestiaNazwa: 'Nadanie statusu- ' + user.profile.firstName + " " + user.profile.lastName,
            wartoscPriorytetu: 0,
            wartoscPriorytetuWRealizacji:0,
            sredniaPriorytet: 0,
            idTemat: "3TBYqrgpJiQQSDEbt",
            idRodzaj: "qMqF9S9hjZFz4bRK7",
            dataDyskusji: new Date(),
            dataGlosowania: d,
            krotkaTresc: 'Kwestia o nadanie statusu ' + user.profile.userType,
            szczegolowaTresc: daneAplikanta,
            isOption: false,
            status: KWESTIA_STATUS.STATUSOWA,
            idZgloszonego: idUserDraft,
            isAnswerPositive:null
        }];
    Meteor.call('addKwestiaStatusowa', newKwestia, function (error,ret) {
        if (error) {
            // optionally use a meteor errors package
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else {
                //if(error.error === 409)
                throwError(error.reason);
            }
        }
        else{
            updateZRMyKwestia(ret,user._id);
        }
    });
};
updateZRMyKwestia=function(idKwestii,idUser){
    var zr=ZespolRealizacyjny.findOne({});
    var kwestia=Kwestia.findOne({_id:idKwestii});
    var myZRDraft=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
    var ZRdataToUpdate={
        nazwa:zr.nazwa,
        zespol:zr.zespol
    };
    Meteor.call('updateZespolRealizacyjnyDraft', myZRDraft._id,ZRdataToUpdate, function (error) {
        if (error) {
            // optionally use a meteor errors package
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else
                throwError(error.reason);
        }
        else{
            confirmationAlert();
        }
    });
};

confirmationAlert=function(){
    GlobalNotification.success({
        title: 'Sukces!',
        content: 'Została utworzona kwestia statusowa',
        duration: 5 // duration the notification should stay in seconds
    });
    return true;
};
