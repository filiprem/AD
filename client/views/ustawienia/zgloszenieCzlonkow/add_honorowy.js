var selectedOption=new ReactiveVar();
var emailInserted=new ReactiveVar();
emailInserted.set("");
Template.addHonorowy.rendered=function(){
    selectedOption.set("chooseNewOption");

    $("#honorowyForm").validate({
        rules: {
            email: {
                email: true,
                checkExistsAnyEmail: true,
                checkExistsEmailDraft:true
            },
            pesel:{
                exactlength: 11,
                peselValidation:true
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
            personChosen: {
                required: fieldEmptyMessage()
            },
            personChosen1: {
                required: fieldEmptyMessage()
            },
            uzasadnienie: {
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
            if(element.attr("name") == "personChosen")
            console.log('to ten element');
            if(element.attr("name") == "statutConfirmation")
                error.insertAfter(document.getElementById("statutConfirmationSpan"));
            else
                validationPlacementError(error, element);
        }
    });
};
Template.addHonorowy.events({
    'change #email': function (e) {
        console.log("email changed");
        var value=$(e.target).val();
        emailInserted.set(value);
    },
    'change #chooseOption': function (e) {
        var value=$(e.target).val();
        selectedOption.set(value);
    },
    'click #chooseDoradca':function(e){
        console.log(document.getElementById("chosenDor").value);
        var chosenPersonId=document.getElementById("chosenDor").value;
        var user=Users.findOne({_id:chosenPersonId});

        document.getElementById("reactiveTable").style.display="none";
        document.getElementById("chosenCandidate").style.display="block";

        document.getElementById("personChosen").value=user.profile.firstName+" "+user.profile.lastName;
    },
    'click #removeChosenPerson':function(e){
        document.getElementById("reactiveTable").style.display="block";
        document.getElementById("chosenCandidate").style.display="none";
    },
    'submit form':function(e){
        e.preventDefault();

        if(selectedOption.get()=="chooseNewOption"){//kwestia z gościem
            var newUserDraft = [
                {
                    email: $(e.target).find('[name=email]').val(),
                    login: "",
                    firstName: $(e.target).find('[name=firstName]').val(),
                    lastName: $(e.target).find('[name=lastName]').val(),
                    role: 'user',
                    uwagi: $(e.target).find('[name=uzasadnienie]').val(),
                    userType: USERTYPE.HONOROWY,
                    pesel:""
                }];
            addUserDraftHonorowy(newUserDraft);
        }
        else{
            console.log("dddd");
            var el=document.getElementById("personChosen").value;
            if(el!=null && el.trim()!=""){
                console.log("yeah!");
            }
        }
    },
    'reset form':function(){
        selectedOption.set("chooseNewOption");
    }
});
Template.addHonorowy.helpers({
    chooseNewOption:function(){
        return selectedOption.get()=="chooseNewOption" ? true : false;
    },
    'settings': function () {
        var self = Template.instance();
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: '_id', label: "Imię i Nazwisko",tmpl: Template.userDataLink},
                //{key: 'profile.lastName', label: "Nazwisko"},
                {key: 'profile.city', label: "Miasto"}
            ]
        };
    },
    DoradcyList:function(){
        return Users.find({'profile.userType':USERTYPE.DORADCA,_id:{$nin:[Meteor.userId()]}});
    }
});
Template.userDataLink.helpers({
    userData:function(){
        return this.profile.firstName+" "+this.profile.lastName;
    }
});
addUserDraftHonorowy=function(newUser){
    console.log("add user draft");
    console.log(newUser);
    Meteor.call('addUserDraft', newUser, function (error, ret) {
        if (error) {
            console.log(error.reason);
        }
        else {
            addKwestiaOsobowaHonorowy(ret, newUser);
        }
    });
};
addKwestiaOsobowaHonorowy=function(idUserDraft,newUser){
    var ZR=ZespolRealizacyjny.findOne();
    var newZR=[{
        nazwa:ZR.nazwa,
        idZR:ZR._id,
        zespol:ZR.zespol
    }];
    Meteor.call('addZespolRealizacyjnyDraft', newZR, function (error,ret) {
        if (error) {
            console.log(error.reason);
        }
        else {
            var daneAplikanta = {
                fullName: newUser[0].firstName + " " + newUser[0].lastName,
                email: newUser[0].email,
                uwagi: newUser[0].uwagi
            };
            var newKwestia = [
                {
                    idUser: idUserDraft,
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: 'Prośba o możliwość aplikowania na stanowisko członka honorowego- ' + newUser[0].firstName + " " + newUser[0].lastName,
                    wartoscPriorytetu: 0,
                    wartoscPriorytetuWRealizacji: 0,
                    sredniaPriorytet: 0,
                    idTemat: Temat.findOne({})._id,
                    idRodzaj: Rodzaj.findOne({})._id,
                    idZespolRealizacyjny: ret,
                    dataGlosowania: null,
                    krotkaTresc: 'Prośba o możliwość aplikowania do systemu na stanowisko członka honorowego',
                    szczegolowaTresc: daneAplikanta,
                    isOption: false,
                    status: KWESTIA_STATUS.STATUSOWA,
                    typ: KWESTIA_TYPE.ACCESS_HONOROWY,
                    idZglaszajacego:Meteor.userId()
                }];
            console.log("add kwestia");
            console.log(newKwestia);
            Meteor.call('addKwestiaStatusowa', newKwestia, function (error, ret) {
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
                    przyjecieWnioskuHonorowyConfirmation(Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej, daneAplikanta.email, "członek honorowy");
                    var user = UsersDraft.findOne({_id: idUserDraft});
                    //Meteor.call("sendApplicationConfirmation", user);
                }
            });
        }
    });
};