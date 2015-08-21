var users = [
    //====ADMIN====
    {
        "_id": "rehjMkaqeqQrQvArJ",
        "createdAt": "2015-08-13T06:56:09.247Z",
        "services": {
            "password": {
                "bcrypt": "$2a$10$FMPQ8lV5homFwjTugM9pSeajge9diASndyBIj2j/.wRm0S5NfGJ9q"
            },
            "resume": {
                "loginTokens": [
                    {
                        "when": "2015-08-20T08:28:33.089Z",
                        "hashedToken": "xBeP1QmZwhTaJjEIdOrNj5rqY+D3YV8dPVOjIPj1ajo="
                    }
                ]
            }
        },
        "username": "adminSDD",
        "emails": [
            {
                "address": "sdd.meteor@gmail.com",
                "verified": false
            }
        ],
        "profile": {
            "firstName": "Admin",
            "lastName": "SDD",
            "fullName": "Administrator",
            "profession": "Administrator",
            "address": "",
            "zip": "",
            "gender": "mê¿czyzna",
            "phone": "",
            "web": "sdd.meteor.com",
            "role": "admin",
            "language": "pl"
        },
        "roles": [
            "admin"
        ]
    }
]

_.each(users, function (i) {
    if (!!!Users.findOne({_id: i._id})) {
        Users.insert(i);
        console.log("dodano uzytkownika");
        console.log(i)
        console.log(Users.find({}).fetch())
    }
    else {
    }
});