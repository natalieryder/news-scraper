var db = require("../../models");


module.exports = function (req, res) {

	saved = req.query.saved;

	db.Headline.find({"saved":saved})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.send(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    
};

