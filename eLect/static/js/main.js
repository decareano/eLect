var eLect = function() {
    this.election = null;
    this.race = null;
    this.candidate = null;

    this.navBarBehavior();

    this.mainNavBar = $("#nav-bar");
    this.navbarSource = $("#main-nav-bar-template").html();
    this.navbarTemplate = Handlebars.compile(this.navbarSource);

    this.responseList = $("#response-list");
    this.responseSource = $("#response-item-template").html();
    this.responseListTemplate = Handlebars.compile(this.responseSource);
    this.responses = [];

    this.viewTitle = $("#view-title");
    this.viewDescription = $("#view-description");


    // $("#item-title").on("click", "#item-title",
    //     this.onItemClicked.bind(this));

    // this.get_elections();
    this.updateNavBar();
};

eLect.prototype.navBarBehavior = function() {
    this.electionsButton = $("#nav-elections");
    this.electionsButton.click(this.onElectionsButtonClicked.bind(this));
    this.navElection = $("#nav-election");
    // this.electionsButton.click(this.onElectionButtonClicked.bind(this));

    this.racesButton = $("#nav-races");
    this.racesButton.click(this.onRacesButtonClicked.bind(this));
    this.navRace = $("#nav-race");
    // this.racesButton.click(this.onRaceButtonClicked.bind(this));

    this.candidatesButton = $("#nav-candidates");
    this.candidatesButton.click(this.onCandidatesButtonClicked.bind(this));
    this.navCandidate = $("#nav-candidate");
    // this.candidatesButton.click(this.onCandidateButtonClicked.bind(this));

    this.itemTitleLink = $(".item-title");
    this.itemTitleLink.click(this.onItemClicked.bind(this));

    // console.log($("#responses"));
    // $("#responses").on("click", ".item-title",
    //     this.onItemClicked.bind(this));

};

eLect.prototype.updateNavBar = function() {
    election = this.election;
    race = this.race;
    candidate = this.candidate;
    var context = {election:election, race:race, candidate:candidate};
    console.log(context);
    var mainNavBar = $(this.navbarTemplate(context));
    this.mainNavBar.replaceWith(mainNavBar);
    this.mainNavBar = mainNavBar;
    if (!election) {
        this.electionsButton.show();
        this.navElection.hide();
        this.racesButton.hide();
        this.navRace.hide();
        this.candidatesButton.hide();
        this.navCandidate.hide();
    } else if (election) {
        this.electionsButton.show();
        this.navElection.show();
        this.racesButton.show();
        this.navRace.hide();
        this.candidatesButton.hide();
        this.navCandidate.hide();
    } else if (race) {
        this.electionsButton.show();
        this.navElection.show();
        this.racesButton.show();
        this.navRace.show();
        this.candidatesButton.show();
        this.navCandidate.hide();
    } else if (candidate) {
        this.electionsButton.show();
        this.navElection.show();
        this.racesButton.show();
        this.navRace.show();
        this.candidatesButton.show();
        this.navCandidate.show();
    };
    this.navBarBehavior();
};

eLect.prototype.onElectionsButtonClicked = function(event) {
    var category = "election";
    var listURL = "/api/elections";
    this.election = null;
    this.race = null;
    this.candidate = null;
    this.getResponseList(category, listURL);
};

eLect.prototype.onRacesButtonClicked = function(event) {
    var category = "race";
    var listURL = "/api/elections/" + this.election.id + "/races";
    this.race = null;
    this.candidate = null;
    this.getResponseList(category, listURL);
};

eLect.prototype.onCandidatesButtonClicked = function(event) {
    var category = "candidate";
    var listURL = "/api/races/" + this.race.id + "/candidates/";
    this.candidate = null;
    this.getResponseList(category, listURL);
};


eLect.prototype.onItemClicked = function(event) {
    var item = $(event.target);
    category = item.attr("category");
    console.log(item);
    if (category == "election") {
        var objectURL = "/api/elections/" + item.attr("data-id");
        this.getObject(category, objectURL);
        // Update the category for the list objects
        category = "race";
        var listURL = "/api/elections/" + item.attr("data-id") + "/races";
        console.log(category, listURL);
        this.getResponseList(category, listURL);
    } else if (category == "race") {
        var objectURL = "/api/races/" + item.attr("data-id");
        this.getObject(category, objectURL);
        // Update the category for the list objects
        category = "candidate";
        var listURL = "/api/races/" + item.attr("data-id") + "/candidates";
        console.log(category, listURL);
        this.getResponseList(category, listURL);
    } else if (category == "candidate") {
        var objectURL = "/api/candidates" + item.attr("data-id");
        this.getObject(category, objectURL);
        console.log(category, listURL);
    };
};

eLect.prototype.getObject = function(category, objectURL) {
    var ajax = $.ajax(objectURL, {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(this.onGetObjectDone.bind(this, category));
    ajax.fail(this.onFail.bind(this, "Getting parent object information"));
};

eLect.prototype.onGetObjectDone = function(category, data) {
    console.log(category);
    if (category == "election"){
        this.election = data;
        console.log(this.election);
    } else if (category == "race"){
        this.race = data;
        console.log(this.race);
    } else if (category == "candidate"){
        this.candidate = data;
        console.log(this.candidate);
    };
};


eLect.prototype.getResponseList = function(category, listURL) {
    var ajax = $.ajax(listURL, {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(this.onGetResponsesDone.bind(this, category));
    ajax.fail(this.onFail.bind(this, "Getting responses information"));
};


eLect.prototype.onGetResponsesDone = function(category, data) {
    this.responses = data;
    console.log("category: " + category);
    for (i in this.responses) {
        console.log("response # " + i + ":" + this.responses[i]);
        this.responses[i].category = category;
    }
    // var categoryList = {
    //     category: category
    // };
    // console.log(categoryList);
    // this.responses = $(this.responses).map(function(obj) {
    //     $.extend(this.responses, category);
    // });
    // this.responses = $.merge(responses, categoryList);


    console.log(this.responses);
    this.updateViewItems();
    this.updateNavBar();
};

eLect.prototype.updateViewItems = function() {
    var context = {
            responses: this.responses
    };
    var responseList = $(this.responseListTemplate(context));
    this.responseList.replaceWith(responseList);
    this.responseList = responseList;
};

eLect.prototype.onFail = function(what, event) {
    // Called when an AJAX call fails
    console.error(what, "failed: ", event.statusText);
};

$(document).ready(function() {
    window.app = new eLect();
});