let a = [1, 2, 34, 5]
console.log(a.slice(1))

function b(x, y, z) {
    console.log(x, y, z)
}

b(...a.slice(1))