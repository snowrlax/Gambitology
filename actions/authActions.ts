"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const authUserWithCredentials = async (
  email: string,
  password: string,
  otp?: string
) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Signup Flow
  if (!user && otp) {
    const isValidOTP = await verifyOTP(email, otp);
    if (!isValidOTP) return null;

    const hashedPassword = await bcrypt.hash(password, 12);
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });
  }

  // Login Flow
  if (user?.password) {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    if (!user.emailVerified) {
      await sendOTP(email);
      throw new Error("Email verification required");
    }

    return user;
  }
};

export const authUserWithGoogle = async (
  googleId: string,
  email: string,
  name: string,
  image: string
) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // if user does not exist, create user
  if (!user) {
    const createUser = await prisma.user.create({
      data: {
        email,
        name,
        accounts: {
          create: {
            type: "oauth",
            provider: "google",
            providerAccountId: googleId,
          },
        },
        emailVerified: new Date(),
        image,
      },
    });
    return createUser;
  }

  // if user exists, just return user to log them in the application
  return user;
};

export const sendOTP = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);

  // WIP
  // send otp to user
  //   const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: process.env.EMAIL_USER,
  //       pass: process.env.EMAIL_PASS,
  //     },
  //   });

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return { error: "User not found" };
  }
  await prisma.user.update({
    where: { email },
    data: { otpSecret: hashedOTP },
  });
  return { success: "OTP sent" };
};

export const verifyOTP = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return { error: "User not found" };
  }
  const isOTPValid = await bcrypt.compare(otp, user.otpSecret || "");
  if (!isOTPValid) {
    return { error: "Invalid OTP" };
  }
  return { success: "OTP verified" };
};
