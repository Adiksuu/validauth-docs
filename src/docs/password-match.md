# 🔄 Password Match Validation

Compares two passwords to ensure they match, commonly used for "confirm password" fields in registration forms.

## Basic Usage
```javascript
const { isPasswordMatch } = require('validauth');

// Simple comparison
console.log(isPasswordMatch('MyP@ssw0rd123', 'MyP@ssw0rd123')); // true
console.log(isPasswordMatch('Password1', 'Password2')); // false
```

## API

### `isPasswordMatch(password, confirmPassword, options)`

Validates that two passwords are identical.

**Parameters:**
- `password` (string) - The original password
- `confirmPassword` (string) - The confirmation password
- `options` (object) - Optional validation options
  - `details` (boolean) - Return detailed validation result. Default: `false`

**Returns:** 
- `boolean` - When `details: false` (default)
- `object` - When `details: true`:
```javascript
  {
    match: boolean,
    errors: string[] | null
  }
```

## Examples

### Basic Comparison
```javascript
const { isPasswordMatch } = require('validauth');

// Passwords match
console.log(isPasswordMatch('MyPassword123!', 'MyPassword123!')); 
// Output: true

// Passwords don't match
console.log(isPasswordMatch('Password1', 'Password2')); 
// Output: false

// Empty passwords
console.log(isPasswordMatch('', '')); 
// Output: true (both are empty strings)

// Case sensitive
console.log(isPasswordMatch('Password', 'password')); 
// Output: false
```

### Option: `details`

Get detailed information about the validation result.
```javascript
// Matching passwords with details
const result1 = isPasswordMatch('MyPassword123!', 'MyPassword123!', { 
  details: true 
});
console.log(result1);
// Output:
// {
//   match: true,
//   errors: null
// }

// Non-matching passwords with details
const result2 = isPasswordMatch('Password1', 'Password2', { 
  details: true 
});
console.log(result2);
// Output:
// {
//   match: false,
//   errors: ['Passwords do not match']
// }

// Invalid input (non-string)
const result3 = isPasswordMatch(123, 'password', { 
  details: true 
});
console.log(result3);
// Output:
// {
//   match: false,
//   errors: ['Both passwords must be strings']
// }
```

## Real-World Examples

### Registration Form
```javascript
const { isPasswordMatch, isPassword } = require('validauth');

function validateRegistrationForm(data) {
  const errors = {};
  
  // Validate password strength
  const passwordResult = isPassword(data.password, {
    minLength: 8,
    requireSymbols: true,
    details: true
  });
  
  if (!passwordResult.valid) {
    errors.password = passwordResult.errors;
  }
  
  // Check if passwords match
  const matchResult = isPasswordMatch(
    data.password, 
    data.confirmPassword, 
    { details: true }
  );
  
  if (!matchResult.match) {
    errors.confirmPassword = matchResult.errors;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Usage
const result = validateRegistrationForm({
  password: 'MyP@ssw0rd123',
  confirmPassword: 'MyP@ssw0rd456'
});

console.log(result);
// Output:
// {
//   valid: false,
//   errors: {
//     confirmPassword: ['Passwords do not match']
//   }
// }
```

### Password Change Form
```javascript
function validatePasswordChange(oldPassword, newPassword, confirmNewPassword) {
  // Check if new password is different from old
  if (oldPassword === newPassword) {
    return {
      valid: false,
      error: 'New password must be different from old password'
    };
  }
  
  // Validate new password strength
  const strengthResult = isPassword(newPassword, {
    minLength: 10,
    requireSymbols: true,
    details: true
  });
  
  if (!strengthResult.valid) {
    return {
      valid: false,
      error: strengthResult.errors[0]
    };
  }
  
  // Check if new passwords match
  const matchResult = isPasswordMatch(newPassword, confirmNewPassword, {
    details: true
  });
  
  if (!matchResult.match) {
    return {
      valid: false,
      error: matchResult.errors[0]
    };
  }
  
  return { valid: true };
}

// Usage
const result = validatePasswordChange(
  'OldP@ssw0rd',
  'NewP@ssw0rd123',
  'NewP@ssw0rd123'
);

console.log(result); // { valid: true }
```

### React Form Example
```javascript
import { useState } from 'react';
import { isPasswordMatch } from 'validauth';

function RegistrationForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const result = isPasswordMatch(password, confirmPassword, { 
      details: true 
    });
    
    if (!result.match) {
      setError(result.errors[0]);
      return;
    }
    
    // Proceed with registration
    console.log('Passwords match! Proceeding...');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
}
```

### Express.js Middleware
```javascript
const { isPasswordMatch, isPassword } = require('validauth');

function validatePasswordsMiddleware(req, res, next) {
  const { password, confirmPassword } = req.body;
  
  // First check password strength
  const strengthResult = isPassword(password, {
    minLength: 8,
    requireSymbols: true,
    details: true
  });
  
  if (!strengthResult.valid) {
    return res.status(400).json({
      error: 'Invalid password',
      details: strengthResult.errors
    });
  }
  
  // Then check if passwords match
  const matchResult = isPasswordMatch(password, confirmPassword, {
    details: true
  });
  
  if (!matchResult.match) {
    return res.status(400).json({
      error: 'Password confirmation failed',
      details: matchResult.errors
    });
  }
  
  next();
}

// Usage
app.post('/register', validatePasswordsMiddleware, (req, res) => {
  // Password is valid and confirmed
  res.json({ message: 'Registration successful' });
});
```

### Real-time Validation
```javascript
function validatePasswordsRealtime(password, confirmPassword) {
  // Only validate if both fields have content
  if (!password || !confirmPassword) {
    return { show: false };
  }
  
  const result = isPasswordMatch(password, confirmPassword, {
    details: true
  });
  
  return {
    show: true,
    match: result.match,
    message: result.match 
      ? '✓ Passwords match' 
      : '✗ Passwords do not match'
  };
}

// Usage in a form
const feedback = validatePasswordsRealtime('Pass123!', 'Pass123');
if (feedback.show) {
  console.log(feedback.message); // "✗ Passwords do not match"
}
```

## Error Messages

When using `details: true`, you may receive the following error messages:

- `'Both passwords must be strings'` - One or both inputs are not strings
- `'Passwords do not match'` - The passwords are different

## Best Practices

### ✅ Recommended

1. **Always validate password strength first** before checking match
2. **Show real-time feedback** as user types in confirm field
3. **Clear error messages** when user starts typing again
4. **Use details mode** for better user feedback
5. **Server-side validation** - Never trust client-side only

### Example: Complete Validation Flow
```javascript
function completePasswordValidation(password, confirmPassword) {
  // Step 1: Validate password strength
  const strengthResult = isPassword(password, {
    minLength: 8,
    requireSymbols: true,
    forbidCommonPasswords: true,
    details: true
  });
  
  if (!strengthResult.valid) {
    return {
      valid: false,
      field: 'password',
      errors: strengthResult.errors
    };
  }
  
  // Step 2: Check if passwords match
  const matchResult = isPasswordMatch(password, confirmPassword, {
    details: true
  });
  
  if (!matchResult.match) {
    return {
      valid: false,
      field: 'confirmPassword',
      errors: matchResult.errors
    };
  }
  
  return { valid: true };
}
```

### ❌ Not Recommended
```javascript
// DON'T: Check match before validating strength
if (isPasswordMatch(password, confirmPassword)) {
  // User could confirm a weak password
  if (isPassword(password)) {
    // proceed
  }
}

// DO: Validate strength first
if (isPassword(password, { minLength: 8 })) {
  if (isPasswordMatch(password, confirmPassword)) {
    // proceed
  }
}
```

## Performance

- **Instant validation**: Simple string comparison, < 0.1ms
- **No overhead**: No regex, no complex operations
- **Memory efficient**: No data structures needed

## Common Use Cases

1. **Registration Forms** - Primary use case
2. **Password Change Forms** - Change password flow
3. **Password Reset** - Reset password with confirmation
4. **Account Settings** - Update password section
5. **Admin Panels** - Create user with password

## Combining with Other Validators
```javascript
const { isEmail, isPassword, isPasswordMatch, isUsername } = require('validauth');

function validateCompleteForm(data) {
  return {
    email: isEmail(data.email, { details: true }),
    password: isPassword(data.password, { 
      minLength: 8, 
      details: true 
    }),
    confirmPassword: isPasswordMatch(
      data.password, 
      data.confirmPassword, 
      { details: true }
    ),
    username: isUsername(data.username, { details: true })
  };
}
```

## License

MIT © [Adiksuu]