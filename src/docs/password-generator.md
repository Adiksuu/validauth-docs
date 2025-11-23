# 🔑 Password Generator

Generate strong, random passwords with customizable criteria.

## Basic Usage
```javascript
const { generatePassword } = require('validauth');

// Generate with default settings (12 chars, all types)
const password = generatePassword();
console.log(password); // e.g., "Kp9$mN2@xL5v"

// Generate with custom length
const longPassword = generatePassword({ 
  options: { length: 20 } 
});
console.log(longPassword); // e.g., "A7!k9Mn@2xL5vP3$Qr8Z"
```

## API

### `generatePassword({ options })`

Generates a random password based on specified criteria.

**Parameters:**
- `options` (object) - Generation options
  - `length` (number) - Password length. Default: `12`
  - `includeUppercase` (boolean) - Include uppercase letters (A-Z). Default: `true`
  - `includeLowercase` (boolean) - Include lowercase letters (a-z). Default: `true`
  - `includeNumbers` (boolean) - Include numbers (0-9). Default: `true`
  - `includeSymbols` (boolean) - Include symbols (!@#$%...). Default: `true`
  - `details` (boolean) - Return detailed information. Default: `false`

**Returns:** 
- `string` - When `details: false` (default) - the generated password
- `object` - When `details: true`:
```javascript
  {
    password: string,
    length: number,
    errors: string[],
    strength: object  // From getPasswordStrength()
  }
```

## Examples

### Default Generation
```javascript
// Default: 12 characters with all types
const password1 = generatePassword();
console.log(password1); // "Kp9$mN2@xL5v"

const password2 = generatePassword();
console.log(password2); // "Tz7!wQ4&pR1x" (always different)

const password3 = generatePassword();
console.log(password3); // "Bn3#gF8*mK6y"
```

### Option: `length`

Control the length of the generated password.
```javascript
// Short password (8 characters)
const short = generatePassword({ 
  options: { length: 8 } 
});
console.log(short); // "K9$mN2@x"

// Medium password (16 characters)
const medium = generatePassword({ 
  options: { length: 16 } 
});
console.log(medium); // "Kp9$mN2@xL5vPr3!"

// Long password (32 characters)
const long = generatePassword({ 
  options: { length: 32 } 
});
console.log(long); // "Kp9$mN2@xL5vPr3!Tz7&wQ4*pR1xBn8#"
```

### Option: `includeUppercase`

Control whether uppercase letters are included.
```javascript
// With uppercase (default)
const withUpper = generatePassword({ 
  options: { includeUppercase: true } 
});
console.log(withUpper); // "Kp9$mN2@xL5v" (has K, N, L)

// Without uppercase
const withoutUpper = generatePassword({ 
  options: { includeUppercase: false } 
});
console.log(withoutUpper); // "kp9$mn2@xl5v" (no uppercase)
```

### Option: `includeLowercase`

Control whether lowercase letters are included.
```javascript
// With lowercase (default)
const withLower = generatePassword({ 
  options: { includeLowercase: true } 
});
console.log(withLower); // "Kp9$mN2@xL5v" (has p, m, x, v)

// Without lowercase
const withoutLower = generatePassword({ 
  options: { includeLowercase: false } 
});
console.log(withoutLower); // "KP9$MN2@XL5V" (no lowercase)
```

### Option: `includeNumbers`

Control whether numbers are included.
```javascript
// With numbers (default)
const withNumbers = generatePassword({ 
  options: { includeNumbers: true } 
});
console.log(withNumbers); // "Kp9$mN2@xL5v" (has 9, 2, 5)

// Without numbers
const withoutNumbers = generatePassword({ 
  options: { includeNumbers: false } 
});
console.log(withoutNumbers); // "Kp$mN@xLv" (no numbers)
```

### Option: `includeSymbols`

Control whether special characters are included.
```javascript
// With symbols (default)
const withSymbols = generatePassword({ 
  options: { includeSymbols: true } 
});
console.log(withSymbols); // "Kp9$mN2@xL5v" (has $, @)

// Without symbols
const withoutSymbols = generatePassword({ 
  options: { includeSymbols: false } 
});
console.log(withoutSymbols); // "Kp9mN2xL5v" (no symbols)
```

### Option: `details`

Get detailed information about the generated password.
```javascript
const result = generatePassword({ 
  options: { 
    length: 16,
    details: true 
  } 
});

console.log(result);
// Output:
// {
//   password: "Kp9$mN2@xL5vPr3!",
//   length: 16,
//   errors: [],
//   strength: {
//     score: 95,
//     level: 'very-strong',
//     feedback: [],
//     crackTime: '1000 years'
//   }
// }
```

### Combining Multiple Options
```javascript
// PIN-like password (only numbers, 6 digits)
const pin = generatePassword({ 
  options: {
    length: 6,
    includeUppercase: false,
    includeLowercase: false,
    includeNumbers: true,
    includeSymbols: false
  } 
});
console.log(pin); // "482917"

// Alphanumeric only (no symbols)
const alphanumeric = generatePassword({ 
  options: {
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false
  } 
});
console.log(alphanumeric); // "Kp9mN2xL5vPr"

// Letters only (no numbers or symbols)
const lettersOnly = generatePassword({ 
  options: {
    length: 10,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: false,
    includeSymbols: false
  } 
});
console.log(lettersOnly); // "KpmNxLvPrT"

// Maximum security (long + all types)
const maxSecurity = generatePassword({ 
  options: {
    length: 24,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    details: true
  } 
});
console.log(maxSecurity);
// {
//   password: "Kp9$mN2@xL5vPr3!Tz7&wQ4*",
//   length: 24,
//   strength: { score: 100, level: 'very-strong', ... }
// }
```

## Real-World Examples

### Password Reset Feature
```javascript
const { generatePassword, isPassword } = require('validauth');

function resetUserPassword(userId) {
  // Generate a strong temporary password
  const tempPassword = generatePassword({ 
    options: { 
      length: 16,
      details: true 
    } 
  });
  
  console.log('Temporary password:', tempPassword.password);
  console.log('Strength:', tempPassword.strength.level);
  
  // Send to user via email
  sendEmail(userId, tempPassword.password);
  
  // Store hashed password
  updateUserPassword(userId, hashPassword(tempPassword.password));
  
  return {
    success: true,
    message: 'Password reset email sent'
  };
}
```

### Account Creation
```javascript
function createTemporaryAccount(email) {
  // Generate initial password
  const initialPassword = generatePassword({ 
    options: { length: 12 } 
  });
  
  console.log(`Account created for ${email}`);
  console.log(`Initial password: ${initialPassword}`);
  console.log('User will be prompted to change on first login');
  
  return {
    email,
    temporaryPassword: initialPassword,
    mustChangePassword: true
  };
}
```

### Password Generator UI
```javascript
import { useState } from 'react';
import { generatePassword } from 'validauth';

function PasswordGeneratorUI() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState(null);
  
  const generate = () => {
    const result = generatePassword({ 
      options: {
        length,
        includeSymbols,
        details: true
      } 
    });
    
    setPassword(result.password);
    setStrength(result.strength);
  };
  
  return (
    <div>
      <h2>Password Generator</h2>
      
      <label>
        Length: {length}
        <input 
          type="range" 
          min="8" 
          max="32" 
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
      </label>
      
      <label>
        <input 
          type="checkbox" 
          checked={includeSymbols}
          onChange={(e) => setIncludeSymbols(e.target.checked)}
        />
        Include Symbols
      </label>
      
      <button onClick={generate}>Generate Password</button>
      
      {password && (
        <div>
          <p>Password: <strong>{password}</strong></p>
          <p>Strength: {strength?.level}</p>
          <button onClick={() => navigator.clipboard.writeText(password)}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
```

### API Integration
```javascript
// Express.js endpoint
app.post('/api/generate-password', (req, res) => {
  const { length = 12, includeSymbols = true } = req.body;
  
  const result = generatePassword({ 
    options: {
      length,
      includeSymbols,
      details: true
    } 
  });
  
  res.json({
    password: result.password,
    length: result.length,
    strength: result.strength
  });
});
```

### Bulk Password Generation
```javascript
function generateBulkPasswords(count = 10, options = {}) {
  const passwords = [];
  
  for (let i = 0; i < count; i++) {
    const password = generatePassword({ options });
    passwords.push(password);
  }
  
  return passwords;
}

// Generate 100 passwords
const passwords = generateBulkPasswords(100, { 
  length: 16, 
  includeSymbols: true 
});

console.log(passwords);
// ["Kp9$mN2@xL5vPr3!", "Tz7!wQ4&pR1xBn8#", ...]
```

## Error Handling
```javascript
// Invalid configuration (no character types selected)
const result = generatePassword({ 
  options: {
    includeUppercase: false,
    includeLowercase: false,
    includeNumbers: false,
    includeSymbols: false,
    details: true
  } 
});

console.log(result);
// Output:
// {
//   password: '',
//   errors: ['At least one character type must be selected.']
// }
```

## Character Sets

The generator uses the following character sets:
```javascript
Uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' (26 characters)
Lowercase: 'abcdefghijklmnopqrstuvwxyz' (26 characters)
Numbers: '0123456789' (10 characters)
Symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?' (28 characters)
```

Total possible characters: **90**

## Security Considerations

### ✅ Good Practices

1. **Use crypto-safe random** (current implementation uses `Math.random()` - consider upgrading to `crypto.getRandomValues()`)
2. **Never log passwords** to console in production
3. **Always hash** before storing
4. **Use sufficient length** (minimum 12 characters)
5. **Include all character types** for maximum entropy

### Entropy Calculation
```
Entropy = log2(charset_size^length)

Example with defaults (length=12, all types):
- Charset size: 90 characters
- Entropy: log2(90^12) ≈ 79 bits (very strong)
```

### ⚠️ Important Notes

- Generated passwords are **random** but **not cryptographically secure** with `Math.random()`
- Always use HTTPS when transmitting passwords
- Never send passwords in URL parameters

## Best Practices

### Recommended Settings

**For user accounts:**
```javascript
generatePassword({ 
  options: { 
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  } 
});
```

**For temporary/reset passwords:**
```javascript
generatePassword({ 
  options: { 
    length: 12,
    includeSymbols: false  // Easier to type
  } 
});
```

**For high-security accounts:**
```javascript
generatePassword({ 
  options: { 
    length: 24,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  } 
});
```

## Performance

- **Generation time**: < 1ms for passwords up to 32 characters
- **Memory efficient**: No caching, generates on-demand
- **Randomness**: Uses `Math.random()` (consider crypto upgrade for production)

## Combining with Other Validators
```javascript
const { generatePassword, isPassword, getPasswordStrength } = require('validauth');

// Generate and validate
const password = generatePassword({ options: { length: 16 } });

console.log('Generated:', password);
console.log('Is valid?', isPassword(password));
console.log('Strength:', getPasswordStrength(password));

// Keep generating until strength is very-strong
function generateVeryStrongPassword() {
  let password;
  let strength;
  
  do {
    password = generatePassword({ options: { length: 20 } });
    strength = getPasswordStrength(password);
  } while (strength.level !== 'very-strong');
  
  return password;
}
```

## License

MIT © [Adiksuu]