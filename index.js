/**
 * Created by jy25 on 10/23/14.
 */
var program = require("commander");
var cwd = process.cwd();
var fs = require("fs");
var path = require("path");
var Minimatch = require("minimatch").Minimatch;

program
  .version("0.0.1")
  .usage("[options] <pattern>")
  .option("-r, --recursion", "recursion remove")
  .option("-l, --list", "list matched file without remove")
  .parse(process.argv);

if(!program.args || program.args.length === 0){
  console.error("Please provider file pattern.");
  process.exit();
}

var mm = new Minimatch(program.args[0])
var needRemoved = [];

function removeFile(dir){
  var files = fs.readdirSync(dir);
  files.forEach(function(f){
    var cp = path.join(dir, f);
    var stat = fs.statSync(cp);
    if(stat.isFile() && mm.match(f)){
      needRemoved.push(cp);
    }
    else if (stat.isDirectory() && program.recursion){
      removeFile(cp);
    }
  });
}

removeFile(cwd);

if(needRemoved.length === 0){
  console.info("No file found");
}
else if (program.list){
  needRemoved.forEach(function(f){
    console.info(f);
  });
}
else{
  needRemoved.forEach(function(f){
    fs.unlinkSync(f);
    console.info("Deleted file: " + f);
  });
}

