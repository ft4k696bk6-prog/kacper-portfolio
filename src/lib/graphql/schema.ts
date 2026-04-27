export const typeDefs = /* GraphQL */ `
  type ContactInfo {
    email: String!
    phone: String!
    mailto: String!
    tel: String!
  }

  input ContactMessageInput {
    name: String!
    email: String!
    message: String!
    companyWebsite: String
    turnstileToken: String!
    clientNonce: String
  }

  type ContactMessageResult {
    ok: Boolean!
    message: String
  }

  type Query {
    contactInfo: ContactInfo!
  }

  type Mutation {
    sendContactMessage(input: ContactMessageInput!): ContactMessageResult!
  }
`;
