# 🔍 Session Token Validation

Validate session tokens to check expiration, authenticity, and integrity.

## Usage

### Basic validation
```javascript
const { isSessionTokenValid } = require('validauth');

console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100')); // true or false
console.log(isSessionTokenValid('invalid_token')); // false
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100', { expiresIn: '30m' })); // true or false
```

### Option: `length`

Specifies the length of the random part of the token (must match generation settings).
```javascript
// Default: 32 characters
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100')); // true

// Custom length (must match how token was generated)
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100', { length: 16 })); // true

// Wrong length specification
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100', { length: 32 })); // false (timestamp extraction fails)
```

### Option: `userID`

Validates that the token is associated with a specific user.
```javascript
// Token without userID
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100')); // true

// Token with userID validation
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100user123', {
  userID: 'user123'
})); // true

// Wrong userID
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100user123', {
  userID: 'user456'
})); // false
```

### Option: `expiresIn`

Sets the expiration time for validation (must match generation settings).
```javascript
// Default: '1h'
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100')); // true (if within 1 hour)

// Custom expiration
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100', {
  expiresIn: '30m'
})); // true (if within 30 minutes)

console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100', {
  expiresIn: '24h'
})); // true (if within 24 hours)

// Supported formats: '30s', '15m', '2h', '7d'
```

### Option: `includeTimestamp`

Controls whether the token is expected to include a timestamp (must be true for validation).
```javascript
// Default: true (timestamp required)
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100')); // true

// Cannot validate without timestamp
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T', {
  includeTimestamp: false,
  details: true
}));
// Returns: { valid: false, errors: ['Token must include timestamp to validate expiration'] }
```

### Option: `details`

Returns detailed validation information instead of just true/false.
```javascript
// Get detailed result
const result = isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100', { details: true });
console.log(result);
// Output:
// {
//   valid: true,
//   errors: null,
//   token: 'A7k9Mn2xL5vPr3T1698765432100',
//   timestamp: 1698765432100,
//   expiresAt: 1698772032100,
//   remainingTime: 3600000
// }

// Expired token details
const expiredResult = isSessionTokenValid('A7k9Mn2xL5vPr3T1608765432100', { details: true });
console.log(expiredResult);
// Output:
// {
//   valid: false,
//   errors: ['Token has expired'],
//   token: 'A7k9Mn2xL5vPr3T1608765432100',
//   timestamp: 1608765432100,
//   expiresAt: 1608772032100,
//   remainingTime: -315619200000
// }
```

### Combining multiple options
```javascript
// Complete validation with all options
const validation = isSessionTokenValid('A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100user123', {
  length: 32,
  userID: 'user123',
  expiresIn: '2h',
  includeTimestamp: true,
  details: true
});
console.log(validation);
// {
//   valid: true,
//   errors: null,
//   token: 'A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#G1698765432100user123',
//   timestamp: 1698765432100,
//   expiresAt: 1698772032100,
//   remainingTime: 6600000
// }

// API token validation
const apiValidation = isSessionTokenValid('A7k9Mn2xL5vPr3Tz7wQ4pR1xBn8#GKp9mN2xL5v1698765432100api-key-1', {
  length: 64,
  userID: 'api-key-1',
  expiresIn: '24h',
  details: true
});
console.log(apiValidation);
// {
//   valid: true,
//   errors: null,
//   ...
// }
```

## API

### `isSessionTokenValid(token, options)`

Validates a session token to check if it's still valid (not expired).

**Parameters:**
- `token` (string) - The session token to validate
- `options` (object) - Validation options
  - `length` (number) - The length of the random part of the token. Default: `32`
  - `userID` (string) - The user ID associated with the session. Default: `null`
  - `expiresIn` (string) - The expiration time (e.g., '1h', '30m'). Default: `'1h'`
  - `includeTimestamp` (boolean) - Whether the token includes a timestamp. Default: `true`
  - `details` (boolean) - Whether to return detailed information. Default: `false`

**Returns:**
- `boolean` - When `details: false` (default)
- `object` - When `details: true`:
```javascript
{
  valid: boolean,
  errors: string[] | null,
  token: string,
  timestamp: number,
  expiresAt: number,
  remainingTime: number
}
```

## Examples

### Basic Validation
```javascript
const { isSessionTokenValid } = require('validauth');

// Simple validation
console.log(isSessionTokenValid('A7k9Mn2xL5vPr3T1698765432100')); // true
console.log(isSessionTokenValid('invalid_token')); // false
console.log(isSessionTokenValid('')); // false
```

### Express.js Middleware
```javascript
const { isSessionTokenValid } = require('validauth');

function authenticateSession(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const validation = isSessionTokenValid(token, {
    length: 32,
    expiresIn: '1h',
    details: true
  });

  if (!validation.valid) {
    return res.status(401).json({
      error: 'Invalid or expired token',
      details: validation.errors
    });
  }

  // Token is valid, attach user info to request
  req.user = {
    token: validation.token,
    expiresAt: validation.expiresAt,
    remainingTime: validation.remainingTime
  };

  next();
}

// Usage
app.get('/api/protected', authenticateSession, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user
  });
});
```

### Session Management
```javascript
const { generateSessionToken, isSessionTokenValid } = require('validauth');

function createAndValidateUserSession(userId) {
  // First, generate a session token
  const tokenResult = generateSessionToken({
    length: 32,
    userID: userId,
    expiresIn: '2h',
    details: true
  });

  if (tokenResult.errors) {
    throw new Error('Failed to create session: ' + tokenResult.errors.join(', '));
  }

  // Then validate the token (simulating real usage)
  const validation = isSessionTokenValid(tokenResult.token, {
    length: 32,
    userID: userId,
    expiresIn: '2h',
    details: true
  });

  if (!validation.valid) {
    return {
      valid: false,
      action: 'redirect_to_login',
      reason: validation.errors?.[0] || 'Invalid session'
    };
  }

  // Check if session needs refresh (less than 30 minutes remaining)
  const needsRefresh = validation.remainingTime < (30 * 60 * 1000);

  return {
    valid: true,
    token: tokenResult.token,
    userId: userId,
    expiresAt: validation.expiresAt,
    remainingTime: validation.remainingTime,
    needsRefresh: needsRefresh
  };
}

// Usage
const session = createAndValidateUserSession('user123');
if (session.valid) {
  console.log('Session created and valid, expires in:', Math.round(session.remainingTime / 1000 / 60), 'minutes');
  if (session.needsRefresh) {
    console.log('Consider refreshing the session');
  }
} else {
  console.log('Session invalid:', session.reason);
}
```

### API Token Validation
```javascript
const { generateSessionToken, isSessionTokenValid } = require('validauth');

function createAndValidateAPIToken(apiKeyName) {
  // Generate API token
  const tokenResult = generateSessionToken({
    length: 64,
    userID: apiKeyName,
    expiresIn: '24h',
    details: true
  });

  if (tokenResult.errors) {
    return { success: false, error: 'Failed to generate API token' };
  }

  // Validate the generated token (simulating API usage)
  const validation = isSessionTokenValid(tokenResult.token, {
    length: 64,
    userID: apiKeyName,
    expiresIn: '24h',
    details: true
  });

  if (!validation.valid) {
    return {
      valid: false,
      error: validation.errors?.[0] || 'Invalid API token',
      code: validation.errors?.includes('Token has expired') ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID'
    };
  }

  return {
    valid: true,
    token: tokenResult.token,
    apiKeyName: apiKeyName,
    expiresAt: validation.expiresAt,
    remainingTime: validation.remainingTime
  };
}

// Usage
const apiResult = createAndValidateAPIToken('my-api-key');
if (apiResult.valid) {
  console.log('API token created and valid for:', apiResult.apiKeyName);
  console.log('Token:', apiResult.token);
  console.log('Expires in:', Math.round(apiResult.remainingTime / 1000 / 60 / 60), 'hours');
} else {
  console.log('API token error:', apiResult.error);
}
```

### Password Reset Token Validation
```javascript
const { generateSessionToken, isSessionTokenValid } = require('validauth');

function createAndValidatePasswordResetToken(email) {
  // Generate reset token
  const tokenResult = generateSessionToken({
    length: 48,
    userID: email,
    expiresIn: '15m', // Short expiration for security
    details: true
  });

  if (tokenResult.errors) {
    return { success: false, error: 'Failed to generate reset token' };
  }

  // Validate the generated token (simulating reset link usage)
  const validation = isSessionTokenValid(tokenResult.token, {
    length: 48,
    userID: email,
    expiresIn: '15m',
    details: true
  });

  if (!validation.valid) {
    if (validation.errors?.includes('Token has expired')) {
      return { valid: false, error: 'Reset link has expired. Please request a new one.' };
    }
    return { valid: false, error: 'Invalid reset link.' };
  }

  // Check if token was already used (implement your own check)
  const wasUsed = checkIfResetTokenWasUsed(tokenResult.token);
  if (wasUsed) {
    return { valid: false, error: 'This reset link has already been used.' };
  }

  return {
    valid: true,
    token: tokenResult.token,
    email: email,
    expiresAt: validation.expiresAt,
    remainingTime: validation.remainingTime
  };
}

// Usage
const resetResult = createAndValidatePasswordResetToken('user@example.com');
if (resetResult.valid) {
  console.log('Reset token created and valid for:', resetResult.email);
  console.log('Reset link: https://example.com/reset-password?token=' + resetResult.token);
  console.log('Time remaining:', Math.round(resetResult.remainingTime / 1000 / 60), 'minutes');
} else {
  console.log('Reset validation failed:', resetResult.error);
}
```

### Admin Session Validation
```javascript
const { generateSessionToken, isSessionTokenValid } = require('validauth');

function createAndValidateAdminSession(adminId) {
  // Generate admin session token
  const tokenResult = generateSessionToken({
    length: 64, // Longer tokens for admin
    userID: adminId,
    expiresIn: '30m', // Shorter expiration for security
    details: true
  });

  if (tokenResult.errors) {
    return { success: false, error: 'Failed to create admin session' };
  }

  // Validate the admin token (simulating admin panel access)
  const validation = isSessionTokenValid(tokenResult.token, {
    length: 64,
    userID: adminId,
    expiresIn: '30m',
    details: true
  });

  if (!validation.valid) {
    // Log security event
    logSecurityEvent('admin_session_invalid', {
      adminId: adminId,
      reason: validation.errors?.[0],
      timestamp: new Date().toISOString()
    });

    return {
      valid: false,
      error: 'Admin session expired or invalid',
      reason: validation.errors?.[0]
    };
  }

  // Check for suspicious activity (optional)
  const isSuspicious = checkForSuspiciousActivity(adminId, validation);
  if (isSuspicious) {
    logSecurityEvent('admin_session_suspicious', { adminId, token: tokenResult.token.substring(0, 10) + '...' });
  }

  return {
    valid: true,
    token: tokenResult.token,
    adminId: adminId,
    expiresAt: validation.expiresAt,
    remainingTime: validation.remainingTime,
    warning: isSuspicious ? 'Suspicious activity detected' : null
  };
}

// Usage
const adminResult = createAndValidateAdminSession('admin123');
if (adminResult.valid) {
  console.log('Admin session created and valid');
  console.log('Token:', adminResult.token);
  if (adminResult.warning) {
    console.log('Warning:', adminResult.warning);
  }
} else {
  console.log('Admin session error:', adminResult.error);
}
```

### Token Expiration Check
```javascript
function getTokenExpirationInfo(token, options = {}) {
  const validation = isSessionTokenValid(token, {
    ...options,
    details: true
  });

  if (!validation.valid) {
    return {
      expired: true,
      reason: validation.errors?.[0] || 'Invalid token',
      timeUntilExpiration: 0
    };
  }

  const now = Date.now();
  const expired = validation.remainingTime <= 0;
  const timeUntilExpiration = Math.max(0, validation.remainingTime);

  return {
    expired,
    expiresAt: validation.expiresAt,
    timeUntilExpiration,
    timeUntilExpirationMinutes: Math.round(timeUntilExpiration / 1000 / 60),
    timeUntilExpirationHours: Math.round(timeUntilExpiration / 1000 / 60 / 60)
  };
}

// Usage
const expirationInfo = getTokenExpirationInfo('A7k9Mn2xL5vPr3T1698765432100', { expiresIn: '1h' });
console.log('Token expires in:', expirationInfo.timeUntilExpirationMinutes, 'minutes');
console.log('Expired:', expirationInfo.expired);
```

## Error Messages

When using `details: true`, you may receive the following error messages:

- `'Token must be a non-empty string'` - Token is missing, null, or not a string
- `'Token must include timestamp to validate expiration'` - includeTimestamp is false
- `'Invalid expiresIn format (use format like "1h", "30m")'` - expiresIn doesn't match expected pattern
- `'Invalid time unit in expiresIn'` - Unsupported time unit in expiresIn
- `'UserID mismatch in token'` - Token doesn't end with expected userID
- `'Invalid timestamp in token'` - Timestamp part is not a valid number
- `'Token has expired'` - Current time is past expiration time

## Security Considerations

### ✅ Good Practices

1. **Always validate server-side** - Never trust client-side validation only
2. **Use HTTPS** - Protect tokens in transit
3. **Implement token rotation** - Refresh tokens before expiration
4. **Store tokens securely** - Use httpOnly cookies or secure storage
5. **Monitor token usage** - Log validation attempts and failures
6. **Set appropriate expiration** - Balance security with user experience
7. **Validate user association** - Ensure tokens match expected users
8. **Implement rate limiting** - Prevent brute force attacks

### ⚠️ Important Notes

- **Timestamp parsing** - Assumes timestamp is exactly at position `length` in token
- **No cryptographic verification** - Only validates format and expiration
- **Time-based security** - Relies on system clock accuracy
- **No revocation mechanism** - Implement separate token blacklist if needed
- **UserID validation** - Simple string comparison at end of token

### Supported Time Formats

```
'30s' - 30 seconds
'15m' - 15 minutes
'2h'  - 2 hours
'7d'  - 7 days
```

## Best Practices

### Recommended Settings

**User sessions:**
```javascript
isSessionTokenValid(token, {
  length: 32,
  userID: userId,
  expiresIn: '1h',
  details: true
});
```

**API tokens:**
```javascript
isSessionTokenValid(token, {
  length: 64,
  userID: apiKeyName,
  expiresIn: '24h',
  details: true
});
```

**Password reset:**
```javascript
isSessionTokenValid(token, {
  length: 48,
  userID: email,
  expiresIn: '15m',
  details: true
});
```

**Admin sessions:**
```javascript
isSessionTokenValid(token, {
  length: 64,
  userID: adminId,
  expiresIn: '30m',
  details: true
});
```

## Performance

- **Validation time**: < 1ms for most tokens
- **Memory efficient**: Minimal string operations
- **No external dependencies**: Pure JavaScript implementation
- **Scalable**: Suitable for high-traffic applications

## License

MIT © [Adiksuu]