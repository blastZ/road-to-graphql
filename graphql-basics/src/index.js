import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

import { posts, users, comments, setPosts, setUsers, setComments } from './mock-data';

const typeDefs = `
  type Query {
    posts(query: String): [Post!]!
    users(query: String): [User!]!
    comments(query: String): [Comment!]!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

const resolvers = {
  Query: {
    posts(parent, args, ctx, info) {
      const { query = null } = args;
      if (!query) {
        return posts;
      } else {
        return posts.filter(post => {
          return post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase());
        });
      }
    },
    users(parent, args, ctx, info) {
      const { query = null } = args;
      if (!query) {
        return users;
      } else {
        return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
      }
    },
    comments(parent, args, ctx, info) {
      const { query = null } = args;
      if (!query) {
        return comments;
      } else {
        return comments.filter(comment => comment.text.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
      }
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const { name, email, age } = args.data;

      const emailTaken = users.some(user => user.email === email);

      if (emailTaken) {
        throw new Error('Email Taken');
      } else {
        const user = {
          id: uuidv4(),
          name,
          email,
          age
        };

        users.push(user);

        return user;
      }
    },
    deleteUser(parent, args, ctx, info) {
      const { id } = args;

      const index = users.findIndex(o => o.id === id);
      if (index < 0) {
        throw new Error('User not find');
      } else {
        const deletedUser = users.splice(index, 1);

        // remove posts belong user, and comments belong post
        setPosts(
          posts.filter(post => {
            if (post.author !== id) return post;

            setComments(comments.filter(o => o.post !== post.id));
          })
        );
        // remove comments belong user
        setComments(comments.filter(o => o.author !== id));

        return deletedUser[0];
      }
    },
    createPost(parent, args, ctx, info) {
      const { title, body, published, author } = args.data;

      const userExits = users.some(user => user.id === author);

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

        posts.push(post);

        return post;
      }
    },
    deletePost(parent, args, ctx, info) {
      const { id } = args;

      const index = posts.findIndex(o => o.id === id);

      if (index < 0) {
        return new Error('Post not found');
      } else {
        const deletedPost = posts.splice(index, 1);
        setComments(comments.filter(o => o.post !== deletedPost[0].id));
        return deletedPost[0];
      }
    },
    createComment(parent, args, ctx, info) {
      const { text, author, post } = args.data;
      const authorExits = users.some(o => o.id === author);
      const postExits = posts.some(o => o.id === post && o.published);

      if (!authorExits || !postExits) {
        return new Error('Author or post not found');
      } else {
        const comment = {
          id: uuidv4(),
          text,
          post,
          author
        };

        comments.push(comment);

        return comment;
      }
    },
    deleteComment(parent, args, ctx, info) {
      const { id } = args;

      const index = comments.findIndex(o => o.id === id);

      if (index < 0) {
        throw new Error('Comment not found');
      } else {
        const deletedComment = comments.splice(index, 1);

        return deletedComment[0];
      }
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(o => o.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(o => o.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(o => o.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(o => o.id === parent.post);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('server start at localhost:4000');
});
