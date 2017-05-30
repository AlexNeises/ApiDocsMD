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
    output += '- [' + key + '](#' + _.replace(_.lowerCase(key), /\s/g, '-') + ')\n';
    return _.forEach(value, function(innerValue, innerKey) {
      return output += '\t- [' + innerKey + '](#' + _.replace(_.lowerCase(innerKey), /\s/g, '-') + ')\n';
    });
  });
  _.forEach(groupData, function(value, key) {
    output += '### ' + key + '\n';
    return _.forEach(value, function(innerValue, innerKey) {
      output += '#### ' + innerKey + '\n';
      switch (_.lowerCase(innerValue[0].type)) {
        case 'get':
          output += '![GET](https://github.com/alexneises/ApiDocsMD/get.png)\n';
          break;
        case 'post':
          output += '![POST](https://github.com/alexneises/ApiDocsMD/post.png)\n';
          break;
        case 'put':
          output += '![PUT](https://github.com/alexneises/ApiDocsMD/put.png)\n';
          break;
        case 'delete':
          output += '![DELETE](https://github.com/alexneises/ApiDocsMD/delete.png)\n';
          break;
        default:
          output += _.upperCase(innerValue[0].type);
      }
      return output += '[Back to top](#top)\n';
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
