const { User, Book } = require('./models');
const { signToken } = require('./utils/auth');
const { AuthenicationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select(-__v - password)
        return userData;
      }
      throw new AuthenicationError('You must be logged in to view this data.');
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user)
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenicationError('Invalid login credentials.');
      }
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new AuthenicationError('Invalid login credentials.');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      if (!context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenicationError('You must be logged in to save a book.');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { _id: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
    }
  },
};

module.exports = resolvers;

// Define the query and mutation functionality to work with the Mongoose models.