
Template.kwestiaOczekujaca.helpers({
   'getTematy':function(){
       return Temat.find({});
   },
    'getRodzaje':function(){
        return Rodzaj.find({});
    }
});