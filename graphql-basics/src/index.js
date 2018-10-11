import { GraphQLServer } from 'graphql-yoga';

import { posts, users } from './mock-data';

const typeDefs = `
  type Query {
    posts(query: String): [Post!]!
    users(query: String): [User!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
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
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('server start at localhost:4000');
});
