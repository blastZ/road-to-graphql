import uuidv4 from 'uuid/v4';

export default {
  createUser(parent, args, { db }, info) {
    const { name, email, age } = args.data;

    const emailTaken = db.users.some(user => user.email === email);

    if (emailTaken) {
      throw new Error('Email Taken');
    } else {
      const user = {
        id: uuidv4(),
        name,
        email,
        age
      };

      db.users.push(user);

      return user;
    }
  },
  deleteUser(parent, args, { db }, info) {
    const { id } = args;

    const index = db.users.findIndex(o => o.id === id);
    if (index < 0) {
      throw new Error('User not find');
    } else {
      const deletedUser = db.users.splice(index, 1);

      // remove posts belong user, and comments belong post
      db.posts = db.posts.filter(post => {
        if (post.author !== id) return post;

        db.comments = db.comments.filter(o => o.post !== post.id);
      });
      // remove comments belong user
      db.comments = db.comments.filter(o => o.author !== id);

      return deletedUser[0];
    }
  },
  updateUser(parent, args, { db }, info) {
    const {
      id,
      data: { name, email, age }
    } = args;

    const user = db.users.find(o => o.id === id);

    if (!user) {
      return new Error('User not found');
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      const emailTaken = db.users.some(o => o.email === email);

      if (!emailTaken) {
        user.email = email;
      } else {
        return new Error('Email taken');
      }
    }

    if (age) {
      user.age = age;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const { title, body, published, author } = args.data;

    const userExits = db.users.some(user => user.id === author);

    if (!userExits) {
      throw new Error('User not found');
    } else {
      const post = {
        id: uuidv4(),
        title,
        body,
        published,
        author
      };

      db.posts.push(post);

      if (post.published) {
        pubsub.publish('POST_FROM_NEW_PUBLISHED', { post });
      }

      return post;
    }
  },
  deletePost(parent, args, { db }, info) {
    const { id } = args;

    const index = db.posts.findIndex(o => o.id === id);

    if (index < 0) {
      return new Error('Post not found');
    } else {
      const deletedPost = db.posts.splice(index, 1);
      db.comments = db.comments.filter(o => o.post !== deletedPost[0].id);
      return deletedPost[0];
    }
  },
  updatePost(parent, args, { db }, info) {
    const {
      id,
      data: { title, body, published }
    } = args;

    const post = db.posts.find(o => o.id === id);

    if (!post) {
      return new Error('Post not found');
    }

    if (title) {
      post.title = title;
    }

    if (body) {
      post.body = body;
    }

    if (published) {
      post.published = published;
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const { text, author, post } = args.data;
    const authorExits = db.users.some(o => o.id === author);
    const postExits = db.posts.some(o => o.id === post && o.published);

    if (!authorExits || !postExits) {
      return new Error('Author or post not found');
    } else {
      const comment = {
        id: uuidv4(),
        text,
        post,
        author
      };

      db.comments.push(comment);

      pubsub.publish(`COMMENT_FROM_POST_${post}`, { comment });

      return comment;
    }
  },
  deleteComment(parent, args, { db }, info) {
    const { id } = args;

    const index = db.comments.findIndex(o => o.id === id);

    if (index < 0) {
      throw new Error('Comment not found');
    } else {
      const deletedComment = db.comments.splice(index, 1);

      return deletedComment[0];
    }
  },
  updateComment(parent, args, { db }, info) {
    const {
      id,
      data: { text }
    } = args;

    const comment = db.comments.find(o => o.id === id);

    if (!comment) {
      return new Error('Comment not found');
    }

    if (text) {
      comment.text = text;
    }

    return comment;
  }
};
