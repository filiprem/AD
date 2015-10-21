Template.ZRTemplate.helpers({
    getZRName:function(idZR,status){
        var zespolR=null;
        if(status==KWESTIA_STATUS.OSOBOWA)
            zespolR = ZespolRealizacyjny.findOne({_id: idZR});
        else
            zespolR= ZespolRealizacyjnyDraft.findOne({_id:idZR});

        if (zespolR){
            console.log(zespolR);
            return zespolR.zespol.slice().length==3 ? zespolR.nazwa :null;
        }
    },
    statusGlosowanaOsobowa:function(status){
        return status==KWESTIA_STATUS.GLOSOWANA || status==KWESTIA_STATUS.OSOBOWA ? true : false;
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
    isActualUser:function(index){
        console.log("index:");
        console.log(index);
        var userID=getZRData(index,this.idZR);
        console.log(userID);
        if(userID){
            if(userID!=Meteor.userId())
                return "disabled";
            return this.status=KWESTIA_STATUS.GLOSOWANA ? "disabled" :"";
        }
    },
    getZRCzlonkowie:function(idZR){
        var zespol=ZespolRealizacyjny.findOne({_id: idZR});
        var data="";
        if(zespol){
            for(var i=0;i<zespol.zespol.length;i++){
                data+=getCzlonekFullName(i,zespol._id,"ZR")+",";
            }
        }
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
        if(idUser==Meteor.userId()){//jezeli jest juz w zespole
            rezygnujZRAlert(getZRData(0,zespolId,"ZRDraft"),this.idKwestia);
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
                console.log("next step hiere");
                if (addCzlonekToZespolRealizacyjnyNotificationNew(Meteor.userId(), zespolToUpdate, 2, zespolId) == false) {
                    bladNotification();
                }
            }
        }
    },
    'click #czlonek2': function () {

        zespolId=this.idZR;
        var idUser=getZRData(1,zespolId);
        if(idUser==Meteor.userId()) {//to znaczy,że już jestem w zespole i mogę zrezygnować
            rezygnujZRAlert(getZRData(1,zespolId,"ZRDraft"),this.idKwestia);
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

        zespolId=this.idZespolRealizacyjny;
        var idUser=getZRData(2,this.idZR,"ZRDraft");
        if(idUser==Meteor.userId()) {
            rezygnujZRAlert(getZRData(1, zespolId,"ZRDraft"), this.idKwestia);
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