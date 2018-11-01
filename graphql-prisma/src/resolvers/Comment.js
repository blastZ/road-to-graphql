export default {
  author(parent, args, { db }, info) {
    return db.users.find(o => o.id === parent.author);
  },
  post(parent, args, { db }, info) {
    return db.posts.find(o => o.id === parent.post);
  }
};
