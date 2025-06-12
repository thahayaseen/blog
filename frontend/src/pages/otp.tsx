import React, { useState, useEffect } from 'react';
import { sendOTPVerification } from '../service/authservice';
import { useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
const navigate=useNavigate()
  useEffect(() => {
    // Get UID from localStorage (simulated with state since localStorage isn't available)
    // In your actual app, use: const storedUid = localStorage.getItem('uid');
    const storedUid = localStorage.getItem('uid')
    if(!storedUid){
        localStorage.removeItem('uid')
        navigate('/auth')
        return
    }
    setUid(storedUid);
  }, []);


  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) {
      setOtp(value);
      
      // Auto-submit when 6 digits entered
      if (value.length === 6) {
        setTimeout(() => verifyOTP(value), 500);
      }
    }
  };

 

  const verifyOTP = async (otpValue = otp) => {
    if (!otpValue) {
      setStatus({ message: 'Please enter the OTP', type: 'error' });
      return;
    }
    
    if (otpValue.length !== 6) {
      setStatus({ message: 'OTP must be 6 digits', type: 'error' });
      return;
    }
    
    if (!uid) {
      setStatus({ message: 'UID not found in storage', type: 'error' });
      return;
    }

    setLoading(true);
    setStatus({ message: 'Verifying OTP...', type: 'loading' });

    try {
      const result = await sendOTPVerification(uid, otpValue);
      
      if (result.success) {
        setStatus({ message: 'OTP verified successfully!', type: 'success' });
        // Handle successful verification (redirect, etc.)
        localStorage.removeItem('uid')
        setTimeout(() => {
          console.log('Verification successful, user can proceed');
          navigate('/auth')
        }, 1500);
      } else {
        setStatus({ message: result.message || 'Invalid OTP. Please try again.', type: 'error' });
      }
    } catch (error) {
      setStatus({ message: 'Verification failed. Please try again.', type: 'error' });
      console.error('OTP Verification Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!uid) {
      setStatus({ message: 'UID not found in storage', type: 'error' });
      return;
    }

    setStatus({ message: 'Resending OTP...', type: 'loading' });
    
    // Simulate resend API call
    setTimeout(() => {
      setStatus({ message: 'OTP resent successfully!', type: 'success' });
    }, 1500);
  };

  const clearStatus = () => {
    if (status.type !== 'error') {
      setTimeout(() => {
        setStatus({ message: '', type: '' });
      }, 5000);
    }
  };

  useEffect(() => {
    if (status.message) {
      clearStatus();
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-5">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white text-4xl">
          🔐
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">Verify OTP</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Enter the verification code sent to your device
        </p>
   
        
        {/* OTP Input */}
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
          maxLength={6}
          autoComplete="one-time-code"
          disabled={loading}
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg text-center tracking-widest font-semibold mb-6 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50"
        />
        
        {/* Verify Button */}
        <button
          onClick={() => verifyOTP()}
          disabled={loading || !otp}
          className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold mb-4 hover:-translate-y-1 hover:shadow-lg transition-all disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        
        {/* Resend Button */}
        <button
          onClick={resendOTP}
          className="text-blue-500 underline text-sm hover:text-purple-600 transition-colors"
        >
          Didn't receive code? Resend
        </button>
        
        {/* Status Message */}
        {status.message && (
          <div className={`p-3 rounded-lg mt-4 font-medium ${
            status.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : status.type === 'error'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {status.message}
          </div>
        )}
        

      </div>
    </div>
  );
};

export default OTPVerification;