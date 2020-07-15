This module adds a new type of text field that allows the admin to specify their own regular expression. It is meant for use alongside the `apostrophe-forms` module.

## Configuration

```javascript
// in app.js
modules: {
  'apostrophe-forms': {
    formWidgets: {
      // other fields go here
      'apostrophe-forms-regexp-text-field': {}
    }
  },
  'apostrophe-forms-regexp-text-field-widgets'
}
```

## Preventing DOS (Denial of Service) attacks

Since [many regular expressions can run for hours on malicious input](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS), this module uses the [time-limited-regular-expressions](https://github.com/apostrophecms/time-limited-regular-expressions) module to limit the runtime to one-quarter second. This will not be an issue on reasonable input. If you do get a timeout message when testing your form, you should write a more efficient regular expression.

