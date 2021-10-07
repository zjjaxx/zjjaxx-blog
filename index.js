Promise._all = function (array) {
    let count = 0
    const result = []
    const array_promisify = array.map(item => Promise.resolve(item))
    return new Promise((resolve, reject) => {
        array_promisify.forEach(promise => {
            promise.then(res => {
                count++
                result.push(res)
                if (count >= array.length) {
                    resolve(result)
                }
            }, error => {
                reject(error)
            })
        })
    })
}

const testList = new Array(5).fill({}).map(() => new Promise((resolve, reject) => {
    setTimeout(() => {
        const random = Math.random() * 10
        if (random < 10) {
            console.log("random is", random)
            resolve("ok")
        }
        else {
            reject("error") 
        }
    }, 1000)
}))
console.log("testList", testList)
Promise._all(testList).then(res => {
    console.log("success", res)
}, error => {
    console.log("error is", error)
})