let info = "[a(aa,bb)]"
let a = info.match(/(?<=\()[\w,]*(?=\))/)
console.log(a)