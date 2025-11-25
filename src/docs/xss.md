# 🛡️ XSS Protection

Check strings for potential Cross-Site Scripting (XSS) vulnerabilities and malicious content.

## Usage

### Basic XSS check
```javascript
const { isXSSSafe } = require('validauth');

console.log(isXSSSafe('<p>Hello World</p>')); // true (safe HTML)
console.log(isXSSSafe('<script>alert("XSS")</script>')); // false (XSS detected)
console.log(isXSSSafe('javascript:alert("XSS")')); // false (dangerous protocol)
```

### Option: `details`

Returns detailed information about detected XSS patterns.
```javascript
// Get detailed XSS analysis
const result = isXSSSafe('<script>alert("XSS")</script><img src=x onerror=alert("XSS")>', { details: true });
console.log(result);
// Output:
// {
//   safe: false,
//   errors: [
//     'Potential XSS detected: <script[^>]*>[\\s\\S]*?</script>',
//     'Potential XSS detected: onerror\\s*=',
//     'Potential XSS detected: <img[^>]*>'
//   ],
//   input: '<script>alert("XSS")</script><img src=x onerror=alert("XSS")>'
// }

// Safe input with details
const safeResult = isXSSSafe('<p>Safe content</p>', { details: true });
console.log(safeResult);
// Output:
// {
//   safe: true,
//   errors: null,
//   input: '<p>Safe content</p>'
// }
```

## API

### `isXSSSafe(input, options)`

Checks if a string contains potential XSS (Cross-Site Scripting) vulnerabilities.

**Parameters:**
- `input` (string) - The string to check for XSS
- `options` (object) - Validation options
  - `details` (boolean) - Whether to return detailed information. Default: `false`

**Returns:**
- `boolean` - When `details: false` (default) - true if safe, false if XSS detected
- `object` - When `details: true`:
```javascript
{
  safe: boolean,
  errors: string[] | null,
  input: string
}
```

## Examples

### Basic XSS Detection
```javascript
const { isXSSSafe } = require('validauth');

// Safe content
console.log(isXSSSafe('Hello World')); // true
console.log(isXSSSafe('<b>Bold text</b>')); // true
console.log(isXSSSafe('Normal text with <br> tags')); // true

// XSS attacks
console.log(isXSSSafe('<script>alert("XSS")</script>')); // false
console.log(isXSSSafe('javascript:alert("XSS")')); // false
console.log(isXSSSafe('<img src=x onerror=alert("XSS")>')); // false
console.log(isXSSSafe('<iframe src="javascript:alert(\'XSS\')"></iframe>')); // false
```

### Form Input Validation
```javascript
function validateUserInput(input, fieldName) {
  const xssCheck = isXSSSafe(input, { details: true });

  if (!xssCheck.safe) {
    return {
      valid: false,
      field: fieldName,
      error: 'Input contains potentially dangerous content',
      details: xssCheck.errors
    };
  }

  return {
    valid: true,
    sanitized: input // In real app, you'd sanitize here
  };
}

// Usage
const commentValidation = validateUserInput('<script>alert("hack")</script> Nice post!', 'comment');
if (!commentValidation.valid) {
  console.log('Validation failed:', commentValidation.error);
  console.log('XSS patterns:', commentValidation.details);
}
```

### Real-World Examples

### Comment System Validation
```javascript
const { isXSSSafe } = require('validauth');

function validateComment(comment) {
  // First check for XSS
  const xssResult = isXSSSafe(comment, { details: true });

  if (!xssResult.safe) {
    return {
      approved: false,
      reason: 'Comment contains potentially malicious content',
      xssPatterns: xssResult.errors,
      action: 'reject'
    };
  }

  // Additional checks (length, spam, etc.)
  if (comment.length > 1000) {
    return { approved: false, reason: 'Comment too long', action: 'reject' };
  }

  return {
    approved: true,
    comment: comment,
    action: 'approve'
  };
}

// Usage
const comment1 = validateComment('Great article! Thanks for sharing.');
console.log(comment1); // { approved: true, comment: 'Great article! Thanks for sharing.', action: 'approve' }

const comment2 = validateComment('<script>stealCookies()</script> Nice!');
console.log(comment2);
// {
//   approved: false,
//   reason: 'Comment contains potentially malicious content',
//   xssPatterns: ['Potential XSS detected: <script[^>]*>[\\s\\S]*?</script>'],
//   action: 'reject'
// }
```

### User Profile Data Sanitization
```javascript
function sanitizeUserProfile(profileData) {
  const sanitized = {};
  const issues = [];

  // Check each field for XSS
  for (const [field, value] of Object.entries(profileData)) {
    if (typeof value === 'string') {
      const xssCheck = isXSSSafe(value, { details: true });

      if (!xssCheck.safe) {
        issues.push({
          field: field,
          xssPatterns: xssCheck.errors
        });
        // Remove dangerous content (in real app, use proper sanitization)
        sanitized[field] = '[Content removed - potential security risk]';
      } else {
        sanitized[field] = value;
      }
    } else {
      sanitized[field] = value;
    }
  }

  return {
    sanitized: sanitized,
    issues: issues.length > 0 ? issues : null,
    safe: issues.length === 0
  };
}

// Usage
const profile = {
  name: 'John Doe',
  bio: 'Web developer <script>alert("XSS")</script> from NYC',
  website: 'javascript:alert("hacked")'
};

const result = sanitizeUserProfile(profile);
console.log('Sanitized profile:', result.sanitized);
console.log('Security issues:', result.issues);
```

### URL Parameter Validation
```javascript
function validateURLParameter(param, paramName) {
  // Check for XSS in URL parameters
  const xssCheck = isXSSSafe(param, { details: true });

  if (!xssCheck.safe) {
    return {
      valid: false,
      parameter: paramName,
      reason: 'URL parameter contains XSS payload',
      patterns: xssCheck.errors,
      action: 'block_request'
    };
  }

  // Additional URL-specific checks
  if (param.includes('javascript:') || param.includes('data:')) {
    return {
      valid: false,
      parameter: paramName,
      reason: 'Dangerous URL protocol detected',
      action: 'block_request'
    };
  }

  return { valid: true, value: param };
}

// Usage
const urlParam = validateURLParameter('search<script>alert(1)</script>', 'q');
if (!urlParam.valid) {
  console.log('Blocked malicious request:', urlParam.reason);
}
```

### Content Management System
```javascript
function validateCMSContent(content, contentType) {
  const xssResult = isXSSSafe(content, { details: true });

  if (!xssResult.safe) {
    // Log security incident
    logSecurityEvent('xss_attempt', {
      contentType: contentType,
      patterns: xssResult.errors,
      timestamp: new Date().toISOString()
    });

    return {
      approved: false,
      reason: 'Content contains XSS vulnerabilities',
      severity: 'high',
      recommendations: [
        'Remove script tags',
        'Remove event handlers',
        'Use proper HTML encoding'
      ]
    };
  }

  // Content is safe
  return {
    approved: true,
    content: content,
    contentType: contentType
  };
}

// Usage
const article = validateCMSContent('<article><h1>Title</h1><p>Safe content</p></article>', 'blog_post');
console.log(article); // { approved: true, content: '...', contentType: 'blog_post' }

const malicious = validateCMSContent('<div onclick="alert(\'XSS\')">Click me</div>', 'user_comment');
console.log(malicious);
// {
//   approved: false,
//   reason: 'Content contains XSS vulnerabilities',
//   severity: 'high',
//   recommendations: [...]
// }
```

### API Input Validation
```javascript
// Express.js middleware
const { isXSSSafe } = require('validauth');

function xssProtectionMiddleware(req, res, next) {
  // Check all string inputs for XSS
  const checkFields = (obj, path = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'string') {
        const xssCheck = isXSSSafe(value, { details: true });

        if (!xssCheck.safe) {
          return {
            safe: false,
            field: currentPath,
            errors: xssCheck.errors
          };
        }
      } else if (typeof value === 'object' && value !== null) {
        const nestedCheck = checkFields(value, currentPath);
        if (nestedCheck && !nestedCheck.safe) {
          return nestedCheck;
        }
      }
    }
    return { safe: true };
  };

  const bodyCheck = checkFields(req.body);
  const queryCheck = checkFields(req.query);

  if (!bodyCheck.safe) {
    return res.status(400).json({
      error: 'Request contains potentially malicious content',
      field: bodyCheck.field,
      details: bodyCheck.errors
    });
  }

  if (!queryCheck.safe) {
    return res.status(400).json({
      error: 'Query parameters contain XSS payload',
      field: queryCheck.field,
      details: queryCheck.errors
    });
  }

  next();
}

// Usage
app.use('/api', xssProtectionMiddleware);
```

### File Upload Content Check
```javascript
function validateUploadedContent(content, filename) {
  // Check file content for XSS (for text files, SVGs, etc.)
  const xssCheck = isXSSSafe(content, { details: true });

  if (!xssCheck.safe) {
    return {
      safe: false,
      filename: filename,
      reason: 'File contains XSS payload',
      patterns: xssCheck.errors,
      action: 'reject_upload'
    };
  }

  // Additional file-type specific checks
  if (filename.endsWith('.svg')) {
    // SVG files can contain JavaScript
    if (content.includes('<script') || content.includes('javascript:')) {
      return {
        safe: false,
        filename: filename,
        reason: 'SVG file contains executable content',
        action: 'reject_upload'
      };
    }
  }

  return {
    safe: true,
    filename: filename,
    content: content
  };
}

// Usage
const fileCheck = validateUploadedContent('<svg><script>alert("XSS")</script></svg>', 'malicious.svg');
console.log(fileCheck);
// {
//   safe: false,
//   filename: 'malicious.svg',
//   reason: 'File contains XSS payload',
//   patterns: [...],
//   action: 'reject_upload'
// }
```

## Detected XSS Patterns

The function detects the following common XSS patterns:

- **Script tags**: `<script>alert("XSS")</script>`
- **JavaScript protocol**: `javascript:alert("XSS")`
- **VBScript protocol**: `vbscript:msgbox("XSS")`
- **Data protocol**: `data:text/html,<script>alert("XSS")</script>`
- **Event handlers**: `onload=`, `onerror=`, `onclick=`, `onmouseover=`, `onmouseout=`
- **HTML elements**: `<iframe>`, `<object>`, `<embed>`, `<form>`, `<input>`, `<meta>`, `<link>`
- **Style tags**: `<style>body{background:url("javascript:alert(\'XSS\')")}</style>`

## Error Messages

When using `details: true`, you may receive error messages indicating detected patterns:

- `'Potential XSS detected: <script[^>]*>[\s\S]*?</script>'` - Script tags detected
- `'Potential XSS detected: javascript:'` - JavaScript protocol detected
- `'Potential XSS detected: onload\s*='` - Event handler detected
- `'Potential XSS detected: <iframe[^>]*>'` - iframe tag detected

## Security Considerations

### ✅ Good Practices

1. **Use as first line of defense** - Pattern-based detection catches obvious attacks
2. **Combine with output encoding** - Always encode output in HTML contexts
3. **Implement Content Security Policy (CSP)** - Restrict script execution
4. **Use proper sanitization libraries** - For complex HTML, use DOMPurify
5. **Validate on both client and server** - Client-side for UX, server-side for security
6. **Log security incidents** - Track and analyze XSS attempts
7. **Regular expression updates** - Keep patterns current with new attack vectors

### ⚠️ Important Limitations

- **Pattern-based detection** - May miss obfuscated attacks
- **Not a complete solution** - Should be part of a comprehensive security strategy
- **False positives possible** - Some legitimate content might trigger patterns
- **Context unaware** - Doesn't consider where the content will be used
- **No sanitization** - Only detects, doesn't clean malicious content

### Recommended Security Layers

```
1. Input Validation (isXSSSafe)
2. Output Encoding (HTML entity encoding)
3. Content Security Policy (CSP headers)
4. Sanitization (DOMPurify for HTML)
5. Input Length Limits
6. Rate Limiting
7. Security Headers (X-Frame-Options, etc.)
```

## Best Practices

### Input Validation Strategy

```javascript
function secureInputValidation(input, context) {
  // 1. Check for XSS patterns
  const xssCheck = isXSSSafe(input, { details: true });

  if (!xssCheck.safe) {
    return { valid: false, reason: 'XSS detected', details: xssCheck.errors };
  }

  // 2. Context-specific validation
  switch (context) {
    case 'html':
      // Allow safe HTML tags
      break;
    case 'url':
      // URL-specific checks
      break;
    case 'plaintext':
      // No HTML allowed
      break;
  }

  // 3. Length validation
  if (input.length > 10000) {
    return { valid: false, reason: 'Input too long' };
  }

  return { valid: true, input: input };
}
```

### Safe HTML Context Handling

```javascript
function handleUserContent(content, context) {
  const xssCheck = isXSSSafe(content, { details: true });

  if (!xssCheck.safe) {
    // Reject dangerous content
    return { safe: false, content: null, reason: 'XSS detected' };
  }

  // Content is pattern-safe, but still needs proper encoding
  let safeContent;

  switch (context) {
    case 'html':
      safeContent = encodeHtml(content); // Escape HTML entities
      break;
    case 'attribute':
      safeContent = encodeAttribute(content); // Escape attribute values
      break;
    case 'javascript':
      safeContent = encodeJavaScript(content); // Escape for JS contexts
      break;
    default:
      safeContent = content; // Plain text
  }

  return { safe: true, content: safeContent };
}
```

## Performance

- **Fast pattern matching** - < 1ms for most inputs
- **Efficient regex** - Optimized patterns with case-insensitive matching
- **Memory friendly** - No large data structures
- **Scalable** - Suitable for high-throughput applications

## License

MIT © [Adiksuu]