Template.kwestiaOczekujaca.created = function(){
    this.choosedTopicRV = new ReactiveVar();
}

Template.kwestiaOczekujaca.rendered = function(){
    $("#setTopicForm").validate({
        messages:{
            tematSelect:{
                required:fieldEmptyMesssage()
            },
            rodzajSelect:{
                required:fieldEmptyMesssage()
            }
        },
        highlight: function(element) {
            var id_attr = "#" + $( element ).attr("id") + "1";
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            $(id_attr).removeClass('glyphicon-ok').addClass('glyphicon-remove');
        },
        unhighlight: function(element) {
            var id_attr = "#" + $( element ).attr("id") + "1";
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            $(id_attr).removeClass('glyphicon-remove').addClass('glyphicon-ok');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.length) {
                error.insertAfter(element);
            } else {
                error.insertAfter(element);
            }
        }
    })
}

Template.kwestiaOczekujaca.helpers({
   'getTematy':function(){
       return Temat.find({},{sort:{nazwaTemat:1}});
   },
    'getRodzaje':function(){
        var self = Template.instance();
        var idTopic = self.choosedTopicRV.get();
        return !!idTopic ? Rodzaj.find({idTemat:idTopic},{sort:{nazwaRodzaj:1}}) : null;
    }
});

Template.kwestiaOczekujaca.events({
    'change #tematSelect':function(e){
        var self = Template.instance();
        self.choosedTopicRV.set(e.target.value);
    },
    'submit form':function(e){
        e.preventDefault();

        var rodzaj = $(e.target).find('[id=rodzajSelect]').val();
        var temat = $(e.target).find('[id=tematSelect]').val();
        var idKwestia = $(e.target).find('[id=idKwestia]').val();
        var status = KWESTIA_STATUS.DELIBEROWANA;

        var kwestiaUpdate = {
            idTemat:temat,
            idRodzaj:rodzaj,
            status:status
        };

        Meteor.call('updateKwestiaNoUpsert', idKwestia,kwestiaUpdate, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);

            } else {
                Router.go('listaKwestiiOczekujacych');
                var userKwestia= $(e.target).find('[id=idUser]').val();
                var newValue=0;
                var pktAddKwestia=Parametr.findOne({});
                console.log(Number(pktAddKwestia.pktDodanieKwestii));
                console.log(getUserRadkingValue(userKwestia));
                newValue=Number(pktAddKwestia.pktDodanieKwestii)+getUserRadkingValue(userKwestia);

                //newValue = {
                //    profile:{
                //        rADking:Number(pktAddKwestia.pktDodanieKwestii)+getUserRadkingValue(Meteor.userId())
                //    }
                //};
                console.log(newValue);
                Meteor.call('updateUserRanking', userKwestia,newValue, function (error) {
                    if (error)
                    {
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else
                        {
                            throwError(error.reason);
                        }
                    }
                });
            }
        });
    }
});