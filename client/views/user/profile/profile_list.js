Template.profileList.created = function(){
    this.usersRV = new ReactiveVar();
};

Template.profileList.rendered = function () {
    var self = Template.instance();
    this.autorun(function () {
        var users = Users.find({
            $where: function () {
                return (this._id == Meteor.userId());
            }
        });
        var tab = [];
        users.forEach(function (item) {
            tab.push(item._id);
        });
        self.usersRV.set(tab);
    })
};

Template.profileList.events({
    'click .glyphicon-trash': function (event, template) {
        Session.set('userInScope', this);
    },
    'click .glyphicon-info-sign': function (event, template) {
        Session.set('userInScope', this);
    },
    'click .glyphicon-cog': function (event, template) {
        Session.set('userInScope', this);
    },
    'click .glyphicon-pencil': function (event, template) {
        Session.set('userInScope', this);
    }
});
Template.profileList.helpers({
    'settings': function () {
        var self = Template.instance();
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'profile.firstName', label: "Imię"},
                {key: 'profile.lastName', label: "Nazwisko"},
                {key: 'username', label: "Nazwa użytkownika", tmpl: Template.usernameLink},
                {key: 'email', label: "Email", tmpl: Template.userEmail},
                {key: 'roles', label: "Rola"},
                {key: 'profile.userType', label: "Stanowisko w systemie"},
                {key: 'profile.rADking', label: "Ranking"},
                //tu bedzie mozliwosc zaproponowania kogoś na stanowisko honorowego- dla goscia lub doradcy?
                {key: '_id', label: "Opcje", tmpl: Template.optionsColumnProfile, headerClass: "col-md-3"}
            ],
            rowClass: function (item) {
                var tab = self.usersRV.get();
                if (_.contains(tab, item._id)) {
                    return 'myselfClass';
                }
            }
        };
    },
    UserListAdmin: function () {
        return Users.find({
            $where: function () {
                return ((this.roles != 'admin') && (this._id!=Meteor.userId()));
            }
        }).fetch();
    },
    usersCount: function () {
        return Users.find().count() - 1;
    },
    myself: function (userId) {
        return Meteor.userId() === userId;
    }
});

Template.optionsColumnProfile.events({
    'click #zglosNaHonorowegoClick':function(e){
        e.preventDefault();
        var user=Users.findOne({_id:this._id});
        if(user){
            bootbox.dialog({
                title: "Dane aplikanta do zgłoszenia na stanowisko członka honorowego",
                message:
                    '<div class="row">' +
                     '<div class="col-md-12">'+user.profile.fullName+'</div>'+
                     '<div class="col-md-12">'+user.profile.address+" "+user.profile.zip+'</div>'+
                     '<div class="col-md-12">'+getEmail(this)+'</div>'+'<p></p>'+

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
                            var uwagi=$('#uwagi').val();
                            var newUserDraft = [
                                {
                                    email: user.profile.address,
                                    login: user.username,
                                    firstName: user.profile.firstName,
                                    lastName: user.profile.lastName,
                                    profession: user.profile.profession,
                                    address: user.profile.address,
                                    zip: user.profile.zip,
                                    gender: user.profile.gender,
                                    role: user.role,
                                    userType:USERTYPE.HONOROWY,
                                    uwagi:uwagi,
                                    idUser:user._id,
                                    isExpectant:true
                                }];

                            Meteor.call('addUserDraft', newUserDraft, function (error,ret) {
                                if (error) {
                                    // optionally use a meteor errors package
                                    if (typeof Errors === "undefined")
                                        Log.error('Error: ' + error.reason);
                                    else {
                                        throwError(error.reason);
                                    }
                                }
                                else {
                                    var idUserDraft = ret;
                                    var dataG = new Date();
                                    var d = dataG.setDate(dataG.getDate() + 7);
                                    var daneAplikanta = "DANE APLIKANTA: \r\n " +
                                        newUserDraft[0].firstName + ", " + newUserDraft[0].lastName + " \r\n " +
                                        newUserDraft[0].email + ", \r\n " +
                                        newUserDraft[0].profession + ", \r\n " +
                                        newUserDraft[0].address + " " +
                                        newUserDraft[0].zip + ", \r\n " +
                                        newUserDraft[0].uwagi
                                    var newKwestia = [
                                        {
                                            idUser: Meteor.userId(),
                                            dataWprowadzenia: new Date(),
                                            kwestiaNazwa: 'Nadanie statusu- ' + newUserDraft[0].firstName + " " + newUserDraft[0].lastName,
                                            wartoscPriorytetu: 0,
                                            sredniaPriorytet: 0,
                                            idTemat: Temat.findOne({})._id,
                                            idRodzaj: Rodzaj.findOne({})._id,
                                            dataDyskusji: new Date(),
                                            dataGlosowania: d,
                                            krotkaTresc: 'Kwestia o nadanie statusu ' + newUserDraft[0].userType,
                                            szczegolowaTresc: daneAplikanta,
                                            isOption: false,
                                            status: KWESTIA_STATUS.STATUSOWA,
                                            idZgloszonego:idUserDraft
                                        }];
                                    Meteor.call('addKwestiaStatusowa', newKwestia, function (error) {
                                        if (error) {
                                            // optionally use a meteor errors package
                                            if (typeof Errors === "undefined")
                                                Log.error('Error: ' + error.reason);
                                            else {
                                                //if(error.error === 409)
                                                throwError(error.reason);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    },
                    danger: {
                        label: "Anuluj",
                        className: "btn-danger"
                    }
                }
            });
        }
    }
});

Template.optionsColumnProfile.helpers({
    //pełnoprawny może zgłosić doradcę na honorowego,jeśli ten nie złożył żadnego innego wnioksu tj. wniosku o status członka zwyczjengo
    statusHonorowy:function(){
        var me=Users.findOne({_id:Meteor.userId()});
        if(me){
            if(!me.profile.userType=='członek')//jesli nie jestem czlonkiem,nie moge zarzadzac ich kontami
                return false;
            else{
                var user=Users.findOne({_id:this._id});
                if(user){
                    if(user.profile.userType=='członek')
                        return false;
                    else{
                        //sprawdzam czy przypadkiem juz nie aplikowal
                        var userDraft= UsersDraft.findOne({'profile.idUser':user._id});
                        if(userDraft){
                            return false;
                        }
                        else return true;
                    }
                }
                else return false;
            }
        }
        return false;
    },
    //to finish
    //isZgloszony:function(){
    //    //var kwestia=Kwestia.findOne({idZgloszonego:this._id this.status=='statusowa'});
    //    var kwestia=Kwestia.findOne({
    //        $where:function(){
    //            ((_id==this._id)&& (status=='statusowa'))
    //        }
    //    });
    //    return kwestia ? true :false;
    //}

});