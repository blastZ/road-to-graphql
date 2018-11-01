import { Prisma } from 'prisma-binding';
import path from 'path';

const prisma = new Prisma({
  typeDefs: path.resolve(__dirname, './generated/prisma.graphql'),
  endpoint: 'http://localhost:4466'
});

prisma.mutation
  .updatePost(
    {
      where: {
        id: 'cjnx58v4r000w07813ahk6q7e'
      },
      data: {
        title: 'I like to watch ducks',
        published: true
      }
    },
    `{ id title published }`
  )
  .then(data => {
    return prisma.query.posts(null, `{ id title body published }`);
  })
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  });
