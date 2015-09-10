Template.doradcaForm.rendered = function () {
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    $("#doradcaFormApp").validate({
        rules: {
            email: {
                email: true,
                checkExistsEmail: USERTYPE.DORADCA,//czy juz nie ma mnie jako doradca w systemie
                checkExistsEmail2: USERTYPE.CZLONEK,//czy nie jestem wyzej
                checkExistsEmailDraft: true
            }
        },
        messages: {
            email: {
                required: fieldEmptyMessage(),
                email: validEmailMessage()
            },
            firstName: {
                required: fieldEmptyMessage()
            },
            lastName: {
                required: fieldEmptyMessage()
            },
            phone:{
                required:fieldEmptyMessage()
            }
        },
        highlight: function (element) {
            highlightFunction(element);
        },
        unhighlight: function (element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            validationPlacementError(error, element);
        }
    })
};

Template.doradcaForm.events({
    'submit form': function (e) {
        e.preventDefault();
        // uzupełnienie tymczasowej tablicy danymi z formularza
        var newUser = [
            {
                email: $(e.target).find('[name=email]').val(),
                login: "",
                firstName: $(e.target).find('[name=firstName]').val(),
                lastName: $(e.target).find('[name=lastName]').val(),
                phone: $(e.target).find('[name=phone]').val(),
                web: $(e.target).find('[name=www]').val(),
                role: 'user',
                userType: USERTYPE.DORADCA,
                isExpectant: false,
                uwagi: $(e.target).find('[name=uwagi]').val()
            }];
        //-- generowanie loginu dla użytkownika
        newUser[0].login = generateLogin(newUser[0].firstName, newUser[0].lastName);

        //sprawdzic czy podany mail jest już w bazie,jak jest,to zablokuj
        //wyświetlenie komunikatu,ze o wyniku przyjęcia zostanie poinformowany mailem
        //utworzenie nowego usera
        //utworzenie nowej kwestii z idUser
        //poinformowanie użytkowników o pojawieniu się kwestii
        Meteor.call('addUserDraft', newUser, function (error, ret) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    //if(error.error === 409)
                    throwError(error.reason);
                }
            }
            else {
                var web="";
                if(newUser[0].web!=null)
                web=newUser[0].web;
                var uwagi="";
                if(newUser[0].uwagi!=null)
                uwagi=newUser[0].uwagi;

                var idUserDraft = ret;
                var dataG = new Date();
                var d = dataG.setDate(dataG.getDate() + 7);
                var daneAplikanta = "DANE APLIKANTA: \r\n " +
                    newUser[0].firstName + ", " + newUser[0].lastName + " \r\n " +
                    newUser[0].email + ", \r\n " +
                    newUser[0].phone + ", \r\n " +
                    web +  ",  \r\n " +
                    uwagi;
                var newKwestia = [
                    {
                        idUser: idUserDraft,
                        dataWprowadzenia: new Date(),
                        kwestiaNazwa: 'Aplikowanie- ' + newUser[0].firstName + " " + newUser[0].lastName,
                        wartoscPriorytetu: 0,
                        sredniaPriorytet: 0,
                        idTemat: Temat.findOne({})._id,
                        idRodzaj: Rodzaj.findOne({})._id,
                        dataDyskusji: new Date(),
                        dataGlosowania: d,
                        krotkaTresc: 'Aplikacja o przyjęcie do systemu jako ' + newUser[0].userType,
                        szczegolowaTresc: daneAplikanta,
                        isOption: false,
                        status: KWESTIA_STATUS.OSOBOWA
                    }];
                Meteor.call('addKwestia', newKwestia, function (error,ret) {
                    if (error) {
                        // optionally use a meteor errors package
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else {
                            //if(error.error === 409)
                            throwError(error.reason);
                        }
                    }
                    else {//update jej ZR
                        var zr=ZespolRealizacyjny.findOne({});
                        var kwestia=Kwestia.findOne({_id:ret});
                        var myZRDraft=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
                        var ZRdataToUpdate={
                          nazwa:zr.nazwa,
                          zespol:zr.zespol
                        };
                        Meteor.call('updateZespolRealizacyjnyDraft', myZRDraft._id,ZRdataToUpdate, function (error,ret) {
                            if (error) {
                                // optionally use a meteor errors package
                                if (typeof Errors === "undefined")
                                    Log.error('Error: ' + error.reason);
                                else
                                    throwError(error.reason);
                            }
                            else {
                                Router.go("home");
                                przyjecieWnioskuConfirmation(newUser[0].email,"doradztwo");
                            }
                        });

                    }
                });
            }
        });
    },
    'reset form': function () {
        Router.go('home');
    }
});
Template.doradcaForm.helpers({
    nazwaOrganizacji:function(){
        return Parametr.findOne() ? Parametr.findOne().nazwaOrganizacji :"Aktywna Demokracja";
    }
});