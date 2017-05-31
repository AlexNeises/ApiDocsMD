#!/usr/bin/env node
;
var load;

load = function(next) {
  var _, apiData, apiGroup, argv, data, fs, groupData, output, p, pkg;
  _ = require('lodash');
  p = require('path');
  fs = require('fs');
  pkg = require(process.cwd() + '/package.json');
  argv = require('minimist')(process.argv.slice(2));
  data = {};
  apiData = JSON.parse(fs.readFileSync(argv.p + '/api_data.json'));
  data.projectName = pkg.name != null ? pkg.name : null;
  data.projectDesc = pkg.description != null ? pkg.description : null;
  data.projectVers = pkg.version != null ? pkg.version : null;
  apiGroup = _.groupBy(apiData, function(entry) {
    return entry.group;
  });
  groupData = {};
  _.forEach(Object.keys(apiGroup), function(value) {
    return groupData[value] = _.groupBy(apiGroup[value], function(entry) {
      return entry.name;
    });
  });
  data.api = apiData;
  output = '<a name="top"></a>\n';
  if (data.projectName != null) {
    output += '# ' + data.projectName + '\n';
  }
  if (data.projectVers != null) {
    output += '### Version ' + data.projectVers + '\n';
  }
  if (data.projectDesc != null) {
    output += data.projectDesc + '\n';
  }
  _.forEach(groupData, function(value, key) {
    output += '- [' + key + '](#' + _.replace(_.toLower(key), /\s/g, '-') + ')\n';
    return _.forEach(value, function(innerValue, innerKey) {
      return output += '\t- [' + innerKey + '](#' + _.replace(_.toLower(innerKey), /\s/g, '-') + ')\n';
    });
  });
  _.forEach(groupData, function(value, key) {
    output += '## ' + key + '\n';
    return _.forEach(value, function(innerValue, innerKey) {
      output += '### ' + innerKey + '\n';
      if (innerValue[0].title != null) {
        output += innerValue[0].title + '\n\n';
      }
      if ((innerValue[0].type != null) && (innerValue[0].url != null)) {
        switch (_.toLower(innerValue[0].type)) {
          case 'get':
            output += '![](https://img.shields.io/badge/GET-' + innerValue[0].url + '-00C000.png?maxAge=3600&colorA=00C000&colorB=5C5C5C)\n\n';
            break;
          case 'post':
            output += '![](https://img.shields.io/badge/POST-' + innerValue[0].url + '-4070EC.png?maxAge=3600&colorA=4070EC&colorB=5C5C5C)\n\n';
            break;
          case 'put':
            output += '![](https://img.shields.io/badge/PUT-' + innerValue[0].url + '-E59500.png?maxAge=3600&colorA=E59500&colorB=5C5C5C)\n\n';
            break;
          case 'delete':
            output += '![](https://img.shields.io/badge/DELETE-' + innerValue[0].url + '-ED0039.png?maxAge=3600&colorA=ED0039&colorB=5C5C5C)\n\n';
            break;
          default:
            output += _.toUpper(innerValue[0].type);
        }
      }
      if (innerValue[0].header != null) {
        if (innerValue[0].header.fields != null) {
          output += '#### Headers\n';
          output += '|Type|Field|Description|\n';
          output += '|--- |---  |---        |\n';
          _.forEach(innerValue[0].header.fields.Header, function(field) {
            var desc, newf, opt, type;
            opt = field.optional === true ? '(optional) ' : '';
            type = field.type != null ? field.type : '';
            newf = field.field != null ? field.field : '';
            desc = field.description != null ? field.description : '';
            return output += '|`' + type + '`|' + newf + '|' + opt + desc + '|\n';
          });
          output += '\n\n';
        }
        if (innerValue[0].header.examples != null) {
          output += '#### Header Examples\n';
          output += '|Type|Content|\n';
          output += '|--- |---    |\n';
          _.forEach(innerValue[0].header.examples, function(field) {
            var cont, type;
            type = field.type != null ? field.type : '';
            cont = field.content != null ? field.content : '';
            return output += '|`' + type + '`|<pre>' + _.replace(cont, /\n/g, '<br>') + '</pre>|';
          });
          output += '\n\n';
        }
      }
      if (innerValue[0].parameter != null) {
        if (innerValue[0].parameter.fields != null) {
          output += '#### Parameters\n';
          output += '|Type|Field|Description|\n';
          output += '|--- |---  |---        |\n';
          _.forEach(innerValue[0].parameter.fields.Parameter, function(field) {
            var desc, newf, opt, type;
            opt = field.optional === true ? '(optional) ' : '';
            type = field.type != null ? field.type : '';
            newf = field.field != null ? field.field : '';
            desc = field.description != null ? field.description : '';
            return output += '|`' + type + '`|' + newf + '|' + opt + desc + '|\n';
          });
          output += '\n\n';
        }
        if (innerValue[0].parameter.examples != null) {
          output += '#### Examples\n';
          _.forEach(innerValue[0].parameter.examples, function(field) {
            output += '```bash\n';
            output += field.content + '\n';
            return output += '```\n';
          });
          output += '\n\n';
        }
      }
      return output += '[Back to top](#top)\n\n\n';
    });
  });
  return fs.writeFile(argv.o, output, (function(_this) {
    return function(err) {
      if (err) {
        throw err;
      }
      return next('File written to ' + argv.o);
    };
  })(this));
};

load(function(data) {
  return console.log(data);
});
