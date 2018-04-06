// function ajaxCall(url, callbackFunctionName){
//   var xhr = new XMLHttpRequest();
//     xhr.open("GET", url);
//     xhr.onload = function(){
//       if(xhr.status === 200){
//         callbackFunctionName(JSON.parse(xhr.responseText));
//       }
//       else{
//         console.log("request failed");
//       }
//     };
//     xhr.send();
// }

// function testJson(response){
//   console.log(response);
// }





// var queryUrl = "http://strainapi.evanbusse.com/isBuRUV/strains/search/name/strawberry%20cheesecake";

// ajaxCall(queryUrl, testJson);

// var request = require("request");
// var fs = require("fs");

// var strainsArray = [];

// fs.readFile("rawStrains.txt", "utf8", (error, data) => {
//   if (error) console.log(error);
//   else {
//     strainsArray = data.split(",");

//     request("http://strainapi.evanbusse.com/isBuRUV/strains/search/all", (error, response, body) => {
//       var usefulData = JSON.parse(body);
//       if (error) {
//         console.log("Request response error.");
//       }
//       else {
//         fs.appendFile("strains.txt", "[", function (error) {});
//         for (let i = 0; i < strainsArray.length; i++) {
//           const element = strainsArray[i];
//           const imageTerm = element.split(" ").join("+");
//           const flav = usefulData[`${element}`].flavors;
//           const pos = usefulData[`${element}`].effects.positive;
//           const neg = usefulData[`${element}`].effects.negative;
//           const med = usefulData[`${element}`].effects.medical;
//           const flavors = flav.toString().split(",").join(", ");
//           const posEffects = pos.toString().split(",").join(", ");
//           const negEffects = neg.toString().split(",").join(", ");
//           const medUses = med.toString().split(",").join(", ");
//           fs.appendFile("strains.txt", [
//             `Name: ${element}`,
//             `\nid: ${usefulData[`${element}`].id}`,
//             `\nallbud.com url: https://www.allbud.com/marijuana-strains/search?q=${imageTerm}`,
//             `\nRace: ${usefulData[`${element}`].race}`,
//             `\nFlavors: ${flavors}`,
//             `\nPositive effects: ${posEffects}`,
//             `\nNegative effects: ${negEffects}`,
//             `\nMedical uses: ${medUses}`,
//             `\n----------------------------------\n`
//           ], function (error) {
//             console.log("There was a file append error.");
//           });
//         }
//       }
//     });
//   }
// });

var currentPage = 1;

function getRandomParams() {
  var randomNum = Math.floor(Math.random() * Math.floor(2));  
  if (randomNum === 0) {
    return strainsArrayOne[Math.floor(Math.random() * Math.floor(strainsArrayOne.length))];
    console.log(randomTerm);
  }
  else if (randomNum === 1) {
    return strainsArrayTwo[Math.floor(Math.random() * Math.floor(strainsArrayTwo.length))];
    console.log(randomTerm);
  }
}

function reportSearch(search, page) {
  $.ajax({
    method: "GET",
    url: `https://obscure-gorge-69381.herokuapp.com/https://www.cannabisreports.com/api/v1.0/strains/search/:${search}?page=${page}`
  }).then(function (response) {
    console.log(response);
    var info = response.data;
    if (info.length === 0) {
      var randomTerm = getRandomParams();
      reportSearch(randomTerm, currentPage);
    }
    else {
      for (let i = 0; i < info.length; i++) {
        const element = info[i];
        let reportDiv = $("<div>");
        let name = $(`<h3>${element.name}</h3>`);
        let noImage = $("<p>( no image available )</p>");
        let imageLink = $(`<a href=${element.image}>See Image</a><br>`);
        let genetics = $(`<h4>Genetics: ${element.genetics.names}</h4>`);
        let noGen = $("<h4>Genetics: Unknown</h4>");
        let seedCo = $(`<h4>Seed Company: ${element.seedCompany.name}</h4>`);
        let infoLink = $(`<a href=${element.url}>more info</a>`);
        reportDiv.addClass("report-response");
        imageLink.addClass("info report-img");
        noImage.addClass("info no-img");
        genetics.addClass("info report-data");
        noGen.addClass("info report-data");
        seedCo.addClass("info report-data");
        infoLink.attr("target", "_blank");
        name.addClass("report-name");
        infoLink.addClass("info report-link");
        reportDiv.append(name);

        if (element.image.includes("no_image")) reportDiv.append(noImage);
        else reportDiv.append(imageLink);

        if (element.genetics.names === false) reportDiv.append(noGen);
        else reportDiv.append(genetics);

        reportDiv.append(seedCo);
        reportDiv.append(infoLink);
        $("#search-results").append(reportDiv);
      }
      if (response.meta.pagination.total_pages > currentPage) {
        currentPage++;
        var moreBtn = $("<button>Load More Results</button>");
        moreBtn.attr("id", "more-results");
        moreBtn.attr("page", currentPage);
        moreBtn.attr("search", search);
        $("#search-results").append(moreBtn);
      }
    }
  });
}

$("#search-results").on("click", "#more-results", function () {
  console.log("Hi");
  var newSearch = $(this).attr("search");
  var newPage = $(this).attr("page");
  console.log(newPage);
  reportSearch(newSearch, newPage);
  $(this).remove();
});

$("#reports-btn").on("click", function (event) {
  event.preventDefault();
  $("#search-results").html("");
  currentPage = 1;
  var searchTerm = $("#reports-search").val().trim();
  console.log(searchTerm);
  reportSearch(searchTerm, currentPage);
});

$("#reports-random").on("click", function (event) {
  event.preventDefault();
  $("#search-results").html("");
  currentPage = 1;
  var randomTerm = getRandomParams();
  reportSearch(randomTerm, currentPage);
});


function strainSearch(search) {
  $.ajax({
    method: "GET",
    url: `http://strainapi.evanbusse.com/isBuRUV/strains/search/name/${search}`
  }).then(function (result) {
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      let strainDiv = $("<div>");
      let name = $(`<h3>${element.name}</h3>`);
      let race = $(`<h4>Species: ${element.race}</h4>`);
      let desc = $(`<p>${element.desc}</p>`);
      let noDesc = $("<p>No description available.</p>");
      strainDiv.addClass("strain-response");
      name.addClass("strain-name");
      race.addClass("info strain-race");
      desc.addClass("info strain-desc");
      strainDiv.append(name);
      strainDiv.append(race);
      if (element.desc === null) strainDiv.append(noDesc);
      else strainDiv.append(desc);
      $("#search-results").append(strainDiv);
    }
  });
}

$("#strains-btn").on("click", function (event) {
  event.preventDefault();
  $("#search-results").html("");
  var searchTerm = $("#strains-search").val().trim();
  console.log(searchTerm);
  if (strainsArrayOne.toString().toLowerCase().includes(searchTerm) || strainsArrayTwo.toString().toLowerCase().includes(searchTerm)) {
    strainSearch(searchTerm);
  } else {
    $("#search-results").html("<p class='no-strain'>We have no listing of a strain by that name. Please try again.</p>");
  }
});

$("#strains-random").on("click", function (event) {
  event.preventDefault();
  $("#search-results").html("");
  var randomNum = Math.floor(Math.random() * Math.floor(2));
  var randomTerm = "";
  if (randomNum === 0) {
    randomTerm = strainsArrayOne[Math.floor(Math.random() * Math.floor(strainsArrayOne.length))];
    console.log(randomTerm);
  }
  else if (randomNum === 1) {
    randomTerm = strainsArrayTwo[Math.floor(Math.random() * Math.floor(strainsArrayTwo.length))];
    console.log(randomTerm);
  }
  strainSearch(randomTerm);
});

$('#search-results').magnificPopup({
  delegate: '.report-img',
  type: 'image'
});