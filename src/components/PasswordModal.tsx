'use client';

import { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (password: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function PasswordModal({ 
  isOpen, 
  onClose, 
  onValidate, 
  isLoading 
}: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setShowPassword(false);
      // Focus on password input after modal renders
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setError('');
    const isValid = await onValidate(password);
    
    if (!isValid) {
      setError('Invalid password. Please try again.');
      setPassword(''); // Clear password on error
      passwordInputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onKeyDown={handleKeyDown}>
      <div className="modal-content password-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Lock size={20} />
            <h2 className="font-light">Reveal Features</h2>
          </div>
          {!isLoading && (
            <button 
              className="modal-close-button"
              onClick={onClose}
              type="button"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        <div className="modal-body">
          <p className="password-modal-description font-light">
            Enter the password to access database management features
          </p>
          
          <form onSubmit={handleSubmit} className="password-form">
            <div className="password-input-container">
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="password-input"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {error && (
              <div className="password-error">
                {error}
              </div>
            )}
            
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary font-light"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary font-light"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? 'Validating...' : 'Unlock Features'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
