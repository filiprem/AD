Template.proceduraPrzywracania.events({
    'click .btn-danger': function(e) {
        e.preventDefault();
        var currentKwestiaId = this._id;
        var postProperties =
        {
            czyAktywny: true,
            status: 'deliberowana'
        };
        Kwestia.update(currentKwestiaId, {$set: postProperties});
        Router.go('archiwum');
    }});