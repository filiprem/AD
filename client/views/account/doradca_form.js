Template.doradcaForm.rendered = function () {
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    $("#doradcaFormApp").validate({
        rules: {
            email: {
                email: true,
                checkExistsEmail: true,
                checkExistsEmailDraft:true
            }
        },
        messages: {
            email: {
                required: fieldEmptyMessage(),
                email:validEmailMessage()
            },
            firstName: {
                required: fieldEmptyMessage()
            },
            lastName: {
                required: fieldEmptyMessage()
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
                profession: $(e.target).find('[name=profession]').val(),
                address: $(e.target).find('[name=address]').val(),
                zip: $(e.target).find('[name=zipCode]').val(),
                gender: $(e.target).find('[name=genderRadios]:checked').val(),
                role: 'user',
                userType:USERTYPE.DORADCA,
                isExpectant:false,
                uwagi:$(e.target).find('[name=uwagi]').val()
            }];
        //-- generowanie loginu dla użytkownika
        newUser[0].login = generateLogin(newUser[0].firstName, newUser[0].lastName);

        //sprawdzic czy podany mail jest już w bazie,jak jest,to zablokuj
        //wyświetlenie komunikatu,ze o wyniku przyjęcia zostanie poinformowany mailem
        //utworzenie nowego usera
        //utworzenie nowej kwestii z idUser
        //poinformowanie użytkowników o pojawieniu się kwestii
        Meteor.call('addUserDraft', newUser, function (error,ret) {
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
                var idUserDraft=ret;
                var dataG = new Date();
                var d = dataG.setDate(dataG.getDate() + 7);
                var daneAplikanta="DANE APLIKANTA: \r\n " +
                    newUser[0].firstName+", "+newUser[0].lastName+" \r\n "+
                    newUser[0].email+", \r\n "+
                    newUser[0].profession+", \r\n "+
                    newUser[0].address+ " "+
                    newUser[0].zip+", \r\n "+
                    newUser[0].uwagi
                var newKwestia = [
                    {
                        idUser: idUserDraft,
                        dataWprowadzenia: new Date(),
                        kwestiaNazwa: 'Aplikowanie- '+newUser[0].firstName+" "+newUser[0].lastName,
                        wartoscPriorytetu: 0,
                        sredniaPriorytet: 0,
                        idTemat: Temat.findOne({})._id,
                        idRodzaj: Rodzaj.findOne({})._id,
                        dataDyskusji: new Date(),
                        dataGlosowania: d,
                        krotkaTresc: 'Aplikacja o przyjęcie do systemu jako '+newUser[0].userType,
                        szczegolowaTresc: daneAplikanta,
                        isOption: false,
                        status:KWESTIA_STATUS.OSOBOWA
                    }];
                    Meteor.call('addKwestia', newKwestia, function (error) {
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
                            Router.go("home");
                            bootbox.dialog({
                                message: "Twój wniosek o przyjęcie do systemu jako "+newUser[0].userType+ " został przyjęty. O wyniku zostaniesz poinformowany drogą mailową",
                                title: "Uwaga",
                                buttons: {
                                    main: {
                                        label: "Ok",
                                        className: "btn-primary",
                                    }
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