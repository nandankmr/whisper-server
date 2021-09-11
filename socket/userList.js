let users = [];

const addUser = function (socketId, userId, username) {
  removeUser(socketId);
  users.push({ socketId, userId, username });
};

const removeUser = function (socketId) {
  users = users.filter((item) => item.socketId !== socketId);
};

const findUser = function (userId) {
  return users.find((user) => user.userId == userId);
};

const getAllUsers = () => users;

module.exports = {
  addUser,
  removeUser,
  findUser,
  getAllUsers,
};
