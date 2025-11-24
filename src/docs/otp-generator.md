# 🔢 OTP Generator

Generate secure one-time passwords (OTPs) with customizable length and character types.

## Usage

### Basic generation
```javascript
const { generateOTP } = require('validauth');

console.log(generateOTP()); // e.g., "1234"
console.log(generateOTP({ length: 6 })); // e.g., "567890"
console.log(generateOTP({ type: 'alphanumeric' })); // e.g., "A1B2C3"
```

### Option: `length`

Controls the length of the generated OTP code.
```javascript
// Default: 4 characters
console.log(generateOTP()); // "1234"

// Custom length
console.log(generateOTP({ length: 6 })); // "123456"
console.log(generateOTP({ length: 8 })); // "12345678"

// Short OTP for SMS
console.log(generateOTP({ length: 4 })); // "9876"

// Long OTP for high security
console.log(generateOTP({ length: 10 })); // "1234567890"
```

### Option: `type`

Controls the character set used for the OTP.
```javascript
// Default: 'numeric' (0-9)
console.log(generateOTP({ type: 'numeric' })); // "4829"

// Alphanumeric (A-Z, a-z, 0-9)
console.log(generateOTP({ type: 'alphanumeric', length: 6 })); // "A7k9Mn"
console.log(generateOTP({ type: 'alphanumeric', length: 8 })); // "Tz7wQ4pR"
```

### Option: `details`

Returns detailed information about the generated OTP.
```javascript
// Get detailed result
const result = generateOTP({ length: 6, type: 'alphanumeric', details: true });
console.log(result);
// Output:
// {
//   code: "A7k9Mn",
//   length: 6,
//   type: "alphanumeric"
// }

// Default generation with details
const defaultResult = generateOTP({ details: true });
console.log(defaultResult);
// Output:
// {
//   code: "1234",
//   length: 4,
//   type: "numeric"
// }
```

### Combining multiple options
```javascript
// High-security OTP (long alphanumeric)
const secureOTP = generateOTP({
  length: 12,
  type: 'alphanumeric',
  details: true
});
console.log(secureOTP);
// {
//   code: "Kp9mN2xL5vPr",
//   length: 12,
//   type: "alphanumeric"
// }

// Standard SMS OTP
const smsOTP = generateOTP({
  length: 6,
  type: 'numeric',
  details: false
});
console.log(smsOTP); // "482917"

// Email verification OTP
const emailOTP = generateOTP({
  length: 8,
  type: 'numeric',
  details: true
});
console.log(emailOTP);
// {
//   code: "12345678",
//   length: 8,
//   type: "numeric"
// }
```

## API

### `generateOTP(options)`

Generates an OTP code.

**Parameters:**
- `options` (object) - Generation options
  - `length` (number) - The length of the OTP code. Default: `4`
  - `type` (string) - The type of OTP code ('numeric' or 'alphanumeric'). Default: `'numeric'`
  - `details` (boolean) - Whether to return detailed information. Default: `false`

**Returns:**
- `string` - When `details: false` (default) - the generated OTP code
- `object` - When `details: true`:
```javascript
{
  code: string,
  length: number,
  type: string
}
```

## Examples

### Basic Generation
```javascript
const { generateOTP } = require('validauth');

// Simple 4-digit numeric OTP
const otp1 = generateOTP();
console.log(otp1); // "4829"

// 6-digit numeric OTP
const otp2 = generateOTP({ length: 6 });
console.log(otp2); // "123456"

// 8-character alphanumeric OTP
const otp3 = generateOTP({ length: 8, type: 'alphanumeric' });
console.log(otp3); // "A7k9Mn2x"
```

### Real-World Examples

### SMS Two-Factor Authentication
```javascript
function sendSMSOTP(phoneNumber) {
  // Generate 6-digit numeric OTP
  const otp = generateOTP({
    length: 6,
    type: 'numeric'
  });

  console.log(`Sending OTP ${otp} to ${phoneNumber}`);

  // Store OTP in database with expiration
  // sendSMS(phoneNumber, `Your verification code is: ${otp}`);

  return {
    success: true,
    otp: otp, // Don't return in production!
    expiresIn: '5 minutes'
  };
}

const result = sendSMSOTP('+1234567890');
console.log(result);
// {
//   success: true,
//   otp: "482917",
//   expiresIn: "5 minutes"
// }
```

### Email Verification
```javascript
function sendEmailVerification(email) {
  // Generate 8-digit numeric OTP for email
  const otp = generateOTP({
    length: 8,
    type: 'numeric',
    details: true
  });

  console.log(`Sending verification email to ${email}`);
  console.log(`OTP: ${otp.code}`);

  // Store OTP details in database
  // sendEmail(email, `Your verification code is: ${otp.code}`);

  return {
    success: true,
    otpLength: otp.length,
    otpType: otp.type,
    expiresIn: '10 minutes'
  };
}

const emailResult = sendEmailVerification('user@example.com');
console.log(emailResult);
// {
//   success: true,
//   otpLength: 8,
//   otpType: "numeric",
//   expiresIn: "10 minutes"
// }
```

### Account Recovery
```javascript
function initiatePasswordReset(email) {
  // Generate secure alphanumeric OTP for password reset
  const resetToken = generateOTP({
    length: 12,
    type: 'alphanumeric',
    details: true
  });

  console.log(`Password reset initiated for ${email}`);
  console.log(`Reset token: ${resetToken.code}`);

  // Store token securely
  // saveResetToken(email, resetToken.code, Date.now() + 3600000); // 1 hour

  return {
    success: true,
    tokenLength: resetToken.length,
    tokenType: resetToken.type,
    expiresIn: '1 hour'
  };
}

const resetResult = initiatePasswordReset('user@example.com');
console.log(resetResult);
// {
//   success: true,
//   tokenLength: 12,
//   tokenType: "alphanumeric",
//   expiresIn: "1 hour"
// }
```

### Admin Panel Access
```javascript
function generateAdminOTP(adminId) {
  // Generate long alphanumeric OTP for admin access
  const adminOTP = generateOTP({
    length: 16,
    type: 'alphanumeric',
    details: true
  });

  console.log(`Admin OTP generated for user ${adminId}`);
  console.log(`OTP: ${adminOTP.code}`);

  // Log admin access attempt
  // logAdminAccess(adminId, 'otp_generated', Date.now());

  return {
    otp: adminOTP.code,
    length: adminOTP.length,
    type: adminOTP.type,
    expiresIn: '15 minutes'
  };
}

const adminOTP = generateAdminOTP('admin123');
console.log(adminOTP);
// {
//   otp: "Kp9mN2xL5vPr3Tz7w",
//   length: 16,
//   type: "alphanumeric",
//   expiresIn: "15 minutes"
// }
```

### API Integration
```javascript
// Express.js endpoint
app.post('/api/generate-otp', (req, res) => {
  const { length = 6, type = 'numeric' } = req.body;

  const otp = generateOTP({
    length,
    type,
    details: true
  });

  res.json({
    otp: otp.code,
    length: otp.length,
    type: otp.type,
    generatedAt: new Date().toISOString()
  });
});

// Usage:
// POST /api/generate-otp
// Body: { "length": 8, "type": "alphanumeric" }
// Response: {
//   "otp": "A7k9Mn2x",
//   "length": 8,
//   "type": "alphanumeric",
//   "generatedAt": "2024-01-15T10:30:00.000Z"
// }
```

### Bulk OTP Generation
```javascript
function generateBulkOTPs(count = 10, options = {}) {
  const otps = [];

  for (let i = 0; i < count; i++) {
    const otp = generateOTP({ ...options, details: true });
    otps.push({
      id: i + 1,
      code: otp.code,
      length: otp.length,
      type: otp.type
    });
  }

  return otps;
}

// Generate 5 SMS OTPs
const smsOTPs = generateBulkOTPs(5, { length: 6, type: 'numeric' });
console.log(smsOTPs);
// [
//   { id: 1, code: "482917", length: 6, type: "numeric" },
//   { id: 2, code: "123456", length: 6, type: "numeric" },
//   ...
// ]
```

## Security Considerations

### ✅ Good Practices

1. **Use appropriate length** - 6+ digits for SMS, 8+ for email
2. **Choose correct type** - Numeric for SMS, alphanumeric for high security
3. **Set reasonable expiration** - 5-15 minutes for most use cases
4. **Store securely** - Hash OTPs before storing in database
5. **Rate limit generation** - Prevent abuse
6. **Use HTTPS** - Always transmit OTPs over secure connections

### Entropy Calculation

```
Numeric OTP entropy: log2(10^length)
Alphanumeric OTP entropy: log2(62^length)

Example:
- 6-digit numeric: log2(10^6) ≈ 20 bits
- 8-char alphanumeric: log2(62^8) ≈ 48 bits
- 12-char alphanumeric: log2(62^12) ≈ 72 bits (very strong)
```

### ⚠️ Important Notes

- Generated OTPs are **random** but **not cryptographically secure** with `Math.random()`
- Always hash OTPs before storing (never store plain text)
- Implement attempt limits and expiration
- Use additional security measures for high-value operations

## Character Sets

- **Numeric**: '0123456789' (10 characters)
- **Alphanumeric**: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' (62 characters)

## Performance

- **Generation time**: < 1ms for any reasonable length
- **Memory efficient**: No caching, generates on-demand
- **Randomness**: Uses `Math.random()` (consider crypto upgrade for production)

## Best Practices

### Recommended Settings

**SMS/Call verification:**
```javascript
generateOTP({
  length: 6,
  type: 'numeric',
  details: false
});
```

**Email verification:**
```javascript
generateOTP({
  length: 8,
  type: 'numeric',
  details: true
});
```

**High-security operations:**
```javascript
generateOTP({
  length: 12,
  type: 'alphanumeric',
  details: true
});
```

**Admin access:**
```javascript
generateOTP({
  length: 16,
  type: 'alphanumeric',
  details: true
});
```

## License

MIT © [Adiksuu]