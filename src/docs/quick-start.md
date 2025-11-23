# 🚀 Quick Start

### 🔜 Coming Soon

- 📱 **Phone Number Validation** - International format support
- 🔢 **PIN/OTP Validation** - Verification code validation
- 🔄 **Password Match** - Compare password and confirm password
- 🧹 **Sanitizers** - Clean and format input data
- 🛡️ **Breach Detection** - Check against Have I Been Pwned database
- 📝 **TypeScript Definitions** - Full TypeScript support
- ⚛️ **React Hooks** - Easy integration with React
- 🎨 **Vue Composables** - Vue 3 integration
- 🚂 **Framework Integrations** - Express, Fastify middleware

## Project Status

validauth is actively developed and maintained. We're working on adding more validators and features based on community feedback.

**Current version:** 1.2.1  
**Status:** ✅ Stable

### Roadmap

- [x] Email validation
- [x] Password validation
- [x] Password strength calculator
- [x] Username validation
- [ ] Phone number validation
- [ ] PIN/OTP validation
- [ ] Password match validator
- [ ] Sanitizers and formatters
- [ ] TypeScript definitions
- [ ] React hooks
- [ ] Vue composables
- [ ] Framework integrations (Express, Fastify)
- [ ] Breach detection (Have I Been Pwned)

## Contributing

Contributions are welcome! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements
- 🔧 Code contributions

### Development Setup
```bash
# Clone the repository
git clone https://github.com/Adiksuu/validauth.git
cd validauth

# Install dependencies
npm install

# Run tests
npm test

# Run examples
node test.js
```

## Comparison with Other Libraries

| Feature | validauth | validator.js | joi | yup |
|---------|-----------|--------------|-----|-----|
| Size | ~14KB | ~100KB | ~150KB | ~80KB |
| Dependencies | 0 | 0 | Many | Many |
| Auth-focused | ✅ | ❌ | ❌ | ❌ |
| Common password check | ✅ | ❌ | ❌ | ❌ |
| Password strength | ✅ | ❌ | ❌ | ❌ |
| Detailed errors | ✅ | ⚠️ | ✅ | ✅ |
| Easy to use | ✅ | ✅ | ⚠️ | ⚠️ |
| TypeScript | 🔜 | ✅ | ✅ | ✅ |

## Bundle Size

- **validauth**: ~14KB minified, ~5KB gzipped
- **Zero dependencies**: No bloat from external packages
- **Tree-shakeable**: Import only what you need
```javascript
// Import only what you need
import { isEmail } from 'validauth'; // ~4.4KB
import { isPassword } from 'validauth'; // ~6KB
import { isUsername } from 'validauth'; // ~3.6KB
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Node.js 12+

## License

MIT © [Adiksuu]

## Acknowledgments

- Inspired by the need for better authentication validation in modern web apps
- Built with ❤️ for the JavaScript community
- Common password list curated from security research and breach databases
- Reserved username list compiled from industry best practices

## Support

- 📧 Email: codeadiksuu@gmail.com
- 💬 Issues: [GitHub Issues](https://github.com/Adiksuu/validauth/issues)
<!-- - 📖 Documentation: [GitHub Wiki](https://github.com/Adiksuu/validauth/wiki) -->

## Quick Links

<!-- - [📖 Full Documentation](https://github.com/Adiksuu/validauth/wiki) -->
- [📝 Email Validation Guide](email)
- [🔑 Password Validation & Password Strength Guide](password)
- [👤 Username Validation Guide](username)
<!-- - [💪 Password Strength Guide](docs/PASSWORD_STRENGTH.md) -->
<!-- - [🎯 Examples & Recipes](examples/) -->
- [📋 Changelog](faq-changelog)
<!-- - [🤝 Contributing Guide](CONTRIBUTING.md) -->

---

**Made with ❤️ by [Adiksuu]**

⭐ Star this repo if you find it useful!

<!-- [See full changelog](CHANGELOG.md) -->

### Basic Usage
```javascript
const { isEmail, isPassword, isUsername } = require('validauth');

// Email validation
if (isEmail('user@example.com')) {
  console.log('Valid email!');
}

// Password validation
if (isPassword('MyP@ssw0rd123')) {
  console.log('Strong password!');
}

// Username validation
if (isUsername('johndoe')) {
  console.log('Valid username!');
}

// Advanced validation with detailed errors
const result = isPassword('weak', {
  minLength: 10,
  details: true
});

if (!result.valid) {
  console.log('Errors:', result.errors);
}
```

## Documentation

### Current Validators

#### ✉️ Email Validation

Validate email addresses with customizable rules:
```javascript
isEmail(email, {
  allowPlusAddressing: true,    // Allow user+tag@domain.com
  requireTLD: true,              // Require .com, .org, etc.
  blockedDomains: [],            // Block specific domains
  details: false                 // Get detailed error messages
});
```

**Examples:**
```javascript
// Block temporary email services
isEmail('user@tempmail.com', {
  blockedDomains: ['tempmail.com', '10minutemail.com']
}); // false

// Allow local emails (for development)
isEmail('admin@localhost', {
  requireTLD: false
}); // true

// Get detailed validation info
isEmail('invalid@', { details: true });
// Returns: { valid: false, errors: ['Domain cannot be empty'], ... }
```

[📖 Full Email Documentation](email)

---

#### 🔑 Password Validation

Validate password strength with comprehensive security checks:
```javascript
isPassword(password, {
  minLength: 8,                    // Minimum password length
  maxLength: 128,                  // Maximum password length
  requireUppercase: true,          // Require uppercase letters
  requireLowercase: true,          // Require lowercase letters
  requireNumbers: true,            // Require numbers
  requireSymbols: true,            // Require special characters
  forbidCommonPasswords: true,     // Block common/leaked passwords
  details: false                   // Get detailed error messages
});
```

**Examples:**
```javascript
// Default validation (strong requirements)
isPassword('MyP@ssw0rd123'); // true
isPassword('weak'); // false

// Custom requirements
isPassword('SimplyPassword123', {
  requireSymbols: false,
  minLength: 6
}); // true

// Block common passwords
isPassword('password123', {
  forbidCommonPasswords: true
}); // false
```

**Security Features:**
- ✅ Checks against 1,000+ common/leaked passwords
- ✅ Configurable complexity requirements
- ✅ Length validation
- ✅ Character type requirements

[📖 Full Password Documentation](password)

---

#### 👤 Username Validation

Validate usernames with rules for length, characters, and reserved names:
```javascript
isUsername(username, {
  minLength: 3,                    // Minimum username length
  maxLength: 30,                   // Maximum username length
  allowSpecialChars: false,        // Allow special characters
  forbidSpaces: true,              // Forbid spaces
  forbidStartingNumber: true,      // Forbid starting with number
  blockedUsernames: [],            // Reserved/blocked usernames
  details: false                   // Get detailed error messages
});
```

**Examples:**
```javascript
// Default validation
isUsername('johndoe'); // true
isUsername('ab'); // false (too short)
isUsername('user@name'); // false (special chars not allowed)

// Block reserved usernames
isUsername('admin', {
  blockedUsernames: ['admin', 'root', 'system']
}); // false

// Gaming platform (allow numbers at start)
isUsername('Player_1', {
  forbidStartingNumber: false
}); // true

// Get detailed feedback
const result = isUsername('123user', { details: true });
// Returns: { valid: false, errors: ['Username cannot start with a number'], ... }
```

**Common Use Cases:**
- 🎮 Gaming platforms (gamer tags)
- 📱 Social media handles
- 💼 Professional networks
- 🌐 Forums and communities

[📖 Full Username Documentation](username)

---

#### 💪 Password Strength Calculator

Calculate password strength with detailed feedback:
```javascript
getPasswordStrength(password)
```

**Returns:**
```javascript
{
  strength: 'weak' | 'medium' | 'strong',
  score: 0-100,                    // Numerical strength score
  estimatedCrackTimeInYears: int, // Numerical crack time in years
  crackTimeDisplay: string, // Estimated time to crack in string
}
```

**Example:**
```javascript
const strength = getPasswordStrength('MyP@ssw0rd123');
console.log(strength);
// {
//   strength: 'weak',
//   score: 0,
//   estimatedCrackTimeInYears: 0,
//   crackTimeDisplay: '10 seconds'
// }
```

---

## Use Cases

### Complete Registration Form
```javascript
const { isEmail, isPassword, isUsername } = require('validauth');

function validateRegistration(email, password, username) {
  const errors = {};
  
  // Validate email
  const emailResult = isEmail(email, {
    allowPlusAddressing: false,
    blockedDomains: ['tempmail.com', 'throwaway.email'],
    details: true
  });
  
  if (!emailResult.valid) {
    errors.email = emailResult.errors;
  }
  
  // Validate password
  const passwordResult = isPassword(password, {
    minLength: 10,
    requireSymbols: true,
    forbidCommonPasswords: true,
    details: true
  });
  
  if (!passwordResult.valid) {
    errors.password = passwordResult.errors;
  }
  
  // Validate username
  const usernameResult = isUsername(username, {
    minLength: 4,
    maxLength: 20,
    forbidStartingNumber: true,
    blockedUsernames: ['admin', 'root', 'system', 'moderator'],
    details: true
  });
  
  if (!usernameResult.valid) {
    errors.username = usernameResult.errors;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Usage
const result = validateRegistration(
  'user@example.com',
  'MyP@ssw0rd123',
  'johndoe'
);

if (!result.valid) {
  console.log('Validation errors:', result.errors);
} else {
  console.log('All valid! Proceed with registration.');
}
```

### Login Form
```javascript
function validateLogin(identifier, password) {
  // Check if identifier is email or username
  const isEmailFormat = identifier.includes('@');
  
  if (isEmailFormat) {
    return isEmail(identifier) && isPassword(password, {
      minLength: 1, // Just check if exists
      requireUppercase: false,
      requireNumbers: false,
      requireSymbols: false,
      forbidCommonPasswords: false
    });
  } else {
    return isUsername(identifier, {
      minLength: 1
    }) && password.length > 0;
  }
}
```

### Password Reset
```javascript
function validateNewPassword(newPassword, username) {
  const result = isPassword(newPassword, {
    minLength: 12,
    requireSymbols: true,
    forbidCommonPasswords: true,
    details: true
  });
  
  if (!result.valid) {
    return result;
  }
  
  // Check if password contains username
  if (newPassword.toLowerCase().includes(username.toLowerCase())) {
    return {
      valid: false,
      errors: ['Password cannot contain your username']
    };
  }
  
  return { valid: true };
}
```

### Social Media Registration
```javascript
function validateSocialSignup(email, username) {
  // Email validation
  const emailValid = isEmail(email, {
    allowPlusAddressing: true,
    details: true
  });
  
  // Username/handle validation
  const usernameValid = isUsername(username, {
    minLength: 3,
    maxLength: 30,
    forbidStartingNumber: true,
    blockedUsernames: ['admin', 'support', 'help', 'official'],
    details: true
  });
  
  return {
    email: emailValid,
    username: usernameValid,
    valid: emailValid.valid && usernameValid.valid
  };
}
```

## Why validauth?

### Before validauth:
```javascript
// Complex regex, hard to maintain
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,29}$/;

if (!emailRegex.test(email)) {
  return 'Invalid email';
}

// Manual password checks
if (password.length < 8) return 'Too short';
if (!/[A-Z]/.test(password)) return 'Need uppercase';
if (!/[0-9]/.test(password)) return 'Need numbers';

// Manual username checks
if (username.length < 3) return 'Too short';
if (/[!@#$%]/.test(username)) return 'No special chars';
if (username === 'admin') return 'Reserved';

// No protection against common passwords
// No customization, no detailed errors
// Lots of repetitive code
```

### After validauth:
```javascript
const emailResult = isEmail(email, {
  blockedDomains: ['tempmail.com'],
  details: true
});

const passwordResult = isPassword(password, {
  minLength: 10,
  forbidCommonPasswords: true,
  details: true
});

const usernameResult = isUsername(username, {
  minLength: 4,
  blockedUsernames: ['admin', 'root'],
  details: true
});

// Clean, readable, comprehensive validation
if (!emailResult.valid) return emailResult.errors;
if (!passwordResult.valid) return passwordResult.errors;
if (!usernameResult.valid) return usernameResult.errors;
```