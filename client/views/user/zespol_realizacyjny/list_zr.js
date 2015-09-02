Template.listZespolRealizacyjnyModal.helpers({
});

Template.listZespolRealizacyjnyModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'nazwa', label: "Nazwa Zespołu"},
                {key: 'zespol', label: "Skład Zespołu", tmpl: Template.zespolTemplate},
                {key: 'options', label: "", tmpl: Template.zespolOptionsTemplate}
            ]
        };
    },
    ZRList: function(){
        var val=Session.get("idKwestiaModalShow");
        return ZespolRealizacyjny.find({
            $where:function(){
            return ((this.idKwestia!=val)&& (this.zespol.slice().length==3))
        }});
        Session.setPersistent('idKwestiaModalShow', null);
    }
});

Template.zespolTemplate.helpers({
    zespolR: function(){
        var tab = [];
        for(var i=0;i<this.zespol.length;i++){
            var z = this.zespol[i];
            if(z){
                var foundName = Users.findOne({_id: z.idUser}).profile.fullName;
                if(foundName){
                    tab.push(" "+foundName);
                }
            }
        }
        return tab;
    }
});

Template.zespolOptionsTemplate.helpers({
});

Template.listZespolRealizacyjnyModalInner.events({
    'click #powolajZR': function () {
        console.log("heja banana");
        //badam wybrany zespól.jeżeli ten co go wybral,nie jest w wybranym zespole->alert
        $("#listZespolRealizacyjny").modal("hide");
        //modal sie zamknie
        //pojaw sie nowy bootbox,
        //wpiszemy nazwę zespołu, beda wypisani członkowie.ok,ok
        //zupdetują sie wyświetleni,nadpiszemy aktualny zespół realizacyjny? i do widzenia
        //bootbox.dialog({
        //    title: "Dane ZR do zgłoszenia",
        //    message: '<div class="row">' +
        //    '<div class="col-md-12"><strong>' + "Imię i nazwisko: " + '</strong>' + user.profile.fullName + '</div>' +
        //    '<div class="col-md-12"><strong>' + "Adres: " + '</strong>' + user.profile.address + " " + user.profile.zip + '</div>' +
        //    '<div class="col-md-12"><strong>' + "e-mail: " + '</strong>' + getEmail(this) + '<br /><br /></div>' + '<p></p>' +
        //
        //    '<label class="col-md-12 control-label" for="uwagi">Uzasadnienie</label> ' +
        //    '<div class="col-md-12"> ' +
        //    '<textarea id="nazwa" name="nazwa" type="text" placeholder="Nazwa zespołu realizacyjnego" class="form-control"></textarea> ' +
        //    '</div> ' +
        //
        //    '</div>',
        //    buttons: {
        //        success: {
        //            label: "Wyślij zespół",
        //            className: "btn-success",
        //            callback: function () {
        //                var nazwa = $('#nazwa').val();
        //                var newUserDraft = [
        //                    {
        //                        email: user.profile.address,
        //                        login: user.username,
        //                        firstName: user.profile.firstName,
        //                        lastName: user.profile.lastName,
        //                        profession: user.profile.profession,
        //                        address: user.profile.address,
        //                        zip: user.profile.zip,
        //                        gender: user.profile.gender,
        //                        role: user.role,
        //                        userType: USERTYPE.HONOROWY,
        //                        uwagi: uwagi,
        //                        idUser: user._id,
        //                        isExpectant: true
        //                    }];
        //                //tu nie będzei tworzony draft!!!do usuniecia!!!!
        //                Meteor.call('addUserDraft', newUserDraft, function (error, ret) {
        //                    if (error) {
        //                        // optionally use a meteor errors package
        //                        if (typeof Errors === "undefined")
        //                            Log.error('Error: ' + error.reason);
        //                        else {
        //                            throwError(error.reason);
        //                        }
        //                    }
        //                    else {
        //                        var idUserDraft = ret;
        //                        var dataG = new Date();
        //                        var d = dataG.setDate(dataG.getDate() + 7);
        //                        var daneAplikanta = "DANE APLIKANTA: \r\n " +
        //                            user[0].firstName + ", " + user[0].lastName + " \r\n " +
        //                            user[0].email + ", \r\n " +
        //                            user[0].profession + ", \r\n " +
        //                            user[0].address + " " +
        //                            user[0].zip + ", \r\n " +
        //                            user[0].uwagi
        //                        var newKwestia = [
        //                            {
        //                                idUser: Meteor.userId(),
        //                                dataWprowadzenia: new Date(),
        //                                kwestiaNazwa: 'Nadanie statusu- ' + user[0].firstName + " " + user[0].lastName,
        //                                wartoscPriorytetu: 0,
        //                                sredniaPriorytet: 0,
        //                                idTemat: Temat.findOne({})._id,
        //                                idRodzaj: Rodzaj.findOne({})._id,
        //                                dataDyskusji: new Date(),
        //                                dataGlosowania: d,
        //                                krotkaTresc: 'Kwestia o nadanie statusu ' + user[0].userType,
        //                                szczegolowaTresc: daneAplikanta,
        //                                isOption: false,
        //                                status: KWESTIA_STATUS.STATUSOWA,
        //                                idZgloszonego: user._id
        //                            }];
        //                        Meteor.call('addKwestiaStatusowa', newKwestia, function (error) {
        //                            if (error) {
        //                                // optionally use a meteor errors package
        //                                if (typeof Errors === "undefined")
        //                                    Log.error('Error: ' + error.reason);
        //                                else {
        //                                    //if(error.error === 409)
        //                                    throwError(error.reason);
        //                                }
        //                            }
        //                        });
        //                    }
        //                });
        //            }
        //        },
        //        danger: {
        //            label: "Anuluj",
        //            className: "btn-danger"
        //        }
        //    }
        //});

    }
});