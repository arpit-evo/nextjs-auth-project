import { connect } from "@/dbConfig/dbConfig";
import User, { IUser } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { EmailType, sendMail } from "@/helpers/mailer";

connect();

export const POST = async (req: NextRequest) => {
  try {
    const reqBody: IUser = await req.json();
    const { username, email, password } = reqBody;

    //validation
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    const savedUser = await newUser.save();

    // sending verification mail
    await sendMail({
      email,
      emailType: EmailType.verify,
      userId: savedUser._id,
    });

    return NextResponse.json(
      {
        message: "user registered successfully",
        success: true,
        savedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
