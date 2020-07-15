apos.define('apostrophe-forms-regexp', {

  afterConstruct: function(self) {
    self.addFieldType();
  },

  construct: function(self, options) {

    self.addFieldType = function() {
      var superConvert = apos.schemas.fieldTypes['string'].convert;

      apos.schemas.addFieldType({
        name: 'apostrophe-forms-regexp',
        populate: apos.schemas.fieldTypes['string'].populate,
        convert: function(data, name, $field, $el, field, callback) {
          return superConvert(data, name, $field, $el, field, function(err) {
            if (err) {
              return callback(err);
            }
            try {
              // eslint-disable-next-line no-new
              new RegExp(data[name]);
              return callback(null);
            } catch (e) {
              return callback('invalid');
            }
          });
        }
      });
    };

  }
});
