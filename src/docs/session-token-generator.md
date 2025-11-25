# 🔐 Session Token Generator

Generate secure session tokens with customizable options for authentication and session management.

## Usage

### Basic generation
```javascript
const { generateSessionToken } = require('validauth');

console.log(generateSessionToken()); // e.g., "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100"
console.log(generateSessionToken({ length: 16 })); // e.g., "A7k9Mn2xL5vPr3T1698765432100"
console.log(generateSessionToken({ userID: 'user123' })); // e.g., "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100user123"
```

### Option: `length`

Controls the length of the random token part (excluding timestamp and userID).
```javascript
// Default: 32 characters
console.log(generateSessionToken()); // 32 random chars + timestamp + userID

// Custom length
console.log(generateSessionToken({ length: 16 })); // 16 random chars + timestamp + userID

// Minimum length (16)
console.log(generateSessionToken({ length: 8 })); // Returns error if details: true

// Long token
console.log(generateSessionToken({ length: 64 })); // 64 random chars + timestamp + userID
```

### Option: `userID`

Associates the token with a specific user.
```javascript
// Without userID (default: null)
const token1 = generateSessionToken();
console.log(token1); // "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100"

// With userID
const token2 = generateSessionToken({ userID: 'user123' });
console.log(token2); // "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100user123"

// With userID and custom length
const token3 = generateSessionToken({ length: 24, userID: 'admin' });
console.log(token3); // "A7k9Mn2xL5vPr3Tz7wQ4p1698765432100admin"
```

### Option: `expiresIn`

Sets the intended expiration time (stored as metadata, actual expiration should be handled by your session management).
```javascript
// Default: '1h'
const token1 = generateSessionToken({ details: true });
// expiresIn: '1h'

// Custom expiration
const token2 = generateSessionToken({ expiresIn: '24h', details: true });
// expiresIn: '24h'

const token3 = generateSessionToken({ expiresIn: '30m', details: true });
// expiresIn: '30m'

const token4 = generateSessionToken({ expiresIn: '7d', details: true });
// expiresIn: '7d'
```

### Option: `includeTimestamp`

Controls whether to include a timestamp in the token.
```javascript
// Default: true (includes timestamp)
const token1 = generateSessionToken();
console.log(token1); // "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100"

// Without timestamp
const token2 = generateSessionToken({ includeTimestamp: false });
console.log(token2); // "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G"

// With timestamp and userID
const token3 = generateSessionToken({ includeTimestamp: true, userID: 'user123' });
console.log(token3); // "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100user123"
```

### Option: `details`

Returns detailed information about the generated token.
```javascript
// Get detailed result
const result = generateSessionToken({ length: 24, userID: 'user123', details: true });
console.log(result);
// Output:
// {
//   token: "A7k9Mn2xL5vPr3Tz7wQ4p1698765432100user123",
//   userID: "user123",
//   expiresIn: "1h",
//   length: 53,
//   timestamp: 1698765432100,
//   errors: null
// }

// Error case
const errorResult = generateSessionToken({ length: 8, details: true });
console.log(errorResult);
// Output:
// {
//   token: "",
//   errors: ["Token length should be at least 16 characters."]
// }
```

### Combining multiple options
```javascript
// Complete session token for user authentication
const sessionToken = generateSessionToken({
  length: 32,
  userID: 'user456',
  expiresIn: '2h',
  includeTimestamp: true,
  details: true
});
console.log(sessionToken);
// {
//   token: "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100user456",
//   userID: "user456",
//   expiresIn: "2h",
//   length: 53,
//   timestamp: 1698765432100,
//   errors: null
// }

// API token without user association
const apiToken = generateSessionToken({
  length: 64,
  userID: null,
  expiresIn: '24h',
  includeTimestamp: true,
  details: false
});
console.log(apiToken); // "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#GKp9mN2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100"

// Temporary token for password reset
const resetToken = generateSessionToken({
  length: 48,
  userID: 'reset_user@example.com',
  expiresIn: '15m',
  includeTimestamp: true,
  details: true
});
console.log(resetToken);
// {
//   token: "A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#GKp9mN2xL5v1698765432100reset_user@example.com",
//   userID: "reset_user@example.com",
//   expiresIn: "15m",
//   length: 85,
//   timestamp: 1698765432100,
//   errors: null
// }
```

## API

### `generateSessionToken(options)`

Generates a secure session token.

**Parameters:**
- `options` (object) - Generation options
  - `length` (number) - The length of the random token part. Default: `32`
  - `userID` (string) - The user ID associated with the session. Default: `null`
  - `expiresIn` (string) - The expiration time for the session token. Default: `'1h'`
  - `includeTimestamp` (boolean) - Whether to include a timestamp. Default: `true`
  - `details` (boolean) - Whether to return detailed information. Default: `false`

**Returns:**
- `string` - When `details: false` (default) - the generated session token
- `object` - When `details: true`:
```javascript
{
  token: string,
  userID: string | null,
  expiresIn: string,
  length: number,
  timestamp: number | null,
  errors: string[] | null
}
```

## Examples

### Basic Generation
```javascript
const { generateSessionToken } = require('validauth');

// Simple session token
const token1 = generateSessionToken();
console.log('Session token:', token1);

// Custom length
const token2 = generateSessionToken({ length: 48 });
console.log('Long token:', token2);

// With user association
const token3 = generateSessionToken({ userID: 'user123' });
console.log('User token:', token3);
```

### User Authentication Session
```javascript
function createUserSession(userId, sessionDuration = '1h') {
  const sessionToken = generateSessionToken({
    length: 32,
    userID: userId,
    expiresIn: sessionDuration,
    includeTimestamp: true,
    details: true
  });

  if (sessionToken.errors) {
    throw new Error('Failed to generate session token: ' + sessionToken.errors.join(', '));
  }

  // Store session in database/cache
  const sessionData = {
    token: sessionToken.token,
    userId: sessionToken.userID,
    expiresAt: calculateExpiry(sessionToken.timestamp, sessionToken.expiresIn),
    createdAt: new Date(sessionToken.timestamp)
  };

  saveSession(sessionData);

  return {
    token: sessionToken.token,
    expiresIn: sessionToken.expiresIn,
    userId: sessionToken.userID
  };
}

// Usage
const session = createUserSession('user456', '2h');
console.log('New session created:', session);
```

### API Token Generation
```javascript
function generateAPIToken(apiKeyName, expiration = '24h') {
  const apiToken = generateSessionToken({
    length: 64,
    userID: apiKeyName, // Use name as identifier
    expiresIn: expiration,
    includeTimestamp: true,
    details: true
  });

  if (apiToken.errors) {
    return { success: false, error: apiToken.errors[0] };
  }

  // Store API token securely
  const tokenData = {
    name: apiKeyName,
    token: apiToken.token,
    hashedToken: hashToken(apiToken.token), // Store hash for verification
    expiresAt: calculateExpiry(apiToken.timestamp, apiToken.expiresIn),
    permissions: ['read', 'write'] // Example permissions
  };

  saveAPIToken(tokenData);

  return {
    success: true,
    token: apiToken.token, // Return plain token only once
    name: apiKeyName,
    expiresIn: apiToken.expiresIn
  };
}

// Usage
const apiResult = generateAPIToken('my-api-key', '7d');
if (apiResult.success) {
  console.log('API token created:', apiResult.token);
  console.log('Keep this token secure!');
} else {
  console.log('Error:', apiResult.error);
}
```

### Password Reset Token
```javascript
function generatePasswordResetToken(email) {
  const resetToken = generateSessionToken({
    length: 48,
    userID: email,
    expiresIn: '15m', // Short expiration for security
    includeTimestamp: true,
    details: true
  });

  if (resetToken.errors) {
    throw new Error('Failed to generate reset token');
  }

  // Store reset token (hashed)
  const resetData = {
    email: email,
    tokenHash: hashToken(resetToken.token),
    expiresAt: calculateExpiry(resetToken.timestamp, resetToken.expiresIn),
    used: false
  };

  savePasswordResetToken(resetData);

  // Send email with reset link
  const resetLink = `https://example.com/reset-password?token=${resetToken.token}`;
  sendResetEmail(email, resetLink);

  return {
    success: true,
    email: email,
    expiresIn: resetToken.expiresIn
  };
}

// Usage
const reset = generatePasswordResetToken('user@example.com');
console.log('Password reset email sent to:', reset.email);
```

### Admin Session Token
```javascript
function createAdminSession(adminId) {
  // Generate extra secure token for admin
  const adminToken = generateSessionToken({
    length: 64, // Longer for admin sessions
    userID: adminId,
    expiresIn: '30m', // Shorter expiration for security
    includeTimestamp: true,
    details: true
  });

  if (adminToken.errors) {
    return { success: false, error: adminToken.errors[0] };
  }

  // Log admin session creation
  logAdminAction(adminId, 'session_created', {
    tokenLength: adminToken.length,
    expiresIn: adminToken.expiresIn
  });

  // Store admin session with additional security
  const sessionData = {
    token: adminToken.token,
    adminId: adminToken.userID,
    expiresAt: calculateExpiry(adminToken.timestamp, adminToken.expiresIn),
    ipAddress: getClientIP(),
    userAgent: getUserAgent(),
    permissions: ['full_access']
  };

  saveAdminSession(sessionData);

  return {
    success: true,
    token: adminToken.token,
    adminId: adminToken.userID,
    expiresIn: adminToken.expiresIn
  };
}

// Usage
const adminSession = createAdminSession('admin123');
if (adminSession.success) {
  console.log('Admin session created for:', adminSession.adminId);
}
```

### Token Validation Helper
```javascript
function validateSessionTokenFormat(token) {
  // Basic format validation
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Invalid token format' };
  }

  // Check minimum length (random part + timestamp)
  if (token.length < 16) {
    return { valid: false, error: 'Token too short' };
  }

  // Parse token components (this is a simplified example)
  // In real implementation, you'd decode the token properly
  const hasTimestamp = /\d{13}/.test(token); // Check for 13-digit timestamp

  return {
    valid: true,
    hasTimestamp: hasTimestamp,
    length: token.length
  };
}

// Usage
const validation = validateSessionTokenFormat('A7k9Mn2xL5vPr3T1698765432100user123');
console.log(validation);
// { valid: true, hasTimestamp: true, length: 53 }
```

## Error Messages

When using `details: true`, you may receive the following error messages:

- `'Token length should be at least 16 characters.'` - When length parameter is less than 16

## Security Considerations

### ✅ Good Practices

1. **Use appropriate length** - Minimum 32 characters for session tokens
2. **Always include timestamp** - Helps with token uniqueness and expiration
3. **Associate with user ID** - Makes tokens user-specific
4. **Set reasonable expiration** - 1-24 hours for sessions, 15-30 minutes for sensitive operations
5. **Store hashed tokens** - Never store plain tokens in database
6. **Use HTTPS** - Protect token transmission
7. **Implement token rotation** - Refresh tokens periodically
8. **Monitor token usage** - Log suspicious activity

### ⚠️ Important Notes

- **Not cryptographically secure** - Uses `Math.random()` (consider upgrading to `crypto.getRandomValues()`)
- **No built-in expiration** - Expiration metadata is informational, implement actual expiration logic
- **Token format is predictable** - Consider encrypting or using JWT for production
- **No built-in revocation** - Implement token blacklist for compromised tokens

### Entropy Calculation

```
Session token entropy = log2(62^length) + timestamp_entropy + userID_entropy

Example with defaults (length=32, timestamp, userID):
- Random part: log2(62^32) ≈ 190 bits
- Timestamp: ~40 bits (milliseconds since epoch)
- UserID: variable (depends on userID format)
- Total: ~230+ bits (very strong)
```

## Character Set

The generator uses the following character set:
```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
```
(62 characters total)

## Best Practices

### Recommended Settings

**User sessions:**
```javascript
generateSessionToken({
  length: 32,
  userID: userId,
  expiresIn: '1h',
  includeTimestamp: true,
  details: true
});
```

**API tokens:**
```javascript
generateSessionToken({
  length: 64,
  userID: apiKeyName,
  expiresIn: '24h',
  includeTimestamp: true,
  details: true
});
```

**Password reset:**
```javascript
generateSessionToken({
  length: 48,
  userID: email,
  expiresIn: '15m',
  includeTimestamp: true,
  details: true
});
```

**Admin sessions:**
```javascript
generateSessionToken({
  length: 64,
  userID: adminId,
  expiresIn: '30m',
  includeTimestamp: true,
  details: true
});
```

## Performance

- **Generation time**: < 1ms for any reasonable length
- **Memory efficient**: Minimal object creation
- **Scalable**: No external dependencies
- **Randomness**: Uses `Math.random()` (consider crypto upgrade for production)

## License

MIT © [Adiksuu]