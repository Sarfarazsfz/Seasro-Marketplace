import React, { useState } from 'react';
import { useAuth } from '../App';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      // Redirect to home or dashboard
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... form fields ... */}
    </form>
  );
}