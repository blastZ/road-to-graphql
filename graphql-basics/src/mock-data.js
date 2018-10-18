let posts = [
  {
    id: 'p-1',
    title: 'Post One',
    body: 'This is post one',
    published: false,
    author: 'u-1'
  },
  {
    id: 'p-2',
    title: 'Post Two',
    body: 'This is post two',
    published: true,
    author: 'u-1'
  },
  {
    id: 'p-3',
    title: 'Post Three',
    body: 'This is post three',
    published: false,
    author: 'u-3'
  }
];

let users = [
  {
    id: 'u-1',
    name: 'AA',
    email: 'AAAAAAA@example.com',
    age: 12
  },
  {
    id: 'u-2',
    name: 'BB',
    email: 'BBBBBBB@example.com'
  },
  {
    id: 'u-3',
    name: 'CC',
    email: 'CCCCCCC@example.com'
  }
];

let comments = [
  {
    id: 'c-1',
    text: 'This worked fine, Thanks.',
    author: 'u-3',
    post: 'p-3'
  },
  {
    id: 'c-2',
    text: 'This did not work.',
    author: 'u-2',
    post: 'p-2'
  },
  {
    id: 'c-3',
    text: 'Never mind, I fix it.',
    author: 'u-2',
    post: 'p-2'
  },
  {
    id: 'c-4',
    text: 'Glad for you to enjoy it.',
    author: 'u-1',
    post: 'p-1'
  }
];

const setPosts = newPosts => {
  posts = newPosts;
};

const setUsers = newUsers => {
  users = newUsers;
};

const setComments = newComments => {
  comments = newComments;
};

export { posts, users, comments, setPosts, setUsers, setComments };
