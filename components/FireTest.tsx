// "use client";

// import { useEffect, useState } from "react";
// import { FirebaseDataSource } from "@/services/FirebaseDataSource";
// import { Property } from "@/core/types";

// const propertySource = new FirebaseDataSource<Property>("properties");

// export default function FireTest() {
//   const [text, setText] = useState("Loading...");

//   useEffect(() => {
//     propertySource.getById("a").then((res) => {
//       if (res.ok && res.data) {
//         setText(res.data.title);
//       } else {
//         setText(res.error ?? "Error");
//       }
//     });
//   }, []);

//   return <div>{text}</div>;
// }