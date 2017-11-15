const arr = process.argv


let sum = 0

for (let i = 2; i < arr.length - 2; i++) {
			sum += parseInt(arr[i])
}
console.log(sum)