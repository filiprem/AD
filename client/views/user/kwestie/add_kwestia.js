Template.addKwestiaForm.rendered = function(){
    //$('#test1').datetimepicker({sideBySide: true});
    $('#test2').datetimepicker({sideBySide: true});
    $('#test3').datetimepicker({sideBySide: true});
    //setTematy();
    //setRodzaje();
};

Template.addKwestiaForm.helpers({
    tematToList: function(){
        return Temat.find({}).fetch();
    } ,
    rodzajToList: function(){
        return Rodzaj.find({}).fetch();
    },
    tresc: function(){
        var r = Session.get("rodzaj");
        if(r=="Uchwała"){
            return "Wnioskuję podjęcie uchwały: ";
        }
    }
});

Template.addKwestiaForm.events({
    'change [name=rodzaje]': function(){
        var rodzajId = $('[name=rodzaje]').val();
        var r = Rodzaj.findOne({_id: rodzajId});
        Session.set("rodzaj", r.nazwaRodzaj);
    },
    'submit form': function (e) {
        e.preventDefault();

        var dataG =  new Date();
        var d = dataG.setDate(dataG.getDate()+7);

        var newKwestiaDraft = [
            {
                userId: Meteor.userId(),
                dataWprowadzenia: new Date(),
                kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
                wartoscPriorytetu: 0,
                sredniaPriorytet: 0,
                temat_id: $(e.target).find('[name=tematy]').val(),
                rodzaj_id: $(e.target).find('[name=rodzaje]').val(),
                pulapPriorytetu: Rodzaj.findOne({_id:$(e.target).find('[name=rodzaje]').val()}).pulapPriorytetu,
                dataDyskusji: new Date(),
                dataGlosowania: d,
                //historia: $(e.target).find('[name=historia]').val(),
                krotkaTresc: $(e.target).find('[name=tresc]').val() + " " + $(e.target).find('[name=krotkaTresc]').val(),
                szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val()
            }];

        if (
            isNotEmpty(newKwestiaDraft[0].kwestiaNazwa) &&
            isNotEmpty(newKwestiaDraft[0].temat_id) &&
            isNotEmpty(newKwestiaDraft[0].rodzaj_id) &&
            isNotEmpty(newKwestiaDraft[0].dataDyskusji) &&
            isNotEmpty(newKwestiaDraft[0].dataGlosowania) &&
            isNotEmpty(newKwestiaDraft[0].krotkaTresc) &&
            isNotEmpty(newKwestiaDraft[0].szczegolowaTresc)
        ) {
            Meteor.call('addKwestiaDraft', newKwestiaDraft, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
                else {
                    //Router.go('previewKwestia');
                    $("#previewKwestiaModal").modal("show");
                    Session.set("draftId", ret);
                    console.log(ret)
                }
            });

        }
        else
        {
            if(newKwestiaDraft[0].kwestiaNazwa === '')
                document.getElementById('kwestiaNazwaGroup').classList.add('has-error');
            else
                document.getElementById('kwestiaNazwaGroup').classList.remove('has-error');

            if(newKwestiaDraft[0].temat_id === '0')
                document.getElementById('tematyGroup').classList.add('has-error');
            else
                document.getElementById('tematyGroup').classList.remove('has-error');

            if(newKwestiaDraft[0].rodzaj_id === '0')
                document.getElementById('rodzajeGroup').classList.add('has-error');
            else
                document.getElementById('rodzajeGroup').classList.remove('has-error');

            if(newKwestiaDraft[0].dataDyskusji === '')
                document.getElementById('dataDyskusjiGroup').classList.add('has-error');
            else
                document.getElementById('dataDyskusjiGroup').classList.remove('has-error');

            if(newKwestiaDraft[0].dataGlosowania === '')
                document.getElementById('dataGlosowaniaGroup').classList.add('has-error');
            else
                document.getElementById('dataGlosowaniaGroup').classList.remove('has-error');

            if(newKwestiaDraft[0].krotkaTresc === '')
                document.getElementById('krotkaTrescGroup').classList.add('has-error');
            else
                document.getElementById('krotkaTrescGroup').classList.remove('has-error');

            if(newKwestiaDraft[0].szczegolowaTresc === '')
                document.getElementById('szczegolowaTrescGroup').classList.add('has-error');
            else
                document.getElementById('szczegolowaTrescGroup').classList.remove('has-error');
        }
    },
    'reset form': function(){
        Router.go('listKwestia');
    }
});

Template.addKwestiaForm.deleted = function(){
    Session.set("rodzaj", null)
};
