/*
    Implement universal binary search functions.
    The functions must accept comparators that return -1 if the element is less than the target value, 1 if it is greater, and 0 if they are equal.

    console.log(bisecLeft([1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 8, 9], (el) => {
        if (el < 7) return -1;
        if (el > 7) return 1;
        return 0;
    }));  // 6
    console.log(bisecRight([1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 8, 9],  (el) => {
        if (el < 7) return -1;
        if (el > 7) return 1;
        return 0;
    })); // 9
*/

function bisecLeft(array, compare) {
    function recBisecLeft(array, compare, indexFrom, indexTo) {
        if (array.length === 0) {
            return null;
        }

        if (array.length === 1) {
            if (compare(array[0]) === 0) {
                return indexFrom;
            } else {
                return null;
            }
        }

        const middleIndex = array.length % 2 === 0 
            ? array.length / 2 - 1
            : Math.floor(array.length / 2)
        const el = array[middleIndex]

        const goLeftParams = [
            array.slice(0, middleIndex), 
            compare, 
            indexFrom, 
            middleIndex - 1
        ];

        const goRightParams = [
            array.slice(middleIndex + 1), 
            compare, 
            indexFrom + middleIndex + 1, 
            indexTo
        ]

        if (compare(el) === 0) {
            if (middleIndex !== 0) {
                const index = recBisecLeft(...goLeftParams);

                if (index !== null) {
                    return index;
                }
            }

            return indexFrom + middleIndex;
        }

        if (compare(el) === -1) return recBisecLeft(...goRightParams);
        if (compare(el) === 1) return recBisecLeft(...goLeftParams);  
    }

    return recBisecLeft(array, compare, 0, array.length - 1);
}

console.log(bisecLeft([1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 8, 9], (el) => {
        if (el < 7) return -1;
        if (el > 7) return 1;
        return 0;
    }))


const arr = [1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 8, 9];

console.log(bisecLeft(arr, (el) => {
    if (el < 7) return -1;
    if (el > 7) return 1;
    return 0;
})); // Expected: 6 (first 7)

console.log(bisecLeft(arr, (el) => {
    if (el < 1) return -1;
    if (el > 1) return 1;
    return 0;
})); // Expected: 0

console.log(bisecLeft(arr, (el) => {
    if (el < 9) return -1;
    if (el > 9) return 1;
    return 0;
})); // Expected: 11

console.log(bisecLeft(arr, (el) => {
    if (el < 10) return -1;
    if (el > 10) return 1;
    return 0;
})); // Expected: null

console.log(bisecLeft([5], (el) => {
    if (el < 5) return -1;
    if (el > 5) return 1;
    return 0;
})); // Expected: 0

console.log(bisecLeft([5], (el) => {
    if (el < 6) return -1;
    if (el > 6) return 1;
    return 0;
})); // Expected: null

console.log(bisecLeft([], (el) => {
    if (el < 1) return -1;
    if (el > 1) return 1;
    return 0;
})); // Expected: null


function bisecRight(array, compare) {
    function recBisecRight(array, compare, indexFrom, indexTo) {
        if (array.length === 0) {
            return null;
        }

        if (array.length === 1) {
            if (compare(array[0]) === 0) {
                return indexFrom;
            } else {
                return null;
            }
        }

        const middleIndex = array.length % 2 === 0 
            ? array.length / 2 - 1
            : Math.floor(array.length / 2)
        const el = array[middleIndex]

        const goLeftParams = [
            array.slice(0, middleIndex), 
            compare, 
            indexFrom, 
            middleIndex - 1
        ];

        const goRightParams = [
            array.slice(middleIndex + 1), 
            compare, 
            indexFrom + middleIndex + 1, 
            indexTo
        ]

        if (compare(el) === 0) {
            if (middleIndex !== 0) {
                const index = recBisecRight(...goRightParams);

                if (index !== null) {
                    return index;
                }
            }

            return indexFrom + middleIndex;
        }

        if (compare(el) === -1) return recBisecRight(...goRightParams);
        if (compare(el) === 1) return recBisecRight(...goLeftParams);  
    }

    return recBisecRight(array, compare, 0, array.length - 1);
}

console.log('bisecRight');

console.log(bisecRight(arr, (el) => {
    if (el < 7) return -1;
    if (el > 7) return 1;
    return 0;
})); // Expected: 9 (last 7)

console.log(bisecRight(arr, (el) => {
    if (el < 1) return -1;
    if (el > 1) return 1;
    return 0;
})); // Expected: 0

console.log(bisecRight(arr, (el) => {
    if (el < 9) return -1;
    if (el > 9) return 1;
    return 0;
})); // Expected: 11

console.log(bisecRight(arr, (el) => {
    if (el < 10) return -1;
    if (el > 10) return 1;
    return 0;
})); // Expected: null

console.log(bisecRight([5], (el) => {
    if (el < 5) return -1;
    if (el > 5) return 1;
    return 0;
})); // Expected: 0

console.log(bisecRight([5], (el) => {
    if (el < 6) return -1;
    if (el > 6) return 1;
    return 0;
})); // Expected: null

console.log(bisecRight([], (el) => {
    if (el < 1) return -1;
    if (el > 1) return 1;
    return 0;
}));  // Expected: null