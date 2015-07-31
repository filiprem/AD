Template.previewKwestia.helpers({
    draftKwestii: function(){
        var id = Session.get("draftId");
        var dr = KwestiaDraft.findOne({_id: id});
        return dr;
    },
    tematToList: function(){
        return Temat.find({}).fetch();
    } ,
    rodzajToList: function(){
        return Rodzaj.find({}).fetch();
    }
});

Template.previewKwestia.events({
    'submit form': function(e){
        e.preventDefault();

        //var dataG =  new Date();
        //var d = dataG.setDate(dataG.getDate()+7);
        //
        //var newKwestiaDraft = [
        //    {
        //        userId: Meteor.userId(),
        //        dataWprowadzenia: new Date(),
        //        kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
        //        priorytet: 0,
        //        sredniaPriorytet: 0,
        //        temat_id: $(e.target).find('[name=tematy]').val(),
        //        rodzaj_id: $(e.target).find('[name=rodzaje]').val(),
        //        dataDyskusji: new Date(),
        //        dataGlosowania: d,
        //        //historia: $(e.target).find('[name=historia]').val(),
        //        krotkaTresc: $(e.target).find('[name=krotkaTresc]').val(),
        //        szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val()
        //    }];
        //Meteor.call('addKwestia', newKwestiaDraft, function (error, ret) {
        //    if (error) {
        //        if (typeof Errors === "undefined")
        //            Log.error('Error: ' + error.reason);
        //        else {
        //            throwError(error.reason);
        //        }
        //    }
        //    else {
        //        Router.go('listKwestia');
        //        $("#previewKwestiaModal").modal("hide");
        //        //Session.set("draftId", ret);
        //        //console.log(ret)
        //    }
        //});
    }
});

Template.previewKwestia.deleted = function(){
    Session.set("draftId", null);
    Session.set("rodzaj", null)
};