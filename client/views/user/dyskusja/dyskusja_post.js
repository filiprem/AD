Template.discussionPostItem.created = function () {
    this.colTextRV = new ReactiveVar();
    var tab = [];
    this.colTextRV.set(tab);
};

Template.discussionPostItem.rendered = function () {
    $("#dyskusjaAnswerForm").validate({
        messages: {
            answer_message: {
                required: fieldEmptyMessage(),
            }
        },
        highlight: function (element) {
            highlightFunction(element);
        },
        unhighlight: function (element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            validationPlacementError(error, element);
        }
    })
};

Template.discussionPostItem.helpers({
    'getSimpleDate': function (date) {
        return moment(date).format("YYYY-MM-DD");
    },
    'getFullHourDate': function (date) {
        return moment(date).format("HH:mm:ss");
    },
    'getAnswers': function (id) {
        return Posts.find({idParent: id, isParent: false, czyAktywny: true}, {sort: {wartoscPriorytetu: -1}});
    },
    'getAnswersCount': function (id) {
        return Posts.find({idParent: id, isParent: false, czyAktywny: true}).count();
    },
    'getLabelClass': function (value) {
        return value >= 0 ? "label-success" : "label-danger";
    },
    'getText': function (value, id) {
        var self = Template.instance();

        if (value.length < DISCUSSION_OPTIONS.POST_CHARACTERS_DISPLAY)
            return value;
        else
            return isInTab(id, self.colTextRV.get()) ? value : value.substring(0, DISCUSSION_OPTIONS.POST_CHARACTERS_DISPLAY) + "...";
    },
    'isInTab': function (id) {
        var self = Template.instance();
        return isInTab(id, self.colTextRV.get());
    },
    'textTooLong': function (value) {
        return value.length < DISCUSSION_OPTIONS.POST_CHARACTERS_DISPLAY ? false : true;
    },
    'isDoArchiwum': function () {
        var p = Posts.findOne({_id: this.idPost});
        if (p) {
            if (p.postType == "archiwum") return true;
            else return false;
        }
    },
    'isDoKosza': function () {
        var p = Posts.findOne({_id: this.idPost});
        if (p) {
            if (p.postType == "kosz") return true;
            else return false;
        }
    },
    'isDoWK': function () {
        var p = Posts.findOne({_id: this.idPost});
        if (p) {
            if (p.postType == "deliberacja") return true;
            else return false;
        }
    }
});

Template.discussionPostItem.events({
    'click #rozwinText': function (e) {
        var id = e.target.name;
        var self = Template.instance();
        var itemTab = self.colTextRV.get();
        var flag = false;
        if (!isInTab(id, itemTab)) {
            itemTab.push(id);
            self.colTextRV.set(itemTab);
        }
    },
    'click #zwinText': function (e) {
        var self = Template.instance();
        var itemTab = self.colTextRV.get();
        var id = e.target.name;
        itemTab.forEach(function (item) {
            if (id == item)
                itemTab.splice(itemTab.indexOf(item), 1);
        });
        self.colTextRV.set(itemTab);
    }
});

Template.discussionAnswerForm.events({
    'submit #dyskusjaAnswerForm': function (e) {
        e.preventDefault();

        var wiadomosc = $(e.target).find('[id=answer_message]').val();
        var idKwestia = $(e.target).find('[name=idKwestiaAnswer]').val();
        var idParent = $(e.target).find('[name=idPost]').val();
        var idUser = Meteor.userId();
        var addDate = new Date();
        var isParent = false;
        var czyAktywny = true;
        var userFullName = Meteor.user().profile.fullName;
        var ratingValue = 0;
        var glosujacy = [];

        var post = [{
            idKwestia: idKwestia,
            wiadomosc: wiadomosc,
            idUser: idUser,
            userFullName: userFullName,
            addDate: addDate,
            isParent: isParent,
            idParent: idParent,
            czyAktywny: czyAktywny,
            wartoscPriorytetu: ratingValue,
            glosujacy: glosujacy
        }];

        Meteor.call('addPostAnswer', post, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            } else {
                document.getElementsByName("answer_message" + idParent)[0].value = "";

                var newValue = 0;
                var pktAddKwestia = Parametr.findOne({});
                newValue = Number(pktAddKwestia.pktDodanieOdniesienia) + getUserRadkingValue(Meteor.userId());
                Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                    if (error) {
                        if (typeof Errors === "undefined")
                            Log.error('Error: ' + error.reason);
                        else {
                            throwError(error.reason);
                        }
                    }
                });
            }
        });
    }
});

Template.discussionAnswerItem.created = function () {
    this.colTextAnswerRV = new ReactiveVar();
    var tab = [];
    this.colTextAnswerRV.set(tab);
};

Template.discussionAnswerItem.helpers({
    'getSimpleDate': function (date) {
        return moment(date).format("YYYY-MM-DD");
    },
    'getFullHourDate': function (date) {
        return moment(date).format("HH:mm:ss");
    },
    'getLabelClass': function (value) {
        return value >= 0 ? "label-success" : "label-danger";
    },
    'getAnswerText': function (value, id) {
        var self = Template.instance();
        if (value.length < DISCUSSION_OPTIONS.POST_CHARACTERS_DISPLAY)
            return value;
        else
            return isInTab(id, self.colTextAnswerRV.get()) ? value : value.substring(0, DISCUSSION_OPTIONS.POST_ANSWER_CHARACTERS_DISPLAY) + "...";
    },
    'isAnswerInTab': function (id) {
        var self = Template.instance();
        return isInTab(id, self.colTextAnswerRV.get());
    },
    'textAnswerTooLong': function (value) {
        return value.length < DISCUSSION_OPTIONS.POST_CHARACTERS_DISPLAY ? false : true;
    }
});

Template.discussionAnswerItem.events({
    'click #rozwinTextAnswer': function (e) {
        var id = e.target.name;
        var self = Template.instance();
        var itemTab = self.colTextAnswerRV.get();
        if (!isInTab(id, itemTab)) {
            itemTab.push(id);
            self.colTextAnswerRV.set(itemTab);
        }
    },
    'click #zwinTextAnswer': function (e) {
        var self = Template.instance();
        var itemTab = self.colTextAnswerRV.get();
        var id = e.target.name;
        itemTab.forEach(function (item) {
            if (id == item)
                itemTab.splice(itemTab.indexOf(item), 1);
        });
        self.colTextAnswerRV.set(itemTab);
    }
});

Template.discussionAnswerForm.helpers({
    isUserLogged: function () {
        return Meteor.userId() ? "" : "disabled";
    }
});