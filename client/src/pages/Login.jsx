import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // ✅ Google Login Handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log('✅ Google Credential:', credentialResponse); // Frontend log

      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        token: credentialResponse.credential,
      });

      console.log('✅ Backend Response:', res.data); // Backend response

      // Login Success
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Google Login Error:', err.response?.data || err.message);
      alert('Google login failed!');
    }
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      console.log('📤 OTP sent:', res.data);
      setOtpSent(true);
      alert('OTP sent to your email');
    } catch (err) {
      console.error('❌ Send OTP Error:', err.response?.data || err.message);
      alert('Error sending OTP');
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      console.log('✅ OTP Verified, token received:', res.data.token);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Verify OTP Error:', err.response?.data || err.message);
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">🚀 Welcome to VisuVerse</h2>

        {/* Google Login Section */}
        {!showOtpLogin && (
          <div className="flex flex-col items-center space-y-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.error('❌ Google OAuth button error');
                alert('Google login failed');
              }}
            />
            <button
              className="text-blue-400 hover:underline mt-4"
              onClick={() => setShowOtpLogin(true)}
            >
              Login with OTP instead
            </button>
          </div>
        )}

        {/* OTP Login Section */}
        {showOtpLogin && (
          <div className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-500 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {otpSent && (
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-500 rounded"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}

            {!otpSent ? (
              <button
                onClick={sendOtp}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition"
              >
                Send OTP
              </button>
            ) : (
              <button
                onClick={verifyOtp}
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded transition"
              >
                Verify OTP
              </button>
            )}

            <button
              className="text-blue-400 hover:underline mt-2"
              onClick={() => {
                setShowOtpLogin(false);
                setOtpSent(false);
                setEmail('');
                setOtp('');
              }}
            >
              Back to Google Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
