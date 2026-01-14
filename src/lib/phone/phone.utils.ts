import {
  parsePhoneNumber,
  AsYouType,
  CountryCode,
  getCountries,
} from "libphonenumber-js";

export function formatPhoneNumber(
  value: string,
  countryCode: string
): string {
  try {
    return new AsYouType(countryCode as CountryCode).input(value);
  } catch {
    return value;
  }
}

export function isValidPhoneNumber(
  value: string,
  countryCode: string
): boolean {
  try {
    return parsePhoneNumber(value, countryCode as CountryCode).isValid();
  } catch {
    return false;
  }
}

export function getInternationalFormat(
  value: string,
  countryCode: string
): string {
  try {
    return parsePhoneNumber(value, countryCode as CountryCode)
      .formatInternational();
  } catch {
    return value;
  }
}

export function getCountryList() {
  return getCountries().map((code) => ({
    code,
    name:
      new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code,
  }));
}
