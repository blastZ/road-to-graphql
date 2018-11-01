export default {
  comment: {
    subscribe: (parent, args, { db, pubsub }, info) => {
      const { postId } = args;

      const post = db.posts.find(o => o.id === postId && o.published);

      if (!post) {
        return new Error('Post not found');
      }

      return pubsub.asyncIterator(`comment_from_${postId}`);
    }
  },
  post: {
    subscribe: (parent, args, { db, pubsub }, info) => {
      return pubsub.asyncIterator('post');
    }
  }
};
