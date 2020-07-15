const regExp = require('time-limited-regular-expressions')();

module.exports = {
  extend: 'apostrophe-forms-base-field-widgets',
  label: 'Regular Expression Text Input',
  afterConstruct: function(self) {
    self.addFieldType();
    self.pushExtraAssets();
    self.pushExtraSingleton();
  },
  beforeConstruct: function(self, options) {
    options.addFields = [
      {
        name: 'regExp',
        label: 'Regular Expression',
        type: 'apostrophe-forms-regexp',
        htmlHelp: 'This must be a valid <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions">regular expression</a>. Example: ^[a-z]{3}$ matches three lowercase letters exactly.',
        required: true
      },
      {
        name: 'invalid',
        label: 'Message Displayed When Invalid',
        type: 'string',
        help: 'This should be a short message suitable to display next to the field.',
        required: true
      }
    ].concat(options.addFields || []);
  },
  construct: function (self, options) {
    const settings = (options.arrangeFields || []).find(group => group.name === 'settings');
    if (settings) {
      settings.fields.push('regExp', 'invalid');
    }

    self.sanitizeFormField = async function(req, form, widget, input, output) {
      const value = self.apos.launder.string(input[widget.fieldName]);
      if (value.length) {
        try {
          if (!(await regExp.match(widget.regExp, value))) {
            throw {
              fieldError: {
                field: widget.fieldName,
                error: 'invalid',
                errorMessage: widget.invalid
              }
            };
          }
        } catch (e) {
          if (e.name === 'timeout') {
            throw {
              fieldError: {
                field: widget.fieldName,
                error: 'invalid',
                errorMessage: 'Your input took too long to parse. Please check whether you followed the instructions.'
              }
            };
          }
          throw e;
        }
      }
    };

    self.addFieldType = function() {
      self.apos.schemas.addFieldType({
        name: 'apostrophe-forms-regexp',
        converters: {
          string: function (req, data, name, object, field, callback) {
            var test = self.apos.launder.string(data[name]);
            if (test.length) {
              try {
                // eslint-disable-next-line no-new
                new RegExp(test);
              } catch (e) {
                return setImmediate(() => callback('invalid'));
              }
              object[name] = test;
            } else {
              object[name] = null;
            }
            return setImmediate(callback);
          },
          form: 'string'
        },
        partial: self.regExpFieldTypePartial
      });
    };

    self.regExpFieldTypePartial = function(data) {
      return self.partial('regExp', data);
    };

    self.pushExtraAssets = function() {
      self.pushAsset('script', 'regexp-field', { when: 'user' });
    };

    self.pushExtraSingleton = function() {
      self.apos.push.browserCall('user', 'apos.create("apostrophe-forms-regexp", ?)', {});
    };

  }
};
