var fs = require('fs')
var path = require('path')

console.log(`goooood morning, let's randomize some filenames.. ><>\``)
var prefix = process.argv[2] || ''
var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p']
var random = () => (chars[Math.trunc(Math.random() * 16)])

fs.readdir('./', (err, files) => {
  for (const file of files) {
    // continue if hidden file
    if (file[0] === '.') continue
    
    // delete  if ableton file
    var extension = path.extname(file)
    if (extension === '.asd') {
      fs.unlinkSync(file)
      console.log(`ableton file: ${file} was deleted..`)
      continue
    }
    // generate random string
    var rdmStr = ['r','a','n','d','o','m'].map(() => (random())).join('')
    fs.renameSync(file, `${prefix}${rdmStr}${extension}`)
  }
})