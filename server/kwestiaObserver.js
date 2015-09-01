/**
 * Created by Bart³omiej Szewczyk on 2015-08-31.
 */

//Badanie zmian kwestii w celu sprawdzenia czy kwestia powinna zmieniæ status z deliberowana na glosowana, archiwalna
//lub z glosowana na realizowana.
Meteor.startup(function(){
    var kwestie = Kwestia.find({czyAktywny: true, status: { $in: [KWESTIA_STATUS.DELIBEROWANA, KWESTIA_STATUS.GLOSOWANA]}});


    kwestie.observeChanges({
        changed: function() {
            //console.log('weszlo');

            kwestie.forEach(function (kwestia) {
                //console.log(kwestia.kwestiaNazwa);
                //if(kwestia.sredniaPriorytet>0) {

                //}
            });
        }
    });
});