const e=`# 🔐 OTP Validation

Validate one-time passwords with attempt tracking, security checks, and detailed error reporting.

## Usage

### Basic validation
\`\`\`javascript
const { validateOTP } = require('validauth');

console.log(validateOTP('1234', '1234')); // true
console.log(validateOTP('1234', '5678')); // false
console.log(validateOTP('1234', '1234', { attempts: 3, maxAttempts: 5 })); // true
\`\`\`

### Option: \`attempts\`

Tracks the number of validation attempts made.
\`\`\`javascript
// First attempt
console.log(validateOTP('1234', '1234', { attempts: 1, maxAttempts: 3 })); // true

// Multiple attempts
console.log(validateOTP('1234', '5678', { attempts: 2, maxAttempts: 3 })); // false

// Exceeded attempts
console.log(validateOTP('1234', '1234', { attempts: 4, maxAttempts: 3 })); // false
\`\`\`

### Option: \`maxAttempts\`

Sets the maximum number of allowed attempts.
\`\`\`javascript
// Default: 3 attempts
console.log(validateOTP('1234', '1234', { attempts: 1 })); // true

// Custom max attempts
console.log(validateOTP('1234', '1234', { attempts: 2, maxAttempts: 5 })); // true

// Invalid max attempts
console.log(validateOTP('1234', '1234', { attempts: 1, maxAttempts: 0, details: true }));
// Returns: { valid: false, errors: ['Max attempts must be greater than 0.'] }
\`\`\`

### Option: \`details\`

Returns detailed validation information instead of just true/false.
\`\`\`javascript
// Get detailed result
const result = validateOTP('1234', '5678', { details: true });
console.log(result);
// Output:
// {
//   valid: false,
//   errors: ['Invalid OTP.'],
//   otp: '1234',
//   correctOTP: '5678',
//   attempts: undefined,
//   remainingAttempts: 3,
//   maxAttempts: 3
// }

// Valid OTP with details
const validResult = validateOTP('1234', '1234', {
  attempts: 1,
  maxAttempts: 3,
  details: true
});
console.log(validResult);
// Output:
// {
//   valid: true,
//   errors: null,
//   otp: '1234',
//   correctOTP: '1234',
//   attempts: 1,
//   remainingAttempts: 2,
//   maxAttempts: 3
// }
\`\`\`

### Combining multiple options
\`\`\`javascript
// Complete validation with attempt tracking
const result = validateOTP('123456', '123456', {
  attempts: 2,
  maxAttempts: 5,
  details: true
});
console.log(result);
// {
//   valid: true,
//   errors: null,
//   otp: '123456',
//   correctOTP: '123456',
//   attempts: 2,
//   remainingAttempts: 3,
//   maxAttempts: 5
// }

// Invalid OTP with exceeded attempts
const failedResult = validateOTP('wrong', 'correct', {
  attempts: 4,
  maxAttempts: 3,
  details: true
});
console.log(failedResult);
// {
//   valid: false,
//   errors: ['Invalid OTP.', 'Max attempts exceeded.'],
//   otp: 'wrong',
//   correctOTP: 'correct',
//   attempts: 4,
//   remainingAttempts: -1,
//   maxAttempts: 3
// }
\`\`\`

## API

### \`validateOTP(otp, correctOTP, options)\`

Validates an OTP code.

**Parameters:**
- \`otp\` (string) - The OTP code to validate
- \`correctOTP\` (string) - The correct OTP code
- \`options\` (object) - Validation options
  - \`attempts\` (number) - The number of attempts made. Default: \`undefined\`
  - \`maxAttempts\` (number) - The maximum number of attempts allowed. Default: \`3\`
  - \`details\` (boolean) - Whether to return detailed information. Default: \`false\`

**Returns:**
- \`boolean\` - When \`details: false\` (default)
- \`object\` - When \`details: true\`:
\`\`\`javascript
{
  valid: boolean,
  errors: string[] | null,
  otp: string,
  correctOTP: string,
  attempts: number | undefined,
  remainingAttempts: number,
  maxAttempts: number
}
\`\`\`

## Examples

### Basic Validation
\`\`\`javascript
const { validateOTP } = require('validauth');

// Simple validation
console.log(validateOTP('1234', '1234')); // true
console.log(validateOTP('1234', '5678')); // false

// Case sensitive
console.log(validateOTP('ABCD', 'abcd')); // false

// Empty strings
console.log(validateOTP('', '')); // true
console.log(validateOTP('', '1234')); // false
\`\`\`

### Attempt Tracking
\`\`\`javascript
// Track login attempts
let attempts = 0;
const maxAttempts = 3;
const correctOTP = '482917';

function validateLoginOTP(userOTP) {
  attempts++;

  const result = validateOTP(userOTP, correctOTP, {
    attempts: attempts,
    maxAttempts: maxAttempts,
    details: true
  });

  if (!result.valid) {
    if (result.errors.includes('Max attempts exceeded.')) {
      console.log('Account locked due to too many failed attempts');
      return { success: false, locked: true };
    }
    console.log('Invalid OTP. Attempts remaining:', result.remainingAttempts);
    return { success: false, remainingAttempts: result.remainingAttempts };
  }

  console.log('Login successful!');
  return { success: true };
}

// Usage
console.log(validateLoginOTP('123456')); // Invalid, 2 remaining
console.log(validateLoginOTP('482917')); // Success
\`\`\`

### Real-World Examples

### Two-Factor Authentication Login
\`\`\`javascript
function validate2FALogin(userId, userOTP) {
  // Get stored OTP and attempt count from database
  const storedData = getUserOTPData(userId); // { otp: '482917', attempts: 1, expiresAt: timestamp }

  if (!storedData) {
    return { valid: false, error: 'No active OTP session' };
  }

  // Check expiration
  if (Date.now() > storedData.expiresAt) {
    return { valid: false, error: 'OTP expired' };
  }

  // Validate OTP with attempt tracking
  const result = validateOTP(userOTP, storedData.otp, {
    attempts: storedData.attempts + 1,
    maxAttempts: 3,
    details: true
  });

  // Update attempt count
  updateUserAttempts(userId, result.attempts);

  if (!result.valid) {
    if (result.errors.includes('Max attempts exceeded.')) {
      // Lock account or require new OTP
      lockUserAccount(userId);
      return { valid: false, error: 'Too many failed attempts. Account locked.' };
    }
    return {
      valid: false,
      error: 'Invalid OTP',
      remainingAttempts: result.remainingAttempts
    };
  }

  // Clear OTP on successful validation
  clearUserOTP(userId);
  return { valid: true, message: 'Login successful' };
}

const loginResult = validate2FALogin('user123', '482917');
console.log(loginResult); // { valid: true, message: 'Login successful' }
\`\`\`

### Password Reset Verification
\`\`\`javascript
function validatePasswordResetOTP(email, userOTP) {
  // Get reset token data
  const resetData = getPasswordResetData(email);

  if (!resetData) {
    return { valid: false, error: 'No active reset request' };
  }

  // Check if expired
  if (Date.now() > resetData.expiresAt) {
    return { valid: false, error: 'Reset link expired' };
  }

  // Validate OTP
  const result = validateOTP(userOTP, resetData.otp, {
    attempts: resetData.attempts + 1,
    maxAttempts: 5, // More attempts for password reset
    details: true
  });

  // Update attempts
  updateResetAttempts(email, result.attempts);

  if (!result.valid) {
    if (result.errors.includes('Max attempts exceeded.')) {
      // Clear reset request
      clearPasswordReset(email);
      return { valid: false, error: 'Too many failed attempts. Request a new reset.' };
    }
    return {
      valid: false,
      error: 'Invalid reset code',
      remainingAttempts: result.remainingAttempts
    };
  }

  // Mark as verified, allow password change
  markResetVerified(email);
  return { valid: true, message: 'Reset code verified' };
}

const resetResult = validatePasswordResetOTP('user@example.com', '123456');
console.log(resetResult); // { valid: true, message: 'Reset code verified' }
\`\`\`

### Admin Panel Access
\`\`\`javascript
function validateAdminOTP(adminId, userOTP) {
  const adminData = getAdminOTPData(adminId);

  // Strict validation for admin access
  const result = validateOTP(userOTP, adminData.otp, {
    attempts: adminData.attempts + 1,
    maxAttempts: 3, // Fewer attempts for admin
    details: true
  });

  // Log all admin OTP attempts
  logAdminAttempt(adminId, result.valid, result.attempts);

  if (!result.valid) {
    if (result.errors.includes('Max attempts exceeded.')) {
      // Alert security team
      alertSecurityTeam(\`Admin \${adminId} exceeded OTP attempts\`);
      return { valid: false, error: 'Access denied. Security alerted.' };
    }
    return {
      valid: false,
      error: 'Invalid admin code',
      remainingAttempts: result.remainingAttempts
    };
  }

  // Grant admin access
  grantAdminAccess(adminId);
  return { valid: true, message: 'Admin access granted' };
}

const adminResult = validateAdminOTP('admin123', '482917');
console.log(adminResult); // { valid: true, message: 'Admin access granted' }
\`\`\`

### API Rate Limiting Integration
\`\`\`javascript
// Express.js middleware
function otpValidationMiddleware(req, res, next) {
  const { otp } = req.body;
  const userId = req.user.id;

  // Get user OTP data (implement caching for performance)
  const otpData = getUserOTPData(userId);

  const result = validateOTP(otp, otpData.correctOTP, {
    attempts: otpData.attempts + 1,
    maxAttempts: 3,
    details: true
  });

  // Update attempts in cache/database
  updateOTPAttempts(userId, result.attempts);

  if (!result.valid) {
    // Rate limiting: slow down responses on failures
    const delay = Math.min(result.attempts * 1000, 5000); // Max 5 second delay

    setTimeout(() => {
      res.status(401).json({
        error: 'Invalid OTP',
        remainingAttempts: Math.max(0, result.remainingAttempts),
        details: result.errors
      });
    }, delay);
    return;
  }

  // Success - clear OTP and proceed
  clearUserOTP(userId);
  req.otpValidated = true;
  next();
}

app.post('/api/verify-otp', otpValidationMiddleware, (req, res) => {
  res.json({ message: 'OTP verified successfully' });
});
\`\`\`

### Mobile App OTP Verification
\`\`\`javascript
function verifyMobileOTP(phoneNumber, userOTP) {
  const otpData = getSMSOTPData(phoneNumber);

  // Mobile OTPs often have shorter validity
  if (Date.now() > otpData.expiresAt) {
    return { valid: false, error: 'OTP expired. Request a new one.' };
  }

  const result = validateOTP(userOTP, otpData.otp, {
    attempts: otpData.attempts + 1,
    maxAttempts: 3,
    details: true
  });

  updateSMSAttempts(phoneNumber, result.attempts);

  if (!result.valid) {
    if (result.errors.includes('Max attempts exceeded.')) {
      // Block SMS sending for a period
      blockSMSSending(phoneNumber, 3600000); // 1 hour
      return { valid: false, error: 'Too many attempts. Try again later.' };
    }
    return {
      valid: false,
      error: 'Invalid code',
      remainingAttempts: result.remainingAttempts
    };
  }

  // Verification successful
  completePhoneVerification(phoneNumber);
  return { valid: true, message: 'Phone number verified' };
}

const mobileResult = verifyMobileOTP('+1234567890', '482917');
console.log(mobileResult); // { valid: true, message: 'Phone number verified' }
\`\`\`

## Error Messages

When using \`details: true\`, you may receive the following error messages:

- \`'Max attempts must be greater than 0.'\` - Invalid maxAttempts value
- \`'Invalid OTP.'\` - The provided OTP doesn't match the correct one
- \`'Max attempts exceeded.'\` - Too many failed attempts

## Security Considerations

### ✅ Good Practices

1. **Always track attempts** - Prevent brute force attacks
2. **Set reasonable limits** - 3-5 attempts for most use cases
3. **Implement expiration** - OTPs should expire after 5-15 minutes
4. **Use secure storage** - Hash OTPs in database
5. **Rate limit requests** - Prevent rapid guessing
6. **Log security events** - Track failed attempts
7. **Clear on success** - Remove OTP after successful validation

### ⚠️ Important Notes

- **Never store OTPs in plain text** - Always hash before database storage
- **Implement time-based expiration** - Don't rely only on attempt limits
- **Use HTTPS** - Protect OTP transmission
- **Consider device fingerprinting** - Additional security for high-value operations
- **Monitor for patterns** - Detect potential attacks

## Best Practices

### Recommended Settings

**Standard 2FA:**
\`\`\`javascript
validateOTP(userOTP, correctOTP, {
  attempts: currentAttempts + 1,
  maxAttempts: 3,
  details: true
});
\`\`\`

**Password reset (more lenient):**
\`\`\`javascript
validateOTP(userOTP, correctOTP, {
  attempts: currentAttempts + 1,
  maxAttempts: 5,
  details: true
});
\`\`\`

**Admin access (stricter):**
\`\`\`javascript
validateOTP(userOTP, correctOTP, {
  attempts: currentAttempts + 1,
  maxAttempts: 3,
  details: true
});
\`\`\`

## Performance

- **Validation time**: < 1ms for string comparison
- **Memory efficient**: Minimal object creation
- **No external dependencies**: Pure JavaScript implementation

## License

MIT © [Adiksuu]`;export{e as default};
