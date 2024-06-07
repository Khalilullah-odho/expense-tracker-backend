import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = async (password: string) => {
  const genSalt = await bcrypt.genSalt(10);

  const hashed = bcrypt.hash(password, genSalt);

  return hashed;
};

const isCorrectPassword = async (password: string, hashedPass: string) => {
  const isPass = await bcrypt.compare(password, hashedPass);

  return isPass;
};

const generateUserToken = async (payload = {}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET ?? "jwt_secret");
  return token;
};

const helpers = {
  hashPassword,
  generateUserToken,
  isCorrectPassword,
};

export default helpers;
