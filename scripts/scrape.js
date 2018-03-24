var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(req, res) {
  // First, we grab the body of the html with request
	axios.get("https://www.t-nation.com/training").then(function(response) {
	    // Then, we load that into cheerio and save it to $ for a shorthand selector
	    var $ = cheerio.load(response.data);
	    var articles = [];

	    // select every articleWrap
	    $(".articleWrap").each(function(i, element) {
	    //   // Save an empty result object
	      var result = {};
	    //   // Add the text and href of every link, and save them as properties of the result object
	      result.headline = $(this)
	        .children(".articleSearchPage")
	        .children("h2")
	        .children("a")
	        .text();
	      result.link = "http://www.t-nation.com" + $(this)
	        .children(".articleSearchPage")
	        .children("h2")
	        .children("a")
	        .attr("href");
	      result.teaser = $(this)
	        .children(".articleSearchPage")
	        .children(".teaser")
	        .text();

	      articles.push(result);
	      
	    });
	    
	    var count = 0;
	    var newArticleFound = false;
	    var newArticles = 0;
	    function addToDB(arrayOfArticles) {
	    //look in the database to check if the headline already exists
	    	db.Headline.find({"headline": arrayOfArticles[count].headline}).limit(1)
	      	.then(function(found){
	      		
	      		// if nothing is found, add the article to the database
	      		if (!found.length) {

		      		db.Headline.create(arrayOfArticles[count])
			    	.then(function(dbArticle) {
			        	// View the added result in the console
			        	console.log(dbArticle);
			          	newArticleFound = true;
			          	newArticles++;
			    	})
			    	.catch(function(err) {
			       		console.log("------------------------------------------------------------------------------");
			       		console.log(err);
			    	});
	      		} else {
	      			//if it is found, do nothing
	      		};
	      		count++;
	            // if count is less than the number of articles
	        	if (count < arrayOfArticles.length) {
	        	// add the next article
	         		addToDB(arrayOfArticles);
	         	} else {
	         		if (newArticleFound) {
				    	res.json(newArticles + " articles added!");
				    } else {
				    	res.json("No Articles Found");
				    }
	         	}
	         })
	      	.catch(function(err) {
	      		console.log(err);
	      	});
		}

		addToDB(articles);
	});
}