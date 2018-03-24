
$(document).ready(function() {
	
	var articleContainer = $(".article-container");
	
	function onSavedPage() {
		if (window.location.pathname === "/saved") {
			return true;
		} else {
			return false;
		}
	};

	initPage();

	$(document).on("click", ".scrape", handleArticleScrape);
	$(document).on("click", ".btn.save", handleArticleSave);
	$(document).on("click", ".btn.unsave", handleArticleSave);
	$(document).on("click", ".notes", handleArticleNotes);
	$(document).on("click", ".save-note", handleNoteSave);
	$(document).on("click", ".note-delete", noteDelete);


	function initPage() {
		let saved = onSavedPage()
	    // Empty the article container, run an AJAX request for any unsaved headlines
	    articleContainer.empty();

	    $.get("/api/headlines?saved=" + saved).then(function(data) {
	      // If we have headlines, render them to the page
	      if (data && data.length) {
	        renderArticles(data, saved);
	      }
	      else {
	        // Otherwise render a message explaing we have no articles
	        $('.article-container').html(`
	        	<div class='card mb-3'>
	        		<div class='card-body'>
	        			There's nothing here.
	        			<button id="scrape" class="btn my-3 btn-dark scrape">Get Articles</button>
	        		</div>
	        	</div>
	        	`)
	      }
	    });
  	}

  	function renderArticles(articles, saved) {
	    // This function handles appending HTML containing our article data to the page
	    // We are passed an array of JSON containing all available articles in our database
	    var articlePanels = [];
	    // We pass each article JSON object to the createPanel function which returns a bootstrap
	    // panel with our article data inside
	    for (let i = 0; i < articles.length; i++) {
	   		if (saved) {
	   			articlePanels.push(createPanelSaved(articles[i]));
	   		} else {
	   			articlePanels.push(createPanel(articles[i]));
	   		}
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
	        <a class='btn btn-success save'>
	        Save Article
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
	  function createPanelSaved(article) {
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
	        <a class='btn btn-primary notes text-white'>
	        Notes
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
    	// This function handles the user clicking any "scrape new article" buttons
    	// get the /scrape route from routes/api/index which points to scripts/scrape.js
    	$.get("/scrape")
		.then(function(data) {
			initPage();
			$('.scape-modal-content').html(data);
			$('#scrapeModal').modal();
		})
		.catch(function(err) {
			console.log(err);
		});
    };

    function handleArticleSave() {
	    // This function is triggered when the user wants to save an article
	    // When we rendered the article initially, we attatched a javascript object containing the headline id
	    // to the element using the .data method. Here we retrieve that.
	    let save = true

	    if ($(this).hasClass('unsave')) {
	    	save = false;
	    }
	    
	    var articleToSave = $(this).parents(".card").data();
	    var data = {
	    	id: articleToSave._id,
	    	save: save
	    }

	    // Using a patch method to be semantic since this is an update to an existing record in our collection
	    $.ajax({
	      method: "PUT",
	      url: "/api/headlines",
	      data: data
	    }).then(function(data) {
	      console.log(data);
	      if (data.success) {
	        // Run the initPage function again. This will reload the entire list of articles
	       	initPage();
	      }
	    });
	}

	function handleArticleNotes() {
		$('.notes-modal-body').empty();
	    // This function handles opending the notes modal and displaying our notes
	    // We grab the id of the article to get notes for from the panel element the delete button sits inside
	    var currentArticle = $(this).parents(".card").data();


	    // Grab any notes with this headline/article id
	    $.get("/api/notes/" + currentArticle._id).then(function(data) {
	      // Constructing our initial HTML to add to the notes modal
	      var title = `<h4> Notes for ${currentArticle._id}`;
	      var ul = `<ul class='list-group note-container mb-3'></ul>`;
	      var textarea = `<textarea id="new-note" class="col-12" placeholder='New Note' rows='4'></textarea>`;

	    $('.notes-modal-body').append(title).append(ul).append(textarea);
	    $('#notesModal').modal();

	    var noteData = {
	        _id: currentArticle._id,
	        notes: data || []
      	};

      	$(".btn.save-note").data("article", noteData);

	    //   // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
	      renderNotesList(noteData);
	    });
	}
	function handleNoteSave() {
		console.log("handleNoteSave");
		// console.log($(this).data("article"));
	    // This function handles what happens when a user tries to save a new note for an article
	    // Setting a variable to hold some formatted data about our note,
	    // grabbing the note typed into the input box
	    var noteData;
	    var newNote = $("#new-note").val().trim();
	    // If we actually have data typed into the note input field, format it
	    // and post it to the "/api/notes" route and send the formatted noteData as well
	    if (newNote) {
	      noteData = {
	        _id: $(this).data("article")._id,
	        noteText: newNote
	      };
	      $.post("/api/notes", noteData).then(function(data) {
	        
			 $('#notesModal').modal('hide');
	      });
	    }
	}

	function renderNotesList(data) {
	 	var notesToRender = [];
			var currentNote;
		 	if (!data.notes.length) {
	      // If we have no notes, just display a message explaing this
	      currentNote = ["<li class='list-group-item'>", "No notes for this article yet.", "</li>"].join("");
	      notesToRender.push(currentNote);
	    }
	    else {
	      // If we do have notes, go through each one
	      for (var i = 0; i < data.notes.length; i++) {
	        // Constructs an li element to contain our noteText and a delete button
	        currentNote = $(
	          [
	            "<li class='list-group-item note'>",
	            data.notes[i].body,
	            "<button class='btn btn-outline-danger note-delete'>x</button>",
	            "</li>"
	          ].join("")
	        );
	        // Store the note id on the delete button for easy access when trying to delete
	        currentNote.children("button").data("_id", data.notes[i]._id);
	        // Adding our currentNote to the notesToRender array
	        notesToRender.push(currentNote);
	      }
	    }
	    // Now append the notesToRender to the note-container inside the note modal
	    $(".note-container").append(notesToRender);
	}

	function noteDelete() {

	 	var noteToDelete = $(this).data("_id");
	 	var thisNote = $(this).parent();

	 	$.ajax({
	      url: "/api/notes/",
	      method: "DELETE",
	      data: {noteToDelete}
	    }).then(function(data) {
	    	if (data.ok) {
	     		thisNote.hide();
	     	}
	    });
	}

});
