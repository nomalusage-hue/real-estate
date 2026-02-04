// export const CONTACT = {
//   email: "contact@yourdomain.com",
//   phone: "96170118770",
//   social: {
//     instagram: "https://instagram.com/rbecca_property",
//     facebook: "https://www.facebook.com/share/17og9WUrbm"
//   },
// } as const;



import rawContact from "./contact.json";

export interface ContactConfig {
  email: string;
  phone: string;
  social: {
    instagram: string;
    facebook: string;
  };
}

export const CONTACT: ContactConfig = rawContact;