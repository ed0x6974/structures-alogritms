/*
    Implement a vector on top of a typed array

    The vector must support the same deque-like interface as native JS arrays.

    const u16vec = new Vector(Uint16Array, { capacity: 64 });

    u16vec.push(42);         // 1
    u16vec.push(7, 9);       // 3

    u16vec.pop();            // 9
    u16vec.shift();          // 42

    u16vec.unshift(500);     // 2
    console.log(u16vec.length); // 2
*/

class Vector {
    #array = null;
    #filledLength = null;
    #TypedArray = null;

    constructor(TypedArray, params) {
        const {
            capacity
        } = params;

        this.#array = new TypedArray(capacity || 10);
        this.#filledLength = 0;
        this.#TypedArray = TypedArray;
    }

    hasCapacity(n) {
        return this.#filledLength + n <= this.#array.length;
    }

    getNewLength(newElemsLength) {
        return Math.max(
            this.#array.length * 2, 
            ((this.#filledLength + newElemsLength) * 2)
        );
    }

    forEach(callback) {
        for (let i = 0; i < this.#filledLength; i++) {
            callback(this.#array[i], i);
        }
    }

    push(...elems) {
        if (!this.hasCapacity(elems.length)) {
            const newLength = this.getNewLength(elems.length);
            const newArray = new this.#TypedArray(newLength);

            this.forEach((elem, index) => newArray[index] = elem);

            this.#array = newArray;
        }

        elems.forEach(elem => {
            this.#array[this.#filledLength] = elem;
            this.#filledLength++; 
        })

        return this.#filledLength;
    }

    unshift(...elems) {
        if (!this.hasCapacity(elems.length)) {
            const newLength = this.getNewLength(elems.length);
            const newArray = new this.#TypedArray(newLength);

            let newArrayFilledLength = 0;

            elems.forEach(elem => {
                newArray[newArrayFilledLength] = elem;
                newArrayFilledLength++;
            })

            this.forEach((elem) => {
                newArray[newArrayFilledLength] = elem;
                newArrayFilledLength++;
            });

            this.#array = newArray;
            this.#filledLength = newArrayFilledLength;
        } else {
            const needEmptyPlaces = elems.length;
         
            this.forEach((elem, index) => {
                this.#array[index + needEmptyPlaces] = elem;
            });

            elems.forEach((elem, index) => {
                this.#array[index] = elem;
            })

            this.#filledLength = this.#filledLength + needEmptyPlaces;
        }

        return this.#filledLength;
    }

    pop() {
        if (this.#filledLength === 0) {
            throw new Error('array is empty');
        }

        const result = this.#array[this.#filledLength - 1];

        this.#filledLength--;

        return result;
    }

    shift() {
        if (this.#filledLength === 0) {
            throw new Error('array is empty');
        }

        const result = this.#array[0];

        this.forEach((elem, index) => {
            if (index === 0) {
                return;
            } 

            this.#array[index - 1] = elem;
        });

        this.#filledLength--;

        return result;
    }

    get length() {
        return this.#filledLength;
    }
}

const vector = new Vector(Uint8Array, {capacity: 2});
console.log(vector.push(10));
console.log(vector.push(20));
console.log(vector.push(30));
console.log(vector.push(40));
console.log(vector.pop());
console.log(vector.push(50));
console.log(vector.length);
console.log(vector.unshift(100, 100, 100, 100));
console.log(vector.shift());
console.log(vector.shift());
console.log(vector.shift());
console.log(vector.shift());
console.log(vector.shift());
console.log(vector.shift());
console.log(vector.shift());
console.log(vector.length);

console.log('====');

const u16vec = new Vector(Uint16Array, { capacity: 64 });
console.log(u16vec.push(42));         // 1
console.log(u16vec.push(7, 9));       // 3
console.log(u16vec.pop());            // 9
console.log(u16vec.shift());          // 42
console.log(u16vec.unshift(500));     // 2
console.log(u16vec.length); // 2