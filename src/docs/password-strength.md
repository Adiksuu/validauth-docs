# 🔑 Password Strength Calculator

Comprehensive password strength calculator with security-first design.

## Basic Usage

```javascript
const { getPasswordStrength } = require("validauth");

// Check password strength
console.log(getPasswordStrength("MyP@ssw0rd123")); // 'strong'
console.log(getPasswordStrength("weak")); // 'weak'
```

## API
### `getPasswordStrength(password, options)`

Calculates the strength of a password based on length, character variety, and complexity.

**Parameters:**

-   `password` (string) - Password to evaluate
-   `options` (object) - Optional evaluation options
    -   `details` (boolean) - Return detailed strength information. Default: `false`

**Returns:**

-   `string` - When `details: false` (default): `'weak'` | `'medium'` | `'strong'`
-   `object` - When `details: true`:

```javascript
  {
    strength: 'weak' | 'medium' | 'strong',
    score: number, // 0-100
    estimatedCrackTimeInYears: number,
    crackTimeDisplay: string // Human-readable format
  }
```

**Scoring System:**

-   **Length (0-40 points)**: 10 points each for passwords >=8, >=12, >=16, >=20 characters
-   **Character Variety (0-40 points)**: 10 points each for lowercase, uppercase, numbers, symbols
-   **Complexity Bonus (0-20 points)**: Bonus for longer passwords with multiple character types
-   **Common Password Penalty**: Common passwords automatically receive a score of 0

**Strength Levels:**

-   `weak`: Score < 40
-   `medium`: Score 40-69
-   `strong`: Score >= 70

## Examples
### Using `getPasswordStrength`

The built-in `getPasswordStrength` function provides a comprehensive strength evaluation:

```javascript
const { getPasswordStrength } = require("validauth");

// Simple strength check
console.log(getPasswordStrength("12345")); // 'weak'
console.log(getPasswordStrength("password")); // 'weak' (common password)
console.log(getPasswordStrength("MyPass123")); // 'medium'
console.log(getPasswordStrength("MyP@ssw0rd123")); // 'strong'

// Get detailed strength information
const details = getPasswordStrength("MyP@ssw0rd123!@#", { details: true });
console.log(details);
// Output:
// {
//   strength: 'strong',
//   score: 90,
//   estimatedCrackTimeInYears: 31709791,
//   crackTimeDisplay: '31709791 years'
// }

// Weak password details
const weakDetails = getPasswordStrength("password", { details: true });
console.log(weakDetails);
// Output:
// {
//   strength: 'weak',
//   score: 0,
//   estimatedCrackTimeInYears: 0,
//   crackTimeDisplay: '10 seconds'
// }

// Medium strength password
const mediumDetails = getPasswordStrength("MyPassword123", { details: true });
console.log(mediumDetails);
// Output:
// {
//   strength: 'medium',
//   score: 50,
//   estimatedCrackTimeInYears: 31,
//   crackTimeDisplay: '31 years'
// }
```

### Password Strength Indicator (Custom Implementation)

You can also create a custom strength indicator using `isPassword`:

```javascript
function getPasswordStrengthLevel(password) {
    // Try increasingly strict requirements
    const checks = [
        {
            level: "Very Weak",
            opts: {
                minLength: 1,
                requireUppercase: false,
                requireLowercase: false,
                requireNumbers: false,
                requireSymbols: false,
                forbidCommonPasswords: false,
            },
        },
        {
            level: "Weak",
            opts: {
                minLength: 6,
                requireUppercase: false,
                requireNumbers: false,
                requireSymbols: false,
                forbidCommonPasswords: true,
            },
        },
        {
            level: "Fair",
            opts: {
                minLength: 8,
                requireUppercase: true,
                requireNumbers: true,
                requireSymbols: false,
                forbidCommonPasswords: true,
            },
        },
        {
            level: "Good",
            opts: {
                minLength: 10,
                requireUppercase: true,
                requireNumbers: true,
                requireSymbols: true,
                forbidCommonPasswords: true,
            },
        },
        {
            level: "Strong",
            opts: {
                minLength: 12,
                requireUppercase: true,
                requireNumbers: true,
                requireSymbols: true,
                forbidCommonPasswords: true,
            },
        },
    ];

    for (let i = checks.length - 1; i >= 0; i--) {
        if (isPassword(password, checks[i].opts)) {
            return checks[i].level;
        }
    }

    return "Very Weak";
}

console.log(getPasswordStrengthLevel("12345")); // Very Weak
console.log(getPasswordStrengthLevel("password")); // Very Weak (common)
console.log(getPasswordStrengthLevel("MyPass1")); // Weak
console.log(getPasswordStrengthLevel("MyPass123")); // Fair
console.log(getPasswordStrengthLevel("MyP@ss123")); // Good
console.log(getPasswordStrengthLevel("MyP@ssw0rd123")); // Strong
```

### API Integration with Strength Indicator

```javascript
// Express.js middleware with strength check
function validatePasswordMiddleware(req, res, next) {
    const { password } = req.body;

    const result = isPassword(password, {
        minLength: 10,
        forbidCommonPasswords: true,
        details: true,
    });

    if (!result.valid) {
        return res.status(400).json({
            error: "Invalid password",
            details: result.errors,
        });
    }

    // Check password strength
    const strength = getPasswordStrength(password, { details: true });

    // Optionally warn about weak passwords
    if (strength.strength === "weak") {
        return res.status(400).json({
            error: "Password is too weak",
            strength: strength,
        });
    }

    next();
}

app.post("/register", validatePasswordMiddleware, (req, res) => {
    // Password is valid and strong, proceed with registration
});

// Return strength information in response
app.post("/register", validatePasswordMiddleware, (req, res) => {
    const { password } = req.body;
    const strength = getPasswordStrength(password, { details: true });

    // Store user with password hash...

    res.json({
        message: "Registration successful",
        passwordStrength: strength,
    });
});
```

## Error Messages
### `getPasswordStrength` Error Messages

When using `getPasswordStrength` with `details: true` and an invalid password, you may receive:

-   `'Password must be a non-empty string'` (in the `errors` array)

## License

MIT © [Adiksuu]