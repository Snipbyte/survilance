import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
    {
        organizationName: {
            type: String,
            required: true,
        },
        organizationType: {
            type: String, // e.g., school, hospital, company
            required: true,
        },
        organizationAddress: {
            type: String,
            required: true,
        },
        organizationContactEmail: {
            type: String,
            required: true,
        },
        organizationContactPhone: {
            type: String,
            required: true,
        },
        userFullName: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        organizationPassword: {
            type: String,
            required: true,
        },
        organizationStatus: {
            type: String, // e.g., active, inactive, pending
            default: "pending",
            required: true,
        },
        isOrganizationVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Organization = mongoose.models.Organization || mongoose.model("Organization", organizationSchema);
export default Organization;
