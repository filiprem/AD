Template.proceduraPrzywracania.events({
    'click .btn-danger': function(e) {
        e.preventDefault();
        var currentKwestiaId = this._id;
        var postProperties =
        {
            czyAktywny: true,
            status: KWESTIA_STATUS.DELIBEROWANA
        };
        Kwestia.update(currentKwestiaId, {$set: postProperties});
        Router.go('archiwum');
    }});