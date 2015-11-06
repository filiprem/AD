Template.ZRTemplate.helpers({
    getZRName:function(idZR,status){
        var zespolR=null;
        if(status==KWESTIA_STATUS.REALIZOWANA)
            zespolR = ZespolRealizacyjny.findOne({_id: idZR});
        else
            zespolR= ZespolRealizacyjnyDraft.findOne({_id:idZR});

        if (zespolR){
            console.log(zespolR);
            return zespolR.zespol.slice().length==3 ? zespolR.nazwa :null;
        }
    },
    isInKoszOrZrealizowana:function(czyAktywny,status){
        console.log("czyaktywny");
        console.log(czyAktywny);
        return czyAktywny==false || status==KWESTIA_STATUS.ZREALIZOWANA ? true :false;
    },
    statusGlosowanaOsobowaRealizowanaZrealizowana:function(status){
        return status==KWESTIA_STATUS.GLOSOWANA || status==KWESTIA_STATUS.OSOBOWA ||
        status==KWESTIA_STATUS.REALIZOWANA || status==KWESTIA_STATUS.ZREALIZOWANA ? true : false;
    },
    pierwszyCzlonekFullName: function(idZR){
        return getCzlonekFullName(0,idZR,"ZRDraft");
    },
    drugiCzlonekFullName: function(idZR){
        //return getCzlonekFullName(1,this._id);
        return getCzlonekFullName(1,idZR,"ZRDraft");
    },
    trzeciCzlonekFullName: function(idZR){
        //return getCzlonekFullName(2,this._id);
        return getCzlonekFullName(2,idZR,"ZRDraft");
    },
    isActualUser:function(index,idZR){
        var userID=getZRData(index,idZR,"ZRDraft");
        console.log(userID);
        if(userID){
            if(userID!=Meteor.userId())
                return "disabled";
            return this.status==KWESTIA_STATUS.GLOSOWANA ? "disabled" :"";
        }
        return "disabled";
    },
    isInZR:function(idZr){
        var zrDraft=ZespolRealizacyjnyDraft.findOne({_id:idZr});
        if(zrDraft){
            return _.contains(zrDraft.zespol,Meteor.userId()) ? "disabled" :"";
        }
    },
    getZRCzlonkowie:function(idZR,status){
        console.log("tuuu");
        var zespol=null;
        var text=null;
        if(status==KWESTIA_STATUS.GLOSOWANA || status==KWESTIA_STATUS.OSOBOWA) {
            zespol = ZespolRealizacyjnyDraft.findOne({_id: idZR});
            text="ZRDraft";
        }
        else {
            zespol = ZespolRealizacyjny.findOne({_id: idZR});
            text="ZR";
        }
        console.log(zespol);
        var data="";
        if(zespol){
            for(var i=0;i<zespol.zespol.length;i++){
                data+=getCzlonekFullName(i,zespol._id,text)+",";
            }
        }
        return data;
    },
    getZRCzlonkowieKosz:function(zespol){
        var data="";
        _.each(zespol.czlonkowie,function(czlonek){
           data+=czlonek+",";
        });
        return data;
    }
});

Template.ZRTemplate.events({
    'click #czlonek1': function () {
        //zmiana!
        console.log("czlonek 1");
        console.log(this.idZR);
        zespolId=this.idZR;
        var idUser=getZRData(0,this.idZR,"ZRDraft");
        //var idUser=checkIfInZR(zespolId,Meteor.userId());
        if(idUser==Meteor.userId()){//jezeli jest juz w zespole
            rezygnujZRAlert(getZRData(0,zespolId,"ZRDraft"),this.idKwestia);
            //rezygnujZRAlert(checkIfInZR(zespolId,Meteor.userId()),this.idKwestia);
        }
        else {//nie ma go w zespole
            console.log("tutaj wejdzie");
            var z = ZespolRealizacyjnyDraft.findOne({_id: zespolId});
            console.log("ten zespół");
            console.log(z);
            var zespolToUpdate = z.zespol.slice();
            if (z.zespol.length > 0) {
                GlobalNotification.error({
                    title: 'Błąd',
                    content: 'Jest już pierwszy członek ZR.',
                    duration: 3 // duration the notification should stay in seconds
                });
                return false;
            }
            else {
                if (addCzlonekToZespolRealizacyjnyNotificationNew(Meteor.userId(), zespolToUpdate, 2, zespolId) == false) {
                    bladNotification();
                }
            }
        }
    },
    'click #czlonek2': function () {

        zespolId=this.idZR;
        //var idUser=getZRData(1,zespolId);
        var idUser=checkIfInZR(zespolId,Meteor.userId());
        if(idUser==Meteor.userId()) {//to znaczy,że już jestem w zespole i mogę zrezygnować
            //rezygnujZRAlert(getZRData(1,zespolId,"ZRDraft"),this.idKwestia);
            rezygnujZRAlert(checkIfInZR(zespolId,Meteor.userId()),this.idKwestia);
        }
        else {
            var z = ZespolRealizacyjnyDraft.findOne({_id: zespolId});

            var zespolToUpdate = z.zespol.slice();
            var liczba = 3 - z.zespol.length - 1;

            if (isUserInZespolRealizacyjnyNotification(Meteor.userId(), zespolToUpdate) == false) {//jeżeli nie jest w zespole
                if (isUserCountInZespolRealizacyjnyNotification(Meteor.userId(), zespolToUpdate, 2) == false) {//jeżeli jest drugi

                    if (addCzlonekToZespolRealizacyjnyNotificationNew(Meteor.userId(), zespolToUpdate, liczba, zespolId) == false) {
                        bladNotification();
                    }
                }
            }
        }

    },
    'click #czlonek3': function () {

        zespolId=this.idZR;
        //var idUser=getZRData(2,this.idZR,"ZRDraft");
        var idUser=checkIfInZR(zespolId,Meteor.userId());
        if(idUser==Meteor.userId()) {
            //rezygnujZRAlert(getZRData(1, zespolId,"ZRDraft"), this.idKwestia);
            rezygnujZRAlert(checkIfInZR(zespolId,Meteor.userId()),this.idKwestia);
        }
        else {
            var z = ZespolRealizacyjnyDraft.findOne({_id: zespolId});

            var zespolToUpdate = z.zespol.slice();
            var liczba = 3 - z.zespol.length - 1;

            if (isUserInZespolRealizacyjnyNotification(Meteor.userId(), zespolToUpdate) == false) {//jeżeli nie jest w zespole
                if (isUserCountInZespolRealizacyjnyNotification(Meteor.userId(), zespolToUpdate, 2) == false) {

                    if (addCzlonekToZespolRealizacyjnyNotificationNew(Meteor.userId(), zespolToUpdate, liczba, zespolId) == false) {
                        bladNotification();
                    }
                }
            }
        }
    },
    'click #listaZR': function(){
        $("#listZespolRealizacyjny").modal("show");
    }
});