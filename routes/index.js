var stylus = require('stylus'),
    fs = require('fs');

function getUncompiledSheet() {
    var uncompiledSheet = new Promise(
        function(resolve, reject) {
            fs.readFile(__dirname + '/../public/stylesheets/style.styl',
                function (err, str) {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(str);
                    }
                })
        }
    );
    return uncompiledSheet;
}

function getCompiledSheet(uncompiledPromise) {
    var compiledSheet = uncompiledPromise.then( function(sheet) {
            return new Promise(function(resolve, reject) {
                stylus(sheet.toString())
                    .set('filename', 'stylesheet.styl')
                    .render(function (err, compiled) {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(compiled);
                        }
                    });
            });
        }
    );
    return compiledSheet;
}




module.exports = {
    stylesheet: function(req, res) {
        getCompiledSheet(getUncompiledSheet()).then(
            function(compiled) {
                res.type('text/css');
                res.send(compiled);
            }
        ).catch(function(err) {
                res.send(err);
                throw err;
            });
    }
};