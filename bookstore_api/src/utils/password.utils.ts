import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string, saltRound = 10) => {
  const salt = await bcrypt.genSalt(saltRound);
  const hashedPassword = await bcrypt.hash(password, salt);

  return {
    salt,
    hashedPassword,
  };
};

export const comparePassword = async (
  passwordCandidate: string,
  realHashedPassword: string
) => {
  return await bcrypt.compare(passwordCandidate, realHashedPassword);
};