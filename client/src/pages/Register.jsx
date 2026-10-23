import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout.jsx';
import PasswordField from '../components/common/PasswordField.jsx';
import { validateRegister, passwordStrength } from '../validation/authSchemas.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname || '/dashboard';

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    const found = validateRegister(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      await signUp(values);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message);
      if (err.details) setErrors(err.details);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start analyzing your resume in minutes." footer={<>Already have an account? <Link to="/login">Log in</Link></>}>
      <form onSubmit={onSubmit} noValidate>
        {formError && <div className="form-alert" role="alert"><AlertCircle size={18} aria-hidden="true" />{formError}</div>}
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" autoComplete="name" value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
          {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
          {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
        </div>
        <PasswordField id="password" label="Password" autoComplete="new-password" value={values.password} onChange={set('password')} error={errors.password}
          hint={values.password ? `Strength: ${passwordStrength(values.password)}` : 'Use 8+ characters with a letter and a number.'} />
        <PasswordField id="confirm" label="Confirm password" autoComplete="new-password" value={values.confirm} onChange={set('confirm')} error={errors.confirm} />
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? <><Loader2 className="spin" size={18} aria-hidden="true" /> Creating account…</> : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
