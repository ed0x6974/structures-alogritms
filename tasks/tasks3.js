class StackNode {
    constructor(value, prevNode) {
        this.value = value;
        this.prevNode = prevNode;
    }
}

class Stack {
    constructor() {
        this.headNode = null;
    }

    push(value) {
        if (!this.headNode) {
            const newNode = new StackNode(value, null);
            this.headNode = newNode;
        } else {
            const newNode = new StackNode(value, this.headNode);
            this.headNode = newNode;
        }
    }

    pop() {
        if (!this.headNode) {
            throw new Error('stack is empty');
        }

        const node = this.headNode;
        
        this.headNode = this.headNode.prevNode;

        return node.value;
    }

    get head() {
        if (this.headNode) {
            return this.headNode.value;
        }
    }
}

/*
    Deep Object Flattening

   You need to write a function that flattens a nested object into a single-level object.
   The task should be solved in at least two ways: using recursion and using a stack. You can also solve it using a queue.

    const obj = {
        a: {
            b: [1, 2],
            '': { c: 2 }
        }
    };

    // Flattened result:
    {'a.b.0': 1, 'a.b.1': 2, 'a..c': 2}

    console.log(flatten(obj))
*/

function flattenStack(object) {
    let result = [];
    const stack = new Stack();

    for (let key in object) {
        stack.push({
            keys: [key], 
            value: object[key],
        });
    }

    while (stack.head) {
        const {
            keys,
            value,
        } = stack.pop();


       if (value !== null && typeof value === 'object') {
            for (let key in value) {
                stack.push({
                    keys: [...keys, key],
                    value: value[key],
                });
            }
        } else {
            result.push(
                {
                    key: keys.join('.'),
                    value: value,
                }
            )
        }
    }

    function convertCollapsed(array) {
        const obj = {};
        
        array.forEach(elem => {
            obj[elem.key] = elem.value;
        })

        return obj;
    }

    return convertCollapsed(result);
}

function flatten(object) {
    function collapse(object) {
        let result = [];

        for (let key in object) {
            const value = object[key];

            if (value !== null && typeof value === 'object') {
                result.push(
                    ...collapse(value).map((obj) => {
                        obj.key = `${key}.${obj.key}`;
                        return obj;
                    })
                )
            } else {
                result.push({
                    key,
                    value,
                });
            }
        }

        return result;
    }

    function convertCollapsed(array) {
        const obj = {};
        
        array.forEach(elem => {
            obj[elem.key] = elem.value;
        })

        return obj;
    }

    console.log(collapse(object));

    return convertCollapsed(collapse(object));
}

console.log(flatten({
    a: {
        b: {
            c: 1,
            d: 2
        },
        c: {
            k: [1, 2, 3], 
            r: {
                l: "232",
                ddd: "222",
                "": {
                    j: 2,
                    y: 222,
                },
            }
        }
    }
}));

console.log('====');
console.log(flattenStack({
    a: {
        b: {
            c: 1,
            d: 2
        },
        c: {
            k: [1, 2, 3], 
            r: {
                l: "232",
                ddd: "222",
                "": {
                    j: 2,
                    y: 222,
                },
            }
        }
    }
}));
console.log('====');


/*
    Bracket Group Validation

    You need to write a function that takes a string and returns true if every {, [, and ( has a matching closing bracket and they are in the correct order.

    console.log(isValid('([abc]{123})'));   // true
    console.log(isValid('([abc]{123})['));  // false
    console.log(isValid(')('));             // false
*/

function isValid(str) {
    const stack = new Stack();

    const openedBreakets = ['{', '[', '('];
    const closedBreakets = ['}', ']', ')'];

    const bracketPairs = new Map();
    bracketPairs.set('}', '{');
    bracketPairs.set(']', '[');
    bracketPairs.set(')', '(');

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (openedBreakets.includes(char)) {
            stack.push(char);
        } else if (closedBreakets.includes(char)) {
            if (!bracketPairs.has(char)) {
                throw new Error("Pair didn't find for this closed breaket");
            }

            if (!stack.head) {
                return false;
            }

            const openedBreaket = bracketPairs.get(char);
            const lastOpenedBreaket = stack.pop();

            if (openedBreaket !== lastOpenedBreaket) {
                return false;
            }
        }
    }

    if (stack.head) {
        return false;
    }

    return true;
}

console.log(isValid('([abc]{123})'));   // true
console.log(isValid('([abc]{123})['));  // false
console.log(isValid(')('));             // false