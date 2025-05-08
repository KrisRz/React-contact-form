'use client';

import { useRef, useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Input from './components/Input';
import styles from './page.module.css';

// Test site key for development
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export default function Home() {
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const phoneInputRef = useRef();
  const recaptchaRef = useRef();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [validationState, setValidationState] = useState({
    name: false,
    email: false,
    phone: false
  });
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Set CSRF token on component mount
    const token = crypto.randomBytes(32).toString('hex');
    document.cookie = `csrf-token=${token}; path=/; SameSite=Strict`;
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
    nameInputRef.current.value = '';
    emailInputRef.current.value = '';
    phoneInputRef.current.value = '';
    setValidationState({ name: false, email: false, phone: false });
    recaptchaRef.current?.reset();
    setIsCaptchaVerified(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = await recaptchaRef.current.executeAsync();
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf-token='))
        ?.split('=')[1];

      const response = await fetch('/api/contact', {
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
        throw new Error(data.error || 'Failed to submit form');
      }

      setFormStatus({
        type: 'success',
        message: 'Form submitted successfully!'
      });

      resetForm();
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Contact Us</h1>
        
        <Input
          ref={nameInputRef}
          label="Name"
          input={{
            id: 'name',
            type: 'text',
            required: true,
            placeholder: 'Enter your name'
          }}
          onValidation={handleValidation('name')}
        />
        
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
          ref={phoneInputRef}
          label="Phone Number"
          input={{
            id: 'phone',
            type: 'tel',
            required: true,
            placeholder: 'Enter your phone number'
          }}
          onValidation={handleValidation('phone')}
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
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
} 