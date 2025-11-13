// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useGetIndividualAccountByIdQuery, useUpdateIndividualAccountMutation, IndividualAccount } from "@/features/accounts/accountApiSlice";

// const AccountEditContainer = () => {
//   const { accountId } = useParams();
//   const navigate = useNavigate();
//   const { data: individualAccount, isLoading } = useGetIndividualAccountByIdQuery(accountId!);
//   const [updateIndividualAccount] = useUpdateIndividualAccountMutation();

//   const [formData, setFormData] = useState<Partial<IndividualAccount>>({});

//   useEffect(() => {
//     if (individualAccount) {
//       setFormData(individualAccount);
//     }
//   }, [individualAccount]);

//   if (isLoading) return <p>Loading...</p>;
//   if (!individualAccount) return <p>No account found</p>;

//   const handleChange = (field: keyof IndividualAccount, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await updateIndividualAccount({ id: individualAccount.id.toString(), updatedData: formData }).unwrap();
//       toast.success("Account updated successfully");
//       navigate(`/accounts/${accountId}`); // or wherever you want to redirect
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to update account");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
//       <h2 className="text-2xl font-bold mb-4">Edit Account</h2>

//       <label className="block">
//         Full Name
//         <input
//           type="text"
//           value={formData.fullName || ""}
//           onChange={(e) => handleChange("fullName", e.target.value)}
//           className="input input-bordered w-full"
//         />
//       </label>

//       <label className="block">
//         Email
//         <input
//           type="email"
//           value={formData.emailVerified || ""}
//           onChange={(e) => handleChange("emailVerified", e.target.value)}
//           className="input input-bordered w-full"
//         />
//       </label>

//       <label className="block">
//         Phone
//         <input
//           type="text"
//           value={formData.phone || ""}
//           onChange={(e) => handleChange("phone", e.target.value)}
//           className="input input-bordered w-full"
//         />
//       </label>

//       {/* Add other fields you want editable here similarly */}

//       <button type="submit" className="btn btn-primary">
//         Save Changes
//       </button>
//     </form>
//   );
// };

// export default AccountEditContainer;
