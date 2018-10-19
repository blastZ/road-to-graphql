export default {
  posts(parent, args, { db }, info) {
    return db.posts.filter(post => post.author === parent.id);
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(o => o.author === parent.id);
  }
};