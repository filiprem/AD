Template.proceduraWstrzymania.helpers({
    'getKwestiaNazwa':function(id){
        return !!Kwestia.findOne({_id:id}) ? Kwestia.findOne({_id:id}).kwestiaNazwa : null;
    },
    'isEmpty':function(item){
        return !!item && item!="" ? false : true;
    },
    'isOwner':function(item){
        return Meteor.userId()==item ? true : false;
    }
});

Template.proceduraWstrzymania.events({
    'reset form':function(e){
        e.preventDefault();

        var id = $(e.target).find('[name=kwestiaSuspensionId]').val();

        Meteor.call('removeKwestiaSuspension', id, function (error,ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            }else{
                Router.go('informacjeKwestia',{_id:ret});
            }
        });
    },
    'submit #proceduraWstrzymaniaForm':function(e){
        e.preventDefault();

        var id = $(e.target).find('[name=kwestiaSuspensionId]').val();
        var idKwestia = $(e.target).find('[name=kwestiaId]').val();
        var userId = $(e.target).find('[name=userId]').val();
        var uzasadnienie = $(e.target).find('[name=uzasadnienie]').val();
        var czyAktywny = $(e.target).find('[name=czyAktywny]').val();
        var dataDodania = $(e.target).find('[name=dataDodania]').val();

        var item = [{
                _id: id,
                idKwestia: idKwestia,
                userId: userId,
                uzasadnienie: uzasadnienie,
                dataDodania: dataDodania,
                czyAktywny: czyAktywny
            }];
        console.log(item[0]);
        if (isNotEmpty(item[0]._id,'') && isNotEmpty(item[0].idKwestia,'') && isNotEmpty(item[0].userId,'') &&
            isNotEmpty(item[0].uzasadnienie,'uzasadnienie') && (isNotEmpty(item[0].dataDodania.toString(),''))) {

            Meteor.call('updateKwestiaSuspended', item, function (error,ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else
                        throwError(error.reason);
                }
            });
        }
    }
});