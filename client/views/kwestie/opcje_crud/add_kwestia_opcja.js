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
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj}).nazwaRodzaj;
    },
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat}).nazwaTemat;
    },
    isKwestiaOsobowa:function(){
        return this.status==KWESTIA_STATUS.OSOBOWA ? true :false;
    },
    protectorZR:function(){
        if(!Meteor.userId()) return false;
        var zr=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"});
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
                status: parentIssue.status,
                idTemat: parentIssue.idTemat,
                idRodzaj: parentIssue.idRodzaj,
                krotkaTresc: $(e.target).find('[name=krotkaTresc]').val(),
                szczegolowaTresc: szczegolowaTresc,
                idParent: parentIssue._id,
                isOption: true,
                numerUchwały: null,
                czyAktywny: true,
                typ: KWESTIA_TYPE.BASIC,
                issueNumber: parentIssue.issueNumber
            }];
            Session.setPersistent("actualKwestia", newKwestiaOpcja[0]);
            Router.go('previewKwestiaOpcja');
        },2000);
    },
    'click #anuluj': function () {
        Session.setPersistent("actualKwestia", null);
        Router.go("informacjeKwestia", {_id: Session.get("idKwestia")});
    }
});