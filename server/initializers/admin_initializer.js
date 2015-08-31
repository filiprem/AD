//wyłącznie do testów,metoda pobierająca wkestię bedzie miała inne warunki + metoda będzie uruchamiana w innych meijscach
//checkIfKwestiaCanBeVoted=function(){
//    console.log("Jestem tutaj!");
//    console.log(Users.find().count());
//    //var users=Users.find().count();
//    //var kworum=liczenieKworumZwykle(users);
//
//    var kwestie= Kwestia.find({
//        $where:function(){
//            (this.wartoscPriorytetu>0)
//            //&&
//            // (this.kwor)
//            //ZR
//        }
//    });
//    kwestie.forEach(function(kwestia){
//        console.log(kwestia._id);
//        //update status
//        var status=null;
//        if(kwestia.status==KWESTIA_STATUS.DELIBEROWANA)
//            status=KWESTIA_STATUS.GLOSOWANA;
//
//        else if(kwestia.status==KWESTIA_STATUS.STATUSOWA)
//            status=KWESTIA_STATUS.OCZEKUJACA;//na tym etapie kwestie te będą neiwidoczne,dopóki zapraszający nie odpowie
//        //jeżeli odpowie pozytywnie,to kwestia robi się realiziowana
//        //jeżeli negatywnie- to powiadomienie dla tego,ktory zgłosił
//
//        Meteor.call('updateStatusKwestii', kwestia._id, status, function (error) {
//            if (error) {
//                if (typeof Errors === "undefined")
//                    Log.error('Error: ' + error.reason);
//                else
//                    throwError(error.reason);
//            }
//            else{
//                //sprawdzam,czy jest statusowa,jeśli tak,to zaproszenie
//                if(kwestia.status==KWESTIA_STATUS.STATUSOWA){
//                    //wygeneruj zaproszenie
//                    var zglaszajacy=Users.findOne({_id:kwestia.idUser});
//                    var trescPowiadomienia=null;
//                    if(zglaszajacy){
//                        trescPowiadomienia="Użytkownik "+zglaszajacy.profile.fullName+" chce mianować Cię na członka honorowego";
//                    }
//                    var newPowiadomienie=[{
//                        idUser: kwestia.idZgloszonego,
//                        dataWprowadzenia: new Date(),
//                        tytul:"Zaproszenie do zostania członkiem honorowym",
//                        powiadomienieTyp: POWIADOMIENIE_TYPE.ZAPROSZENIE,
//                        tresc:trescPowiadomienia,
//                        idNadawcy: kwestia.idUser
//                    }];
//                    Meteor.call('addPowiadomienie', newPowiadomienie, function (error) {
//                        if (error) {
//                            if (typeof Errors === "undefined")
//                                Log.error('Error: ' + error.reason);
//                            else
//                                throwError(error.reason);
//                        }
//                    });
//                }
//            }
//        });
//    });
//    console.log(kwestie.count());
//};

Meteor.startup(function () {
    //tylko do testów!
    //checkIfKwestiaCanBeVoted();
    var data = [
        {
            "Login": "adminSDD",
            "FirstName": "Admin",
            "LastName": "SDD",
            "Profession": "Administrator",
            "Address": "",
            "Zip": "",
            "Gender": "mężczyzna",
            "Phone": "",
            "Email": "sdd.meteor@gmail.com",
            "Web": "sdd.meteor.com",
            "Role": "admin"
        }];
    if ((Meteor.users.find().count() == 0)) {
        var users = [];
        for (var i = 0; i < data.length; i++) {
            users.push({
                    firstName: data[i].FirstName,
                    lastName: data[i].LastName,
                    fulName: data[i].FirstName + ' ' + data[i].LastName,
                    login: data[i].Login,
                    email: data[i].Email,
                    profession: data[i].Profession,
                    address: data[i].Address,
                    zip: data[i].Zip,
                    gender: data[i].Gender,
                    phone: data[i].Phone,
                    web: data[i].Web,
                    roles: data[i].Role
                }
            );
        }
        _.each(users, function (user) {
            var id;

            id = Accounts.createUser({
                username: user.login,
                email: user.email,
                password: "2015adminSDD!",
                profile: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    profession: user.profession,
                    address: user.address,
                    zip: user.zip,
                    gender: user.gender,
                    phone: user.phone,
                    web: user.web,
                    role: user.roles,
                    rADking: 0
                }
            });

            if (user.roles.length > 0) {
                Roles.addUsersToRoles(id, user.roles);
            }
        });
    }
})