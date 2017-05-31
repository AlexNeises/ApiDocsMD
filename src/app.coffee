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
        output += '- [' + key + '](#' + _.replace(_.toLower(key), /\s/g, '-') + ')\n'
        _.forEach value, (innerValue, innerKey) ->
            output += '\t- [' + innerKey + '](#' + _.replace(_.toLower(innerKey), /\s/g, '-') + ')\n'

    _.forEach groupData, (value, key) ->
        output += '## ' + key + '\n'
        _.forEach value, (innerValue, innerKey) ->
            output += '### ' + innerKey + '\n'
            if innerValue[0].title?
                output += innerValue[0].title + '\n\n'
            if innerValue[0].type?
                switch _.toLower innerValue[0].type
                    when 'get'    then output += '<img src="https://github.com/alexneises/ApiDocsMD/raw/master/get.png" height="24" />\n\n'
                    when 'post'   then output += '<img src="https://github.com/alexneises/ApiDocsMD/raw/master/post.png" height="24" />\n\n'
                    when 'put'    then output += '<img src="https://github.com/alexneises/ApiDocsMD/raw/master/put.png" height="24" />\n\n'
                    when 'delete' then output += '<img src="https://github.com/alexneises/ApiDocsMD/raw/master/delete.png" height="24" />\n\n'
                    else output += _.toUpper innerValue[0].type
            if innerValue[0].url?
                output += '`' + innerValue[0].url + '`\n\n'
            if innerValue[0].header?
                if innerValue[0].header.fields?
                    output += '#### Headers\n'
                    output += '|Type|Field|Description|\n'
                    output += '|--- |---  |---        |\n'
                    _.forEach innerValue[0].header.fields.Header, (field) ->
                        opt  = if field.optional is true then '(optional) '     else ''
                        type = if field.type?            then field.type        else ''
                        newf = if field.field?           then field.field       else ''
                        desc = if field.description?     then field.description else ''
                        output += '|`' + type + '`|' + newf + '|' + opt + desc + '|\n'
                    output += '\n\n'
                if innerValue[0].header.examples?
                    output += '#### Header Examples\n'
                    output += '|Type|Content|\n'
                    output += '|--- |---    |\n'
                    _.forEach innerValue[0].header.examples, (field) ->
                        type = if field.type?    then field.type    else ''
                        cont = if field.content? then field.content else ''
                        output += '|`' + type + '`|<pre>' + _.replace(cont, /\n/g, '<br>') + '</pre>|'
                    output += '\n\n'
            if innerValue[0].parameter?
                if innerValue[0].parameter.fields?
                    output += '#### Parameters\n'
                    output += '|Type|Field|Description|\n'
                    output += '|--- |---  |---        |\n'
                    _.forEach innerValue[0].parameter.fields.Parameter, (field) ->
                        opt  = if field.optional is true then '(optional) '     else ''
                        type = if field.type?            then field.type        else ''
                        newf = if field.field?           then field.field       else ''
                        desc = if field.description?     then field.description else ''
                        output += '|`' + type + '`|' + newf + '|' + opt + desc + '|\n'
                    output += '\n\n'
                if innerValue[0].parameter.examples?
                    output += '#### Examples\n'
                    _.forEach innerValue[0].parameter.examples, (field) ->
                        output += '```bash\n'
                        output += field.content + '\n'
                        output += '```\n'
                    output += '\n\n'
            output += '[Back to top](#top)\n\n\n'

    fs.writeFile argv.o, output, (err) =>
        if err
            throw err
        return next 'File written to ' + argv.o
load (data) ->
    console.log data