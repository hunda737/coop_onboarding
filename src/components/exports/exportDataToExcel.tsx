// import * as XLSX from "xlsx";

// // Your dynamic data

// const exportDataToExcel = (filtered: string, data: any) => {
//   const dynamicData = [
//     [
//       "fullName",
//       "surname",
//       "motherName",
//       "email",
//       "emailVerified",
//       "phone",
//       "streetAddress",
//       "city",
//       "state",
//       "zipCode",
//       "country",
//       "occupation",
//       "initialDeposit",
//       "monthlyIncome",
//       "sex",
//       "branch",
//       "currency",
//       "photo",
//       "residenceCard",
//       "passport",
//       "confirmationForm",
//       "signature",
//       "accountType",
//       "createdAt",
//     ],
//     ...data?.map((row: any) => [
//       filtered === "filtered" ? row.original.fullName : row.fullName,
//       filtered === "filtered" ? row.original.surname : row.surname,
//       filtered === "filtered" ? row.original.motherName : row.motherName,
//       filtered === "filtered" ? row.original.email : row.email,
//       filtered === "filtered" ? row.original.emailVerified : row.emailVerified,
//       filtered === "filtered" ? row.original.phone : row.phone,
//       filtered === "filtered" ? row.original.streetAddress : row.streetAddress,
//       filtered === "filtered" ? row.original.city : row.city,
//       filtered === "filtered" ? row.original.state : row.state,
//       filtered === "filtered" ? row.original.zipCode : row.zipCode,
//       filtered === "filtered" ? row.original.country : row.country,
//       filtered === "filtered" ? row.original.occupation : row.occupation,
//       filtered === "filtered"
//         ? row.original.initialDeposit
//         : row.initialDeposit,
//       filtered === "filtered" ? row.original.monthlyIncome : row.monthlyIncome,
//       filtered === "filtered" ? row.original.sex : row.sex,
//       filtered === "filtered" ? row.original.branch : row.branch,
//       filtered === "filtered" ? row.original.currency : row.currency,
//       filtered === "filtered" ? row.original.phone : row.phone,
//       filtered === "filtered" ? row.original.residenceCard : row.residenceCard,
//       filtered === "filtered" ? row.original.passport : row.passport,
//       filtered === "filtered"
//         ? row.original.confirmationForm
//         : row.confirmationForm,
//       filtered === "filtered" ? row.original.signature : row.signature,
//       filtered === "filtered" ? row.original.accountType : row.accountType,
//       filtered === "filtered" ? row.original.createdAt : row.createdAt,
//     ]),
//     // Add more rows as needed
//   ];
//   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);

//   // Create a workbook
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

//   // Save the workbook to a file
//   XLSX.writeFile(wb, "output.xlsx", { bookSST: true });
// };

// export default exportDataToExcel;

// // Create a worksheet
