import { gql } from "@apollo/client";

export const CONTACT_INFO_QUERY = gql`
  query ContactInfo {
    contactInfo {
      email
      phone
      mailto
      tel
    }
  }
`;

export const SEND_CONTACT_MESSAGE_MUTATION = gql`
  mutation SendContactMessage($input: ContactMessageInput!) {
    sendContactMessage(input: $input) {
      ok
      message
    }
  }
`;
