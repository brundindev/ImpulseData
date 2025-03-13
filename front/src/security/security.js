import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
