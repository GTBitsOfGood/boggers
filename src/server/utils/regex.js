/* eslint-disable no-useless-escape */

export const EMAIL_REGEX =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
export const emailTester = (email) => EMAIL_REGEX.test(email);

export const PHONE_REGEX = /^\d{10}$/;
export const phoneTester = (phone) => PHONE_REGEX.test(phone);
