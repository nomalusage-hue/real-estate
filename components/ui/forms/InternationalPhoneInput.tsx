// import { PhoneInput } from "react-international-phone";
// import "react-international-phone/style.css";
// import "./InternationalPhoneInput.css";
// import { GeoService } from "@/src/lib/geo";

// interface InternationalPhoneInputProps {
//   value: string;
//   onChange: (value: string) => void;
//   defaultCountry?: string;
//   className?: string;
//   required?: boolean;
//   placeholder?: string;
//   disabled?: boolean;
// }

// export function InternationalPhoneInput({
//   value,
//   onChange,
//   // defaultCountry = "lb",
//   className = "",
//   required = false,
//   placeholder = "Phone number",
//   disabled = false,
// }: InternationalPhoneInputProps) {
//   const country = GeoService.getCountry();
//   return (
//     <PhoneInput
//       defaultCountry={country}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       inputClassName={`form-control ${className}`}
//       countrySelectorStyleProps={{
//         buttonClassName: "phone-country-btn",
//       }}
//       inputProps={{
//         required,
//         placeholder,
//       }}
//     />
//   );
// }




import { useEffect, useState } from "react";
import { getCountry } from "@/src/lib/geo/getCountry";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./InternationalPhoneInput.css";

export function InternationalPhoneInput(props: any) {
  const [country, setCountry] = useState("us");

  useEffect(() => {
    getCountry().then(setCountry);
  }, []);

  return (
      <PhoneInput
        defaultCountry={country}
        inputClassName="form-control"
        inputProps={{
          name: "phone",
          type: "tel",
          required: true, 
          autoComplete: "tel",
          inputMode: "tel",
          "aria-label": "Phone number",
          "data-test": "phone-input",
          placeholder: "Enter your phone number",
        }}
        {...props}
      />
  );
}