const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function passwordIssues(pw) {
  const issues = [];
  if (pw.length < 8) issues.push('at least 8 characters');
  if (!/[a-zA-Z]/.test(pw)) issues.push('a letter');
  if (!/\d/.test(pw)) issues.push('a number');
  return issues;
}

export function passwordStrength(pw) {
  let n = 0;
  if (pw.length >= 8) n++;
  if (pw.length >= 12) n++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) n++;
  if (/\d/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) n++;
  return ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][pw ? Math.max(n, 1) : 0];
}

export function validateLogin({ email, password }) {
  const e = {};
  if (!EMAIL.test(email.trim())) e.email = 'Enter a valid email address.';
  if (!password) e.password = 'Enter your password.';
  return e;
}

export function validateRegister({ name, email, password, confirm }) {
  const e = {};
  if (name.trim().length < 2) e.name = 'Enter your full name.';
  if (!EMAIL.test(email.trim())) e.email = 'Enter a valid email address.';
  const issues = passwordIssues(password);
  if (issues.length) e.password = `Password needs ${issues.join(', ')}.`;
  if (confirm !== password) e.confirm = 'Passwords do not match.';
  return e;
}
