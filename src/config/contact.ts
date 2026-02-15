import rawContact from "./contact.json";

export interface ContactConfig {
  social: {
    instagram: string;
    facebook: string;
  };
}

export const CONTACT: ContactConfig = rawContact;