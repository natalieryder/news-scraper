
$(document).ready(function() {
	
	var articleContainer = $(".article-container");


  	function renderArticles(articles) {
	    // This function handles appending HTML containing our article data to the page
	    // We are passed an array of JSON containing all available articles in our database
	    var articlePanels = [];
	    // We pass each article JSON object to the createPanel function which returns a bootstrap
	    // panel with our article data inside
	    for (let i = 0; i < articles.length; i++) {
	    // for (var i = articles.length - 1; i >= 0; i--) {
	      articlePanels.push(createPanel(articles[i]));
	    }
	    // Once we have all of the HTML for the articles stored in our articlePanels array,
	    // append them to the articlePanels container
	    articleContainer.append(articlePanels);
  	}

  	//use this instead of handlebars in order to update the data without refreshing the page

  	function createPanel(article) {
	    // This functiont takes in a single JSON object for an article/headline
	    // It constructs a jQuery element containing all of the formatted HTML for the
	    // article panel

	    var panel = $(
	      [
	        `<div class='card panel-default mb-3'>
	        <div class='card-header'>
	        <h3>
	        <a class='article-link d-block' target='_blank' href='${article.link}'>
	        ${article.headline}
	        </a>
	        <a class='btn btn-warning unsave'>
	        UnSave Article
	        </a>
	        <a class='btn btn-primary add-note text-white'>
	        Add Note
	        </a>
	        </h3>
	        </div>
	        <div class='card-body'>
	        ${article.teaser}
	        </div>
	        </div>`
	      ].join("")
	    );
	    // We attach the article's id to the jQuery element
	    // We will use this when trying to figure out which article the user wants to save
	    panel.data("_id", article._id);
	    // We return the constructed panel jQuery element
	    return panel;
	  }

  	function handleArticleScrape() {
  		console.log("scrape");
    	// This function handles the user clicking any "scrape new article" buttons
    	$.get("/scrape")
		.then(function(data) {
			initPage();
			alert(data);
		})
		.catch(function(err) {
			console.log(err);
		});
    };


  });
