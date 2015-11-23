Template.fillDataHonorowyModal.events({
    'click #addFields': function (e) {
        e.preventDefault();

        var firstName = $('#firstName').val();
        var lastName=$('#lastName').val();
        var city=$('#city').val();
        console.log("dane:");
        console.log(firstName);
        console.log(lastName);
        console.log(city);
        if(firstName.trim()!='' && lastName.trim()!='' && city.trim()!=''){
            $("#fillDataHonorowy").modal("hide");
            addNewUser(firstName,lastName,city,email,kwestia);
        }
        else{
            GlobalNotification.error({
                title: 'B³¹d',
                content: 'Formularz nie mo¿e zawieraæ pustych pól!',
                duration: 3 // duration the notification should stay in seconds
            });
        }
    },
    'click #anulujButton': function (e) {
        e.preventDefault();
        document.getElementById('uzasadnienieKosz').value = "";
        $("#fillDataHonorowy").modal("hide");
    }
});