import { validationResult } from "express-validator";
import { withControllerHandler } from "../middlewares/controller.middleware";
import prisma from "../config/db";
import { helpers } from "../utils";

export const signup = withControllerHandler(async (req, res) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: validation.array()[0].msg,
      data: { errors: validation.array() },
    });
  }

  const {
    email,
    fullName,
    password,
    creditBalance = 0,
    imageUrl = null,
  } = req.body;

  const hashedPass = await helpers.hashPassword(password);

  const isUserExists = await prisma.user.findUnique({
    where: { email_address: email },
  });

  if (isUserExists) {
    return res.status(409).json({
      status: false,
      message: "User already exists with given email address!",
      data: {},
    });
  }

  const newUser = await prisma.user.create({
    data: {
      email_address: email,
      full_name: fullName,
      password: hashedPass,
      credit_balance: Number(creditBalance),
      image_url: imageUrl,
      total_credit: Number(creditBalance),
    },
    select: {
      full_name: true,
      credit_balance: true,
      is_admin: true,
      id: true,
      email_address: true,
      total_credit: true,
    },
  });

  const access_token = await helpers.generateUserToken(newUser);

  return res.status(201).json({
    status: true,
    message: "user register successfully.",
    data: { user: newUser, access_token },
  });
});

export const login = withControllerHandler(async (req, res) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: validation.array()[0].msg,
      data: { errors: validation.array() },
    });
  }

  const { email, password: pass } = req.body;

  const isUser = await prisma.user.findUnique({
    where: { email_address: email },
  });

  if (!isUser) {
    return res.status(404).json({
      status: false,
      message: "User not found!",
      data: {},
    });
  }

  const isValidCredentials = await helpers.isCorrectPassword(
    pass,
    isUser.password
  );

  if (!isValidCredentials) {
    return res.status(400).json({
      status: false,
      message: "invalid credentials!",
      data: {},
    });
  }

  const { password, ...userData } = isUser;

  const access_token = await helpers.generateUserToken(userData);

  return res.status(200).json({
    status: true,
    message: "login successfully.",
    data: { user: userData, access_token },
  });
});
