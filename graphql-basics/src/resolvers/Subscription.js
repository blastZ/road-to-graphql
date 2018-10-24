export default {
  count: {
    subscribe: (parent, args, { pubsub }, info) => {
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish('count', {
          count
        });
      }, 2000);

      return pubsub.asyncIterator('count');
    }
  },
  comment: {
    subscribe: (parent, args, { db, pubsub }, info) => {
      const { postId } = args;

      const post = db.posts.find(o => o.id === postId && o.published);

      if (!post) {
        return new Error('Post not found');
      }

      return pubsub.asyncIterator(`COMMENT_FROM_POST_${postId}`);
    }
  },
  post: {
    subscribe: (parent, args, { db, pubsub }, info) => {
      return pubsub.asyncIterator('POST_FROM_NEW_PUBLISHED');
    }
  }
};
