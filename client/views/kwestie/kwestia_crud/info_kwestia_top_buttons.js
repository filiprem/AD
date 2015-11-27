Template.kwestiaTopButtons.helpers({
    hasUserRights: function (idKwestia) {
        if(!Meteor.userId())
            return "disabled";
        var user=Meteor.user().profile;
        if(user){
            if(user.userType) {
                if (user.userType != USERTYPE.CZLONEK)
                    return "disabled";
            }
        }
        return isKwestiaGlosowana(idKwestia);
    },
    isRealizowanaNieaktywny:function(status,czyAktywny){
        return (status==KWESTIA_STATUS.REALIZOWANA || status==KWESTIA_STATUS.ZREALIZOWANA) && czyAktywny==true ? true :false;
    },
    isInZR:function(idZR){
        console.log("idZR");
        console.log(idZR);
        var zr=ZespolRealizacyjny.findOne({_id:idZR});
        return _.contains(zr.zespol,Meteor.userId()) ? true : false;
    },
    isZrealizowanaChangeParamsGlosowana:function(typ,status){
        if(Meteor.userId())
            return true;
        return status==KWESTIA_STATUS.ZREALIZOWANA || typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true :false;
    },
    isKwestiaAccessOrChangeParams:function(typ,status,czyAktywny){
        return typ==KWESTIA_TYPE.ACCESS_DORADCA ||
            typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY ||
            typ==KWESTIA_TYPE.ACCESS_HONOROWY ||
            typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ||
            status==KWESTIA_STATUS.GLOSOWANA ||
            status==KWESTIA_STATUS.ZREALIZOWANA ||
            czyAktywny==false ? true : false;
    },
    isKwestiaAccessOrChangeParamsRealizacja:function(typ,status,czyAktywny){
        return ((typ==KWESTIA_TYPE.ACCESS_DORADCA ||
        typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY ||
        typ==KWESTIA_TYPE.ACCESS_HONOROWY ||
        typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) && (status==KWESTIA_STATUS.REALIZOWANA || status==KWESTIA_STATUS.ZREALIZOWANA) && czyAktywny==false) ||
        status==KWESTIA_STATUS.GLOSOWANA ||
        //status==KWESTIA_STATUS.ZREALIZOWANA ||
        status==KWESTIA_STATUS.ADMINISTROWANA ||
        status==KWESTIA_STATUS.OCZEKUJACA ||
        czyAktywny==false ? true : false;
    },
    isKwestiaZrealizowana:function(status){
        return status==KWESTIA_STATUS.ZREALIZOWANA ? true : false;
    }
});
Template.kwestiaTopButtons.events({
    'click #backToList': function (e) {
        window.history.back();
    },
    'click #addOptionButton': function () {
        var kwestiaCanBeInserted=kwestiaIsAllowedToInsert();
       // if(kwestiaCanBeInserted==true) {
            var kw = null;
            var kwestia = Kwestia.findOne({_id: this.idKwestia});
            if (kwestia) {
                if (kwestia.idParent) {
                    if (kwestia.isOption == false)//jezeli to glowna jest,to,ok
                        kw = kwestia;
                    else//znajdz glowna
                        kw = Kwestia.findOne({idParent: kwestia.idParent});

                }
            }
            Session.setPersistent("actualKwestia", kw);
            Router.go("addKwestiaOpcja");
        //}
       // else
        //    notificationPauseWarning("kwestii",kwestiaCanBeInserted);
    },
    'click #doArchiwum': function (e) {
        e.preventDefault();
        var idKw = e.target.name;
        var z = Posts.findOne({idKwestia: idKw, postType: "archiwum"});
        if (z) {
            $('html, body').animate({
                scrollTop: $(".doArchiwumClass").offset().top
            }, 600);
        }
        else {
            $("#uzasadnijWyborArchiwum").modal("show");
        }
    },
    'click #doKosza': function (e) {
        e.preventDefault();
        var idKw = e.target.name;
        var z = Posts.findOne({idKwestia: idKw, postType: "kosz"});
        if (z) {
            $('html, body').animate({
                scrollTop: $(".doKoszaClass").offset().top
            }, 600);
        }
        else {
            $("#uzasadnijWyborKosz").modal("show");
        }
    },
    'click #addRealizationReportClick': function (e) {
        e.preventDefault();

       // var odp=checkRealizationReportExists(this.idKwestia);
        var idKw = e.target.name;
        var param=Parametr.findOne().okresSkladaniaRR;
        console.log("wow");
        console.log(param);
        var previousCheck=moment(new Date()).subtract(param,"minutes").format();
        var timeNow=moment(new Date()).format();
        console.log("time now");
        console.log(timeNow);
        console.log("previous check");
        console.log(previousCheck);
        console.log("id kwestia");
        console.log(this.idKwestia);
        console.log(Raport.find({idKwestia:this.idKwestia}).count());
        var raporty=Raport.find({idKwestia:this.idKwestia,
            dataUtworzenia: {
                $gte: previousCheck,
                $lt: timeNow
            }},{sort:{dataUtworzenia:-1}});

        if(raporty.count()==0) {
            console.log("brak raportów");
            $("#addRRModal").modal("show");
            //return "Raport Realizacyjny";
        }
        else{
            var array=[];
            raporty.forEach(function(raport){
                array.push(raport);

            });
            array.reverse();
            console.log("uwagaaaaaaaaaaaaaa");
            var lastDate=array[0].dataUtworzenia;
            console.log(lastDate);
            if(moment(lastDate).format()<previousCheck)
                $("#addRRModal").modal("show");
            else {
                console.log("jest raport-pokaż");
                return true;

                console.log("jest raport-pokaż");
                $('html, body').animate({
                    scrollTop: $(".doRealizationRaportClass").offset().top
                }, 600);
            }
        }
        //if(odp==true) {
        //    $("#addRRModal").modal("show");
        //}
        //else{
        //    console.log("jest raport-pokaż");
        //    $('html, body').animate({
        //                scrollTop: $(".doRealizationRaportClass").offset().top
        //            }, 600);
        //}
    }
});

checkRealizationReportExists=function(idKwestia){
    var param=Parametr.findOne().okresSkladaniaRR;
    console.log("wow");
    console.log(param);
    var previousCheck=moment(new Date()).subtract(param,"minutes").format();
    var timeNow=new Date();
    console.log("time now");
    console.log(timeNow);
    console.log("previous check");
    console.log(previousCheck);
    console.log(Raport.find({idKwestia:idKwestia}).count());
    var rep=Raport.find({},{sort:{'_id.dataUtworzenia':-1}});
    var flag=false;
    rep.forEach(function(rap){
        console.log(rap);
    });
    var raporty=Raport.find({idKwestia:this.idKwestia,
        dataUtworzenia: {
            //$gte: previousCheck,
            $lt: timeNow
        }},{$sort:{dataUtworzenia:-1}});

    if(raporty.count()==0) {
        console.log("brak raportów");
        return false;
    }
    else{
        var array=[];
        raporty.forEach(function(raport){
            array.push(raport);

        });
        array.reverse();
        console.log("uwagaaaaaaaaaaaaaa");
        var lastDate=array[0].dataUtworzenia;
        console.log(lastDate);
        if(moment(lastDate).format()<previousCheck)
            return false;
        else {
            console.log("jest raport-pokaż");
            return true;
        }
    }
};
