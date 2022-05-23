// import the graphql
import gql from 'graphql-tag';

// This will hold the query GET_ME, which will execute the me query set up using Apollo Server.
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        title
        bookId
        authors
        description
        image
        link
      }
    }
  }
`;
