'use client';

import { useRef, useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Input from './components/Input';
import styles from './page.module.css';

// Test site key for development
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export default function Home() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const recaptchaRef = useRef();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [validationState, setValidationState] = useState({
    email: false,
    password: false
  });
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // Set CSRF token on component mount
    const generateToken = async () => {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      document.cookie = `csrf-token=${token}; path=/; SameSite=Strict`;
    };
    generateToken();
  }, []);

  const handleValidation = (field) => (isValid) => {
    setValidationState(prev => ({
      ...prev,
      [field]: isValid
    }));
  };

  const validateForm = () => {
    return Object.values(validationState).every(Boolean) && isCaptchaVerified;
  };

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(!!value);
  };

  const resetForm = () => {
    emailInputRef.current.value = '';
    passwordInputRef.current.value = '';
    setValidationState({ email: false, password: false });
    recaptchaRef.current?.reset();
    setIsCaptchaVerified(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus({ type: '', message: '' });

    try {
      const token = await recaptchaRef.current.executeAsync();
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf-token='))
        ?.split('=')[1];

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          ...formData,
          captchaToken: token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setFormStatus({
        type: 'success',
        message: 'Login successful!'
      });

      // TODO: Handle successful login (e.g., redirect to dashboard)
      // window.location.href = '/dashboard';
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Login</h1>
        
        <Input
          ref={emailInputRef}
          label="Email"
          input={{
            id: 'email',
            type: 'email',
            required: true,
            placeholder: 'Enter your email'
          }}
          onValidation={handleValidation('email')}
        />
        
        <Input
          ref={passwordInputRef}
          label="Password"
          input={{
            id: 'password',
            type: 'password',
            required: true,
            placeholder: 'Enter your password'
          }}
          onValidation={handleValidation('password')}
        />

        <div className={styles.captchaContainer}>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          />
        </div>

        {formStatus.message && (
          <div className={`${styles.status} ${styles[formStatus.type]}`}>
            {formStatus.message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading || !validateForm()}
          className={styles.submitButton}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
} 