Template.editRodzajForm.rendered = function(){
    $("#rodzajForm").validate({
        rules: {
            czasDyskusji:{
                min: 1,
            },
            czasGlosowania:{
                min: 0.01,
                number:true
            }
        },
        messages:{
            nazwaRodzaj:{
                required:fieldEmptyMesssage(),
            },
            tematy:{
                required:fieldEmptyMesssage()
            },
            czasDyskusji:{
                min:positiveNumberMesssage()
            },
            czasGlosowania:{
                min:positiveNumberMesssage(),
                number:decimalNumberMesssage()
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
};

Template.editRodzajForm.helpers({
    rodzajToEdit: function(){
        return Session.get("rodzajInScope");
    },
    tematToList: function(){
        return Temat.find({});
    },
    isSelected: function(id) {
        var r = Session.get("rodzajInScope");
        var item = Temat.findOne({_id: r.idTemat});
        if(item._id==id)
            return true;
        else
            return false;
    }
});

Template.editRodzajForm.events({
    'submit form': function(e){
        e.preventDefault();
        var r = Session.get("rodzajInScope");

        var czasD=$(e.target).find('[name=czasDyskusji]').val();
        if(czasD == '' || czasD == '0')
            czasD=7;
        var czasG=$(e.target).find('[name=czasGlosowania]').val().replace(/\s+/g,'');
        if(czasG == '' || czasG == '0')
            czasG=24;
        var pulapP=$(e.target).find('[name=pulapPriorytetu]').val();
        if(_.isEmpty(pulapP))
            pulapP=Users.find().count()*0.1*5;

        var rodzaj = {
            idTemat: $(e.target).find('[name=tematy]').val(),
            nazwaRodzaj: $(e.target).find('[name=nazwaRodzaj]').val(),
            czasDyskusji: czasD,
            czasGlosowania:czasG,
            pulapPriorytetu: pulapP
        };
            Meteor.call('updateRodzaj', r._id, rodzaj, function (error) {
                if (error) {
                    // optionally use a meteor errors package
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
                else {
                    Kwestia.find({idRodzaj: r._id}).forEach(function (doc) {
                        var id = Kwestia.update({_id: doc._id}, {$set: {pulapPriorytetu: Rodzaj.findOne({_id: r._id}).pulapPriorytetu}});
                        if (!id){
                        }
                    });
                    Router.go('listRodzaj');
                }
            });
    },
    'reset form': function(){
        Router.go('listRodzaj');
    }
});