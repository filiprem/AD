Template.addKwestiaOpcjaForm.rendered = function () {
    $("#kwestiaOpcjaForm").validate({
        rules: {
            kwestiaNazwa: {
                checkExistsNazwaKwestii: true
            }
        },
        messages: {
            kwestiaNazwa: {
                required: fieldEmptyMessage()
            },
            krotkaTresc: {
                required: fieldEmptyMessage()
            },
            szczegolowaTresc: {
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
            if (element.length) {
                error.insertAfter(element);
            } else {
                error.insertAfter(element);
            }
        }
    })
};
Template.addKwestiaOpcjaForm.helpers({
    kwestiaInfo:function(idKwestia){
        console.log("kwestia info");
        console.log(idKwestia);
        var kwestia=Kwestia.findOne({_id:idKwestia});
        if(kwestia)
            return kwestia;
    },
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj}).nazwaRodzaj;
    },
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat}).nazwaTemat;
    },
    krotkaTrescValidator: function (tresc) {
        if (tresc && stringContains(tresc, "Wnioskuję podjęcie uchwały:"))
            tresc = tresc.replace("Wnioskuję podjęcie uchwały: ", "");

        return tresc;
    },
    isKwestiaOsobowa:function(){
        return this.status==KWESTIA_STATUS.OSOBOWA ? true :false;
    },
    protectorZR:function(){
        if(!Meteor.userId()) return false;
        var zr=ZespolRealizacyjny.findOne();
        console.log("protector");
        console.log(zr);
        if(zr){
            if(zr.protector)
                return zr.protector==Meteor.userId() ? true : false;
        }
    }
});

Template.addKwestiaOpcjaForm.events({
    'submit form': function (e) {
        e.preventDefault();
        document.getElementById("submitAddKwestiaOpcja").disabled = true;
        var parentIssue = this;
        Meteor.setTimeout(function () {
            document.getElementById("submitAddKwestiaOpcja").disabled = false;
            var eventForm = $(e.target);
            //var idParentKwestii = Session.get("idKwestia");
            var dataG = new Date();
            var d = dataG.setDate(dataG.getDate() + 7);
            var szczegolowaTresc = null;
            if (parentIssue.status == KWESTIA_STATUS.OSOBOWA) {
                szczegolowaTresc = parentIssue.szczegolowaTresc;
                szczegolowaTresc.uwagi = $(e.target).find('[name=szczegolowaTrescUwagi]').val()
            }
            else
                szczegolowaTresc = $(e.target).find('[name=szczegolowaTresc]').val();

            var newKwestiaOpcja = [{
                idUser: Meteor.userId(),
                dataWprowadzenia: new Date(),
                kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
                wartoscPriorytetu: 0,
                wartoscPriorytetuWRealizacji: 0,
                sredniaPriorytet: 0,
                status: parentIssue.status,
                idTemat: parentIssue.idTemat,
                idRodzaj: parentIssue.idRodzaj,
                idZespolRealizacyjny: parentIssue.idZespolRealizacyjny,
                dataDyskusji: new Date(),
                dataGlosowania: d,
                krotkaTresc: $(e.target).find('[name=krotkaTresc]').val(),
                szczegolowaTresc: szczegolowaTresc,
                idParent: parentIssue._id,
                isOption: true,
                numerUchwały: null,
                czyAktywny: true,
                typ: KWESTIA_TYPE.BASIC,
                issueNumber: parentIssue.issueNumber
            }];
            console.log("kwestia prev");
            console.log(newKwestiaOpcja[0]);
            // Session.set("kwestiaPreviewOpcja", newKwestiaOpcja[0]);
            Session.setPersistent("actualKwestia", newKwestiaOpcja[0]);
            Router.go('previewKwestiaOpcja');
        },2000);
    },
    'click #anuluj': function () {
        Session.setPersistent("actualKwestia", null);
        Router.go("informacjeKwestia", {_id: Session.get("idKwestia")});
    }
});