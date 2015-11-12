Template.administracjaUserMain.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'dataWprowadzenia',
                    label: Template.listKwestiaAdminColumnLabel,
                    labelData: {//title: "Data wprowadzenia Kwestii i rozpoczęcia jej deliberacji",
                     text: "Data"},
                    tmpl: Template.dataUtwKwestia,
                    sortDirection: "descending"
                },
                {
                    key: 'kwestiaNazwa',
                    label: Template.listKwestiaColumnLabel,
                    labelData: {
                        //title: "Kliknij, aby zobaczyć szczegóły",
                        text: "Nazwa Kwestii"
                    },
                    tmpl: Template.nazwaKwestiLink
                },
                {
                    key: 'options',
                    label: "Opcje",
                    tmpl: Template.lobbujZaKwestia
                }
                //{key: 'status', label: "Status", tmpl: Template.statusKwestii},
                //{key: 'options', label: "Opcje", tmpl: Template.editTypeAndTopic }
            ]
        };
    },
    listOfIssues: function () {
        var kwestie = Kwestia.find({
            $where: function () {
                    return ((this.czyAktywny == true) && ((this.status==KWESTIA_STATUS.ADMINISTROWANA)
                    || (this.idUser==Meteor.userId()))
                    || this.typ==KWESTIA_TYPE.ACCESS_DORADCA
                    || this.typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY
                    || this.idZglaszajacego==Meteor.userId());//dla kwesti statusowych
            }
        });
        if(kwestie) return kwestie;
        return null;
    },
    listOfIssuesCount: function () {
        var ile = Kwestia.find({czyAktywny: true}).count();
        return ile > 0 ? true : false;
    }
});

Template.lobbujZaKwestia.helpers({
    IAmOwnerKwestiaGlosowanaOrDEliberowana:function(){
        return (this.idUser==Meteor.userId() || this.idZglaszajacego==Meteor.userId()) &&
        (this.status==KWESTIA_STATUS.GLOSOWANA ||
        this.status==KWESTIA_STATUS.DELIBEROWANA ||
        this.status==KWESTIA_STATUS.OSOBOWA ||
        this.status==KWESTIA_STATUS.ADMINISTROWANA ||
        this.status==KWESTIA_STATUS.STATUSOWA) ? true: false;
    }
});

Template.lobbujZaKwestia.events({
   'click #lobbujZaKwestia':function(e){
       e.preventDefault();
       var idKwestia=this._id;
       bootbox.dialog({
           message:
           '<p><b>'+'Treść email:'+'</b></p>'+
           '<div class="row">  ' +
           '<div class="col-md-12"> ' +
           '<form class="form-horizontal"> ' +
           '<div class="form-group"> ' +
           '<div class="col-md-12"> ' +
           '<textarea id="emailText" name="emailText" type="text" placeholder="Zachęć użytkowników do akcjii w Twojej kwestii" class="form-control" rows=5></textarea> '+
           '</form> </div>  </div>',
           title: "Wiadomość do członków",
           closeButton:false,
           buttons: {
               success: {
                   label: "Wyślij",
                   className: "btn-success",
                   callback: function() {
                        sendEmailAndNotification(idKwestia,$('#emailText').val());
                   }
               },
               danger: {
                   label: "Anuluj",
                   className: "btn-danger",
                   callback: function() {

                   }
               }
           }
       });
   }
});
sendEmailAndNotification=function(idKwestia,emailText){
    console.log("jest");
    console.log(idKwestia);
    console.log(emailText);
    if(emailText==null || emailText.trim()==''){
        GlobalNotification.error({
            title: 'Przepraszamy',
            content: "Pole treści email nie może być puste!",
            duration: 3 // duration the notification should stay in seconds
        });
        return false;
    }
    else{
        Meteor.call("sendEmailLobbingIssue",idKwestia,emailText,Meteor.userId(),function(error){
            if(!error){
                bootbox.alert("Dziękujemy, Twój email z prośbą został wysłany!", function() {
                });
            }
        });
    }
}