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
        return status==KWESTIA_STATUS.REALIZOWANA && czyAktywny==true ? true :false;
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
        console.log("dane");
        console.log(typ);
        console.log(status);
        console.log(czyAktywny);
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
        console.log("uwagaaa"+ status);
        return status==KWESTIA_STATUS.ZREALIZOWANA ? true : false;
    }
});
Template.kwestiaTopButtons.events({
    'click #backToList': function (e) {
        window.history.back();
    },
    'click #addOptionButton': function () {
        var kwestiaCanBeInserted=kwestiaIsAllowedToInsert();
        if(kwestiaCanBeInserted==true) {
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
        }
        else
            notificationPauseWarning("kwestii",kwestiaCanBeInserted);
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
    'click #zrealizowanaClick': function (e) {
        e.preventDefault();
        var idKw = e.target.name;
        var z = Posts.findOne({idKwestia: idKw, postType: POSTS_TYPES.ZREALIZOWANA});
        if (z) {
            $('html, body').animate({
                scrollTop: $(".doZrealizowaniaClass").offset().top
            }, 600);
        }
        else {
            $("#uzasadnijRealizacjeKwesti").modal("show");
        }
    },
});
