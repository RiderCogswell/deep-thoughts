const { User, Thought } = require("../models");

const resolvers = {
  Query: {
    // we do not need the parent but we need something in the first spot to access the username arg from the second parameter wwe
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ cratedAt: -1 });
    },

    // get single thought
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id })
    },

    // get all users
    users: async () => {
      return User.find()
        .select('-__v')
        .populate('friends')
        .populate('thoughts');
    },

    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');
    }
  }

};

module.exports = resolvers;
