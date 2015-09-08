Template.previewKwestia.helpers({
    getTematName: function (id) {
        return Temat.findOne({_id: id}).nazwaTemat;
    },
    getRodzajName: function (id) {
        return Rodzaj.findOne({_id: id}).nazwaRodzaj;
    },
    szczegolowaTresc: function(){
        var sess=Session.get("kwestiaPreview");
        var t=null;
        if(sess){
            t=sess.szczegolowaTresc;
            if(t)
            {
                return t.length > 30 ? t.substring(0, 30) + "..." : t;
            }
            else return null;
        }
    },
    krotkaTresc: function(){
        var sess=Session.get("kwestiaPreview");
        var t=null;
        if(sess){
            t=sess.krotkaTresc;
            if(t)
            {
                return t.length > 30 ? t.substring(0, 30) + "..." : t;
            }
            else return null;
        }
    },
    temat:function(){
        var sess=Session.get("kwestiaPreview");
        var t=null;
        if(sess){
            t=firstLetterToUpperCase(sess.temat);
            return t ? t : null;
        }
    },
    rodzaj:function(){
        var sess=Session.get("kwestiaPreview");
        var t=null;
        if(sess){
            t=firstLetterToUpperCase(sess.rodzaj);
            return t ? t : null;
        }
    }
});

Template.previewKwestia.events({
    'click #cancel': function () {
        Session.set("kwestiaPreview", null);
        Router.go("listKwestia");
    },
    'click #save': function (e) {
        e.preventDefault();

        var kwestia = Session.get("kwestiaPreview");
        var temat=kwestia.temat;
        var rodzaj=kwestia.rodzaj;

        var idParentKwestii = Session.get("idKwestia");
        var isOption=false;



        kwestia.idParent ? isOption=true : isOption=false;
        setValue(temat,rodzaj,isOption,kwestia);

    }
});
setValue=function(temat,rodzaj,isOption,kwestia){
    var idTemat=null;
    var idRodzaj=null;

    var foundIdTemat=null;
    Temat.find({}).forEach(function (item) {
        if(item.nazwaTemat.trim().toLowerCase()==temat.trim().toLowerCase())
        {
            foundIdTemat=item._id;
            return;
        }
    });
    //je�eli nie ma tematu,dodaj nowy,to rodzaju te� nie mo�e by�,dodaj rodzaj!

    if(foundIdTemat==null) {
        temat=firstLetterToUpperCase(temat);

        var nowyTemat=[{
            nazwaTemat:temat,
            opis:""
        }];
        Meteor.call('addTemat', nowyTemat, function (error,ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);

            }
            else {
                rodzaj=firstLetterToUpperCase(rodzaj);
                var newRodzaj=[{
                    idTemat:ret,
                    nazwaRodzaj: rodzaj,
                    czasDyskusji:7,
                    czasGlosowania:24
                }];
                idTemat=ret;

                Meteor.call('addRodzaj', newRodzaj, function (error,ret) {
                    if (error) {
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else
                            throwError(error.reason);

                    }
                    else {
                        idRodzaj=ret;
                        addKwestia(idTemat,idRodzaj,isOption,kwestia);
                    }
                });
            }
        });
    }
    //jezeli temat jest,to sprawdzam czy jest rodzaj
    else {
        var foundIdRodzaj=null;
        idTemat=foundIdTemat;
        Rodzaj.find({}).forEach(function (item) {
            if(item.idTemat==foundIdTemat)
            {
                if(item.nazwaRodzaj.trim().toLowerCase()==rodzaj.trim().toLowerCase()){
                    idTemat=item.idTemat;
                    idRodzaj=item._id;
                    foundIdRodzaj=item._id;
                }
            }
        });
        if(foundIdRodzaj==null){//jezeli nie ma rodzaju,to dodaj rodzaj z istneijacym tematem

            rodzaj=firstLetterToUpperCase(rodzaj);
            var newRodzaj=[{
                idTemat:idTemat,
                nazwaRodzaj: rodzaj,
                czasDyskusji:7,
                czasGlosowania:24
            }];
            Meteor.call('addRodzaj', newRodzaj, function (error,ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);

                }
                else{
                    idRodzaj=ret;
                    addKwestia(idTemat,idRodzaj,isOption,kwestia);
                }
            });
        }
        else{
            addKwestia(idTemat,idRodzaj,isOption,kwestia);
        }
    }

};

firstLetterToUpperCase=function(text){
    var firstLetter= text.charAt(0).toUpperCase();
    return text.replace(text.charAt(0),firstLetter);
};
addKwestia=function(idTemat,idRodzaj,isOption,kwestia){
    var status = KWESTIA_STATUS.DELIBEROWANA;
    var newKwestia = [{
        idUser: Meteor.userId(),
        dataWprowadzenia: new Date(),
        kwestiaNazwa: kwestia.kwestiaNazwa,
        wartoscPriorytetu: 0,
        sredniaPriorytet: 0,
        idTemat: idTemat,
        idRodzaj: idRodzaj,
        dataDyskusji: kwestia.dataDyskusji,
        dataGlosowania: kwestia.dataGlosowania,
        status: status,
        krotkaTresc: kwestia.krotkaTresc,
        szczegolowaTresc: kwestia.szczegolowaTresc,
        isOption: false,
        sugerowanyTemat: kwestia.sugerowanyTemat,
        sugerowanyRodzaj: kwestia.sugerowanyRodzaj
    }];
    Meteor.call('addKwestia', newKwestia, function (error, ret) {
        if (error) {
            if (typeof Errors === "undefined")
                Log.error('Error: ' + error.reason);
            else {
                throwError(error.reason);
            }
        }
        else {
            Session.set("kwestiaPreview", null);
            Meteor.call("sendEmailAddedIssue", ret);
            Router.go('administracjaUserMain');
        }
    });
};