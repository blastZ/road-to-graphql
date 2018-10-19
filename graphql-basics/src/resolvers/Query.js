export default {
  posts(parent, args, { db }, info) {
    const { query = null } = args;
    if (!query) {
      return db.posts;
    } else {
      return db.posts.filter(post => {
        return post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase());
      });
    }
  },
  users(parent, args, { db }, info) {
    const { query = null } = args;
    if (!query) {
      return db.users;
    } else {
      return db.users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    }
  },
  comments(parent, args, { db }, info) {
    const { query = null } = args;
    if (!query) {
      return db.comments;
    } else {
      return db.comments.filter(comment => comment.text.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    }
  }
};
