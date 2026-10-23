import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout.jsx';
import PasswordField from '../components/common/PasswordField.jsx';
import { validateLogin } from '../validation/authSchemas.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname || '/dashboard';

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    const found = validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      await signIn(values);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message);
      if (err.details) setErrors(err.details);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue with your resume analysis." footer={<>New to ResumeIQ? <Link to="/register">Create an account</Link></>}>
      <form onSubmit={onSubmit} noValidate>
        {formError && <div className="form-alert" role="alert"><AlertCircle size={18} aria-hidden="true" />{formError}</div>}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
          {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
        </div>
        <PasswordField id="password" label="Password" autoComplete="current-password" value={values.password} onChange={set('password')} error={errors.password} />
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? <><Loader2 className="spin" size={18} aria-hidden="true" /> Logging in…</> : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  );
}
