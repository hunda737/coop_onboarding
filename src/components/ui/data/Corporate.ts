import { OrganizationalAccount } from "@/features/accounts/accountApiSlice";

export const Corporate: OrganizationalAccount = {
    id: 9992,
    accountId: 9992,
    customerType: "ORGANIZATION",
    accountNumber: "ORG-2023-9992",
    accountType: "CHECKING",
    status: "REGISTERED",
    initialDeposit: 10000,
    branch: "Downtown Branch",
    currency: "USD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    companyName: "Acme Corporation",
    companyEmail: "info@acme.com",
    companyPhoneNumber: "+11234567890",
    companyTinNumber: "TIN-987654321",
    companyTarget: "Technology Solutions",
    companyResidence: "456 Business Ave",
    companyState: "CA",
    companyZone: "Silicon Valley",
    companySubCity: "San Francisco",
    companyWoreda: "Tech District",
    customersInfo: [
        {
            id: 99921,
            fullName: "Michael Johnson",
            email: "michael.j@acme.com",
            phone: "+11234567891",
            percentageComplete: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            approvals: [],
            authorizations: [],
            emailVerified: false
        },
        {
            id: 99922,
            fullName: "Sarah Williams",
            email: "sarah.w@acme.com",
            phone: "+11234567892",
            percentageComplete: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            approvals: [],
            authorizations: [],
            emailVerified: false
        }
    ],
    approvals: [],
    authorizations: [],
    emailVerified: false,
    phone: "",
    error: "",
    percentageComplete: 0,
    customerId: ""
};