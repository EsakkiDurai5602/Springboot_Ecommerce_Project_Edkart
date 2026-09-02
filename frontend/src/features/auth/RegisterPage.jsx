import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Card, CardBody } from '../../components/ui/Card';
import { ShoppingBag, User, Mail, KeyRound, Phone } from 'lucide-react';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-16">
      <Card variant="elevated">
        <CardBody className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Create EdKart Account
            </h2>
            <p className="text-xs text-slate-500">
              Join thousands of tech enthusiasts for premium electronics & deals
            </p>
          </div>

          {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Esakki Durai"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Mobile Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Choose Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<KeyRound className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-amber-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
