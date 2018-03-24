var db = require("../../models");

function get(req, res) {
  let id = req.params.id;

  // res.json(id);

  var query = { _id:id };

  db.Headline.find(query)
    .populate('notes')
    .then(function(dbNotes) {
      //send back the notes for the article with the matching id
      res.json(dbNotes[0].notes);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
  });
};

function post(req, res) {

  let {_id, noteText} = req.body;

  db.Note.create({body: noteText})
    .then(function(dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Headline.findOneAndUpdate({_id:_id}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbHeadline) {
      // If the User was updated successfully, send it back to the client
      res.json(dbHeadline);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
};

function deletepost(req, res) {
  let {noteToDelete} = req.body;
  db.Note.remove({_id:noteToDelete})
  .then(function(dbNote) {
    res.json(dbNote);
  })
  .catch(function(err) {
    res.json(err);
  });
}

module.exports = {get, post, deletepost}