// npm run hash -- "your password"
// Prints a bcrypt hash for ADMIN_PASSWORD_HASH, so a deployed server never has
// to carry the plaintext password in its environment.

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash -- "your password"');
  process.exit(1);
}

console.log(await bcrypt.hash(password, 12));
