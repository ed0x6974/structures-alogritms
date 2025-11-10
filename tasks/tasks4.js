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


/*
    Implement a Class for Describing a 3D Matrix

    const matrix = new Matrix3D({x: 5, y: 5, z: 5});

    matrix.set({x: 2, y: 1, z: 3}, 42);
    console.log(matrix.get({x: 2, y: 1, z: 3})); // 42
*/

class Matrix3D {
    #array
    #xLength
    #yLength
    #zLength

    constructor({x, y, z}) {
        if (Math.min(x,y,z) < 1) {
            throw new Error('invalid matrix');
        }

        this.#xLength = x;
        this.#yLength = y;
        this.#zLength = z;

        this.#array = new Float32Array(this.#xLength*this.#yLength*this.#zLength);
    }

    getIndex({x, y, z}) {
        return (x*this.#yLength*this.#zLength) + (y*this.#zLength) + (z);
    }

    set({x, y, z}, value) {
        if (Math.min(x, y, z) < 0 || x >= this.#xLength || y >= this.#yLength || z >= this.#zLength) {
            throw new Error('coords are invalid');
        }

        const index = this.getIndex({x,y,z});
        this.#array[index] = value;
    }

    get({x, y, z}) {
        if (x >= this.#xLength || y >= this.#yLength || z >= this.#zLength) {
            throw new Error('coords are invalid');
        }
        
        const index = this.getIndex({x,y,z});
        return this.#array[index];
    }
}

const matrix = new Matrix3D({x: 3, y: 3, z: 3});

for (let z = 0; z < 3; z++) {
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            matrix.set({x, y, z}, z + 1);
        }
    }
}

console.log(matrix);


/*
    Implement a class that creates a hash table

    As keys we must be able to use primitives and objects.
    You can invent any hash algorithm.

    Collisions can be resolved either with separate chaining or with open addressing.
    Resizing / rehashing of the internal buffer must be supported.

    // set initial capacity of internal buffer
    const map = new HashMap(256);

    map.set('email', 'a@b.c');
    map.set(1337, 'leet');
    map.set(window, { sessionId: 'xyz' });

    console.log(map.get(1337));         // "leet"
    console.log(map.has(window));       // true
    console.log(map.delete(window));    // { sessionId: 'xyz' }
    console.log(map.has(window));       // false
*/

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class LinkedList {
    constructor() {
        this.first = null;
    }

    push(value) {
        const node = new Node(value);
        
        if (this.first === null) {
            this.first = node;
        } else {
            node.next = this.first;
            this.first.prev = node;
            this.first = node;
        }
    }

    delete(node) {
        if (this.first === node) {
            this.first = this.first.next;
        } else {
            node.prev.next = node.next;

            if (node.next) {
                node.next.prev = node.prev;
            }
        }

        return node.value;
    }
}

class HashMap {
    #capacity
    #buffer

    constructor(capacity) {
        if (this.isPrime(capacity)) {
            this.#capacity = capacity;
        } else {
            let testCapacity = capacity + 1; 

            while (!this.isPrime(testCapacity)) {
               testCapacity++;
            }

            this.#capacity = testCapacity;
        }

        this.#buffer = Array.from({ length: this.#capacity }, () => new LinkedList());
    }

    resizeBuffer(capacity) {
        const oldBuffer = this.#buffer; 

        if (this.isPrime(capacity)) {
            this.#capacity = capacity;
        } else {
            let testCapacity = capacity + 1; 

            while (!this.isPrime(testCapacity)) {
               testCapacity++;
            }

            this.#capacity = testCapacity;
        }

        this.#buffer = Array.from({ length: this.#capacity }, () => new LinkedList());


        oldBuffer.forEach((list) => {
            let elem = list.first;

            while (elem) {
                const {
                    key,
                    value,
                } = elem.value;

                this.set(key, value);
                elem = elem.next;
            }
        })
    }

    isPrime(value) {
        if (value < 2) {
            return false;
        }

        if (value === 2) {
            return true;
        }

        if (value % 2 === 0) {
            return false;
        }

        for (let i = 3; i <= Math.floor(Math.sqrt(value)); i = i+2){
            if (value % i === 0) return false;
        }

        return true;
    }

    generateHash(value) {
        if (value && typeof value === "object") {
            const uniqueNumberShuffled = function() {
                let t = Date.now();
                t ^= (t << 21);
                t ^= (t >>> 35);
                t ^= (t << 4);
                return t >>> 0;
            }

            if (!value.task4Hash || value.task4Capacity !== this.#capacity) {
                const hash = uniqueNumberShuffled() % this.#capacity;
                value.task4Hash = hash;
                value.task4Capacity = this.#capacity;
            }
        
            return value.task4Hash;
        } else {
            const string = value.toString();
            let hash = 1;

            for (let i = 0; i < string.length; i++) {
                hash = ((hash * 31 + string.charCodeAt(i)) >>> 0) % this.#capacity; // Horner's method
            }

            return hash;
        }
    }

    searchInList(list, key) {
        let elem = list.first;

        while (elem && elem.value.key !== key) {
            elem = elem.next;
        }

        return elem;
    }

    has(key) {
        const index = this.generateHash(key);
        return Boolean(this.searchInList(this.#buffer[index], key));
    }

    set(key, value) {
        const index = this.generateHash(key);

        if (!this.#buffer[index].first) {
            this.#buffer[index].push({
                key,
                value,
            }) 
        } else {
            const list = this.#buffer[index];

            const elem = this.searchInList(list, key);

            if (elem) {
                elem.value.value = value;
            } else {
                list.push({
                    key,
                    value,
                })
            }
        }
    }

    get(key) {
        const index = this.generateHash(key);

        if (this.#buffer[index]) {
            const list = this.#buffer[index];

            const elem = this.searchInList(list, key);

            if (elem) {
                return elem.value.value;
            } else {
                return null;
            }

        } else {
            return null;
        }
    }

    delete(key) {
        const index = this.generateHash(key);

        if (this.#buffer[index]) {
            const list = this.#buffer[index];

            const elem = this.searchInList(list, key);

            if (elem) {
                return list.delete(elem).value;
            }
        }
    }
}

const map = new HashMap(256);

map.set('email', 'a@b.c');
map.set(1337, 'leet');
map.set(window, { sessionId: 'xyz' });

console.log(map.get(1337));         // "leet"
console.log(map.has(window));       // true
console.log(map.delete(window));    // { sessionId: 'xyz' }
console.log(map.has(window));       // false

map.resizeBuffer(15);
console.log(map.get(1337));
console.log(map.has(window));
console.log(map.has('email'));
console.log(map.get('email'));
