import mongoose from "mongoose";

const organizationUserSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
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
        userId: {
            type: String,
            required: true,
            unique: false,
        },
        userPassword: {
            type: String,
            required: true,
        },
        userRole: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserRole",
            required: false, // Optional field
        },
        isUserVerified: {
            type: Boolean,
            default: true,
        },
        userStatus: {
            type: String, // e.g., active, inactive, suspended
            default: "active",
            required: true,
        },
        isPrimaryUser: {
            type: Boolean,
            default: false,
        },
        profileImageUrl: {
            type: String,
            default: "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=ffff"
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        createdBy: {
            type: String,
            required: true,
            default: "system",
        },
        // accessZones: {
        // type: [
        //     {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "OrganizationZone",
        //     },
        // ],
        // default: [],
        // },
    },
    { timestamps: true }
);

const OrganizationUser = mongoose.models.OrganizationUser || mongoose.model("OrganizationUser", organizationUserSchema);
export default OrganizationUser;
