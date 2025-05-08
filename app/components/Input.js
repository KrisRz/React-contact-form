'use client';

import { useState, useEffect } from 'react';
import styles from './Input.module.css';

const Input = ({ label, input, ref, onValidation }) => {
  const [error, setError] = useState('');
  const [value, setValue] = useState('');

  const validateInput = (value) => {
    if (input.required && !value) {
      return 'This field is required';
    }

    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email';
      }
    }

    if (input.type === 'tel' && value) {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }

    return '';
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    const errorMessage = validateInput(newValue);
    setError(errorMessage);
    onValidation?.(!errorMessage);
  };

  return (
    <div className={styles.input}>
      <label htmlFor={input.id}>{label}</label>
      <input
        ref={ref}
        {...input}
        value={value}
        onChange={handleChange}
        className={error ? styles.error : ''}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input; 