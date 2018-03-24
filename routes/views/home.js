var db = require("../../models");

module.exports = function (req, res) {
	//show all articles

	db.Headline.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("home", {Articles: dbArticle} );
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
};

