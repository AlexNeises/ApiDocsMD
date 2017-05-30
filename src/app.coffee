`#!/usr/bin/env node
`

load = (next) ->
    _    = require 'lodash'
    p    = require 'path'
    fs   = require 'fs'
    pkg  = require process.cwd() + '/package.json'
    argv = require('minimist')(process.argv.slice(2))

    data = {}

    apiData = JSON.parse fs.readFileSync argv.p + '/api_data.json'
    data.projectName = if pkg.name?         then pkg.name           else null
    data.projectDesc = if pkg.description?  then pkg.description    else null
    data.projectVers = if pkg.version?      then pkg.version        else null
    
    apiGroup = _.groupBy apiData, (entry) ->
        return entry.group
    
    groupData = {}

    _.forEach Object.keys(apiGroup), (value) ->
        groupData[value] = _.groupBy apiGroup[value], (entry) ->
            return entry.name
    data.api = apiData

    output = '<a name="top"></a>\n'

    if data.projectName?
        output += '# ' + data.projectName + '\n'
    if data.projectVers?
        output += '### Version ' + data.projectVers + '\n'
    if data.projectDesc?
        output += data.projectDesc + '\n'

    _.forEach groupData, (value, key) ->
        output += '- [' + key + '](#' + _.replace(_.lowerCase(key), /\s/g, '-') + ')\n'
        _.forEach value, (innerValue, innerKey) ->
            output += '\t- [' + innerKey + '](#' + _.replace(_.lowerCase(innerKey), /\s/g, '-') + ')\n'

    _.forEach groupData, (value, key) ->
        output += '### ' + key + '\n'
        _.forEach value, (innerValue, innerKey) ->
            output += '#### ' + innerKey + '\n'
            switch _.lowerCase innerValue[0].type
                when 'get'    then output += '![GET](https://github.com/alexneises/ApiDocsMD/get.png)\n'
                when 'post'   then output += '![POST](https://github.com/alexneises/ApiDocsMD/post.png)\n'
                when 'put'    then output += '![PUT](https://github.com/alexneises/ApiDocsMD/put.png)\n'
                when 'delete' then output += '![DELETE](https://github.com/alexneises/ApiDocsMD/delete.png)\n'
                else output += _.upperCase innerValue[0].type
            output += '[Back to top](#top)\n'

    fs.writeFile argv.o, output, (err) =>
        if err
            throw err
        return next 'File written to ' + argv.o
load (data) ->
    console.log data