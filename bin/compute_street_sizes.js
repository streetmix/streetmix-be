// This is a Mongo DB script

var mapper = function() { emit (this._id, { 'creator_id': this.creator_id, 'namespaced_id': this.namespaced_id, 'undo_stack_length': s.data.undoStack.length, 'size_in_bytes': Object.bsonsize(this) }) }
var reducer = function(key, values) { return { _id: key, size: values } }

var results = db.streets.mapReduce(mapper, reducer, { out: { 'inline': 1 } }).results

results.forEach(function(result) {
  print(s._id, result)
})
