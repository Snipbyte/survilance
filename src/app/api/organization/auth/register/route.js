import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/mongodb';
import Organization from '../../../../../../models/organization.model';
import OrganizationUser from '../../../../../../models/organization.user.model';
import { generateUserTag } from '../../../../../../utils/generateUserTag';
import bcrypt from 'bcryptjs';
import { isPasswordGroovy } from '../../../../../../utils/passwordValidator';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    let {
      organizationName,
      organizationType,
      organizationAddress,
      organizationContactEmail,
      organizationContactPhone,
      userFullName,
      userEmail,
      organizationPassword,
    } = body;

    // Trim all input fields
    organizationName = organizationName?.trim();
    organizationType = organizationType?.trim();
    organizationAddress = organizationAddress?.trim();
    organizationContactEmail = organizationContactEmail?.trim().toLowerCase();
    organizationContactPhone = organizationContactPhone?.trim();
    userFullName = userFullName?.trim();
    userEmail = userEmail?.trim().toLowerCase();
    organizationPassword = organizationPassword?.trim();

    // Validate required fields
    if (
      !organizationName ||
      !organizationType ||
      !organizationAddress ||
      !organizationContactEmail ||
      !organizationContactPhone ||
      !userFullName ||
      !userEmail ||
      !organizationPassword
    ) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(organizationContactEmail) || !emailRegex.test(userEmail)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    // Phone validation
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(organizationContactPhone)) {
      return NextResponse.json({ error: 'Invalid phone number format.' }, { status: 400 });
    }

    // Password strength check
    const { isValid, message } = isPasswordGroovy(organizationPassword);
    if (!isValid) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Check if organization already exists
    const existingOrg = await Organization.findOne({
      $or: [
        { organizationName },
        { organizationContactEmail },
      ],
    });
    if (existingOrg) {
      return NextResponse.json({ error: 'Organization with this name or email already exists.' }, { status: 409 });
    }

    // Check if user email already exists
    const existingUser = await OrganizationUser.findOne({ userEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already in use.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(organizationPassword, 10);

    // Create the organization
    const organization = new Organization({
      organizationName,
      organizationType,
      organizationAddress,
      organizationContactEmail,
      organizationContactPhone,
      userFullName,
      userEmail,
      organizationPassword: hashedPassword,
      organizationStatus: 'active', // Auto-verify for now; will implement email verification later
      isOrganizationVerified: true,
    });
    await organization.save();

    // Create the primary organization user
    const primaryUser = new OrganizationUser({
      organizationId: organization._id,
      userFullName,
      userEmail,
      userId: generateUserTag(userEmail),
      userPassword: hashedPassword,
      isPrimaryUser: true,
      isUserVerified: true,
      userStatus: 'active',
    });
    await primaryUser.save();

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to Our Service',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome, ${userFullName}!</h2>
          <p>Thank you for registering your organization <strong>${organizationName}</strong>.</p>
          <p>You can now sign in with:</p>
          <ul>
            <li><strong>Email:</strong> ${userEmail}</li>
            <li><strong>Password:</strong> ${organizationPassword}</li>
          </ul>
          <p>Please change your password after the first login.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
    });

    // Return response (omit passwords)
    const orgData = organization.toObject();
    const primaryUserData = primaryUser.toObject();
    delete orgData.organizationPassword;
    delete primaryUserData.userPassword;

    return NextResponse.json(
      {
        message: 'Organization and primary user registered successfully.',
        organizationDetails: orgData,
        primaryUserDetails: primaryUserData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
