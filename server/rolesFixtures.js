var roles = [
    {
        "_id" : "XZNjTtTrHnF4zXsfD",
        "name" : "admin",
        "subRoles" : [
            "manage-my-account",
            "edit-my-profile",
            "manage-all-profiles",
            "see-user-profile-info",
            "manage-all-users",
            "edit-user-profile",
            "manage-roles",
            "manage-subroles",
            "add-role-permission",
            "add-subrole-permission",
            "manage-all-rodzaje",
            "add-rodzaj",
            "edit-rodzaj",
            "manage-all-tematy",
            "add-temat",
            "edit-temat",
            "manage-kwestia-list",
            "can-vote-kwestia",
            "can-vote-post",
            "manage-realizacja",
            "manage-archiwum-list",
            "manage-moje-kwestie",
            "manage-kwestie-oczekujace",
            "kategoryzacja-kwestii-oczekujacej",
            "manage-kwestia-info",
            "can-add-option",
            "can-add-priorytet-kwestia",
            "can-add-priorytet-post",
            "can-add-post-archiwum",
            "can-add-post-kosz",
            "can-clear-priorytety",
            "can-add-post",
            "can-add-answer",
            "manage-all-parametry",
            "add-parametr",
            "edit-parametr",
            "preview-parametr",
            "manage-all-raporty",
            "add-raport",
            "manage-all-languages",
            "add-language",
            "edit-language"
        ]
    }
];

_.each(roles,function(e){
    var r = Meteor.roles.findOne({_id: e._id});
    if(!r){
        var i = Meteor.roles.insert(e);
        console.log(i);
    }
    else{
        console.log(r)
    }
})