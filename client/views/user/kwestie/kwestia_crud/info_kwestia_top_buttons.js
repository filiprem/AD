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
    isZrealizowanaChangeParamsGlosowana:function(typ,status){
        if(Meteor.userId())
            return true;
        return status==KWESTIA_STATUS.ZREALIZOWANA || typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true :false;
    },
    isKwestiaAccessOrChangeParams:function(typ){
        return typ==KWESTIA_TYPE.ACCESS_HONOROWY ||
            typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY ||
            typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true : false;
    },
    isKwestiaChangeParams:function(typ){
        console.log("typ");console.log(typ);
        return typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true : false;
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
        Session.setPersistent("actualKwestia", Kwestia.findOne({_id: this.idKwestia}));
        Router.go("addKwestiaOpcja");
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
    }
});
