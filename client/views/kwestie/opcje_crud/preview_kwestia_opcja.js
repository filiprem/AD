Template.previewKwestiaOpcja.helpers({
    getTematName:function(id){
        return Temat.findOne({_id:id}).nazwaTemat;
    },
    getRodzajName:function(id){
        return Rodzaj.findOne({_id:id}).nazwaRodzaj;
    },
    isKwestiaOsobowa:function(){
        return this.status==KWESTIA_STATUS.OSOBOWA ? true :false;
    },
    protectorZR:function(){
        if(!Meteor.userId()) return false;
        var zr=ZespolRealizacyjny.findOne();
        if(zr){
            if(zr.protector)
                return zr.protector==Meteor.userId() ? true : false;
        }
    }
});

Template.previewKwestiaOpcja.events({
    'click #cancel':function(){
        //Session.set("kwestiaPreviewOpcja",null);
        Session.set("actualKwestia",null);
        Router.go("listKwestia");
    },
    'click #save': function(e){
        e.preventDefault();
        console.log("bêdzie zapis");
        var kwestia = Session.get("actualKwestia");
        console.log(kwestia);
        console.log(kwestia.status);
        //var idParentKwestii = Session.get("idKwestia");
        var newKwestiaOpcja = [{
            idUser: Meteor.userId(),
            dataWprowadzenia: moment(new Date()).format(),
            kwestiaNazwa: kwestia.kwestiaNazwa,
            wartoscPriorytetu: 0,
            wartoscPriorytetuWRealizacji: 0,
            sredniaPriorytet: 0,
            idTemat: kwestia.idTemat,
            idRodzaj: kwestia.idRodzaj,
            dataDyskusji: kwestia.dataDyskusji,
            dataGlosowania: kwestia.dataGlosowania,
            dataRealizacji: null,
            czyAktywny: true,
            status: kwestia.status,
            krotkaTresc: kwestia.krotkaTresc,
            szczegolowaTresc: kwestia.szczegolowaTresc,
            idParent: kwestia.idParent,
            isOption: true,
            idZespolRealizacyjny:kwestia.idZespolRealizacyjny
        }];
        console.log(newKwestiaOpcja[0]);
        var methodToCall=null;
        if(kwestia.status==KWESTIA_STATUS.OSOBOWA)
            methodToCall="addKwestiaOsobowaOpcja";
        else methodToCall="addKwestiaOpcja";
        Meteor.call(methodToCall, newKwestiaOpcja, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else {
                addPowiadomienieBasicOptionIssueFunction(ret,newKwestiaOpcja[0].dataWprowadzenia);
                var userKwestia= Meteor.userId();
                var newValue=0;

                newValue=Number(RADKING.DODANIE_KWESTII)+getUserRadkingValue(userKwestia);

                Meteor.call('updateUserRanking', userKwestia,newValue, function (error) {
                    if (error)
                    {
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else {
                            throwError(error.reason);
                        }
                    }
                });

                Session.set("kwestiaPreviewOpcja",null);
                Session.set("actualKwestiaId",null);
                Router.go('listKwestia');
            }
        });
    }
});

addPowiadomienieBasicOptionIssueFunction=function(idKwestia,dataWprowadzenia){
    var users=Users.find({'profile.userType':USERTYPE.CZLONEK});
    //var kwestia=Kwestia.findOne({_id:idKwestia});
    users.forEach(function(user){
        var newPowiadomienie ={
            idOdbiorca: user._id,
            idNadawca: null,
            dataWprowadzenia: dataWprowadzenia,
            tytul: "",
            powiadomienieTyp: NOTIFICATION_TYPE.NEW_ISSUE,
            tresc: "",
            idKwestia:idKwestia,
            czyAktywny: true,
            czyOdczytany:false
        };
        Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
            if(error)
                console.log(error.reason);
        })
    });

};