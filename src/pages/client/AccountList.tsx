// import { useState } from "react"
// import { useGetAllIndividualAccountsQuery, useGetAllJointAccountsQuery, useGetAllOrganizationalAccountsQuery } from "@/features/accounts/accountApiSlice";
// import { Account } from "@/features/accounts/accountApiSlice";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { MoreHorizontal } from "lucide-react"
// import { Link } from "react-router-dom"
// import AccountDetail from "./AccountDetail"

// const AccountList = () => {
//   const [accountType, setAccountType] = useState<"individual" | "joint" | "organizational">("individual")
//   const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
//   const [isDetailOpen, setIsDetailOpen] = useState(false)

//   const { data: individualAccounts, isLoading: isLoadingIndividual } = useGetAllIndividualAccountsQuery({
//     values: "exclude",
//     clientId: "1" // Replace with actual client ID
//   })

//   const { data: jointAccounts, isLoading: isLoadingJoint } = useGetAllJointAccountsQuery({
//     values: "exclude",
//     clientId: "1" // Replace with actual client ID
//   })

//   const { data: organizationalAccounts, isLoading: isLoadingOrganizational } = useGetAllOrganizationalAccountsQuery({
//     values: "exclude",
//     clientId: "1" // Replace with actual client ID
//   })

//   const getAccounts = () => {
//     switch (accountType) {
//       case "individual":
//         return individualAccounts?.data || []
//       case "joint":
//         return jointAccounts?.data || []
//       case "organizational":
//         return organizationalAccounts?.data || []
//       default:
//         return []
//     }
//   }

//   const isLoading = isLoadingIndividual || isLoadingJoint || isLoadingOrganizational

//   const handleViewDetails = (account: Account) => {
//     setSelectedAccount(account)
//     setIsDetailOpen(true)
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "ACTIVE":
//         return <Badge> Active </Badge>
//       case "PENDING":
//         return <Badge > Pending</Badge>
//       case "REJECTED":
//         return <Badge > Rejected</Badge>
//       case "INITIAL":
//         return <Badge variant="secondary">Initial</Badge>
//       default:
//         return <Badge>{status}</Badge>
//     }
//   }

//   return (
//     <div className="space-y-4 mx-6"> {/* Added mx-4 for margin on both sides */}
//     <Card>
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <div className="flex space-x-2">
//             <Button
//               variant={accountType === "individual" ? "default" : "outline"}
//               onClick={() => setAccountType("individual")}
//             >
//               Individual
//             </Button>
//             <Button
//               variant={accountType === "joint" ? "default" : "outline"}
//               onClick={() => setAccountType("joint")}
//             >
//               Joint
//             </Button>
//             <Button
//               variant={accountType === "organizational" ? "default" : "outline"}
//               onClick={() => setAccountType("organizational")}
//             >
//               Organizational
//             </Button>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <p>Loading accounts...</p>
//           </div>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Customer</TableHead>
//                 <TableHead>Account Type</TableHead>
//                 <TableHead>Phone</TableHead>
//                 <TableHead>Balance</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Completion</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {getAccounts().map((account) => (
//                 <TableRow key={account.id}>
//                   <TableCell className="font-medium">
//                     <div className="flex items-center space-x-3">
//                       <Avatar>
//                         <AvatarImage src={account.photo} />
//                         <AvatarFallback>
//                           {account.fullName?.charAt(0) || account.companyName?.charAt(0) || "A"}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium">
//                           {account.fullName || account.companyName || "N/A"}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           {account.email || account.companyEmail || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline">
//                       {account.accountType}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>{account.phone || account.companyPhoneNumber || "N/A"}</TableCell>
//                   <TableCell>{account.initialDeposit ? account.initialDeposit.toLocaleString() : "N/A"}</TableCell>
  
//                   <TableCell>{getStatusBadge(account.status)}</TableCell>
//                   <TableCell>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div
//                         className="bg-blue-600 h-2.5 rounded-full"
//                         style={{ width: `${account.percentageComplete}%` }}
//                       ></div>
//                     </div>
//                     <span className="text-sm text-muted-foreground">
//                       {account.percentageComplete}%
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => handleViewDetails(account)}>
//                           View Details
//                         </DropdownMenuItem>
//                         <DropdownMenuItem asChild>
//                           <Link to={`/accounts/edit/${account.id}`}>Edit</Link>
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </CardContent>
//     </Card>
  
//     {selectedAccount && (
//       <AccountDetail
//         account={selectedAccount}
//         isOpen={isDetailOpen}
//         onClose={() => setIsDetailOpen(false)}
//       />
//     )}
//   </div>
  
//   )
// }

// export default AccountList