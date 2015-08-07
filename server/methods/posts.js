Meteor.methods({
    addPost: function (newPost) {
        var id = Posts.insert({
            idKwestia: newPost[0].idKwestia,
            wiadomosc: newPost[0].wiadomosc,
            idUser: newPost[0].idUser,
            userFullName: newPost[0].userFullName,
            addDate: newPost[0].addDate,
            isParent: newPost[0].isParent,
            idParent: newPost[0].idParent,
            czyAktywny: newPost[0].czyAktywny,
            wartoscPriorytetu:  newPost[0].wartoscPriorytetu,
            glosujacy:  newPost[0].glosujacy
        });
        return id;
    },
    addPostAnswer: function (newPost) {
        var id = Posts.insert({
            idKwestia: newPost[0].idKwestia,
            wiadomosc: newPost[0].wiadomosc,
            idUser: newPost[0].idUser,
            userFullName: newPost[0].userFullName,
            addDate: newPost[0].addDate,
            isParent: newPost[0].isParent,
            idParent: newPost[0].idParent,
            czyAktywny: newPost[0].czyAktywny,
            wartoscPriorytetu:  newPost[0].wartoscPriorytetu,
            glosujacy:  newPost[0].glosujacy
        });
        return id;
    },
    updatePostRating: function (id,obj) {
        console.log("ID: "+id);
        console.log("wartosc: "+obj[0].wartoscPriorytetu);
        console.log("glos: "+obj[0].glosujacy.length);
        var id = Posts.update(id,{$set:{wartoscPriorytetu:  obj[0].wartoscPriorytetu, glosujacy:  obj[0].glosujacy}});
        return id;
    }
});