import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

import { posts, users, comments } from './mock-data';

const typeDefs = `
  type Query {
    posts(query: String): [Post!]!
    users(query: String): [User!]!
    comments(query: String): [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
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
      const { name, email, age } = args;

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
    createPost(parent, args, ctx, info) {
      const { title, body, published, author } = args;

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
    createComment(parent, args, ctx, info) {
      const { text, author, post } = args;
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
