/*
    Implement an array sorting function using the Heap Sort algorithm. The algorithm must work in-place (without additional memory).
*/

(function helper() {
    window.drawHeap = function(...args) {
        const run = () => {
            drawHeapSnapshot(...args);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run, { once: true });
        } else {
            run();
        }
    };

    function drawHeapSnapshot(dataArray, titleText = "Heap Snapshot") {
        const parentContainer = document.getElementById('canvas');
        
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = "40px";
        wrapper.style.textAlign = "center";
        
        const title = document.createElement('h3');
        title.textContent = titleText;
        title.style.margin = "0 0 10px 0";
        title.style.color = "#333";
        wrapper.appendChild(title);
        
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 300;
        canvas.style.border = "1px solid #ddd";
        canvas.style.borderRadius = "8px";
        canvas.style.backgroundColor = "#fff";
        wrapper.appendChild(canvas);
        
        parentContainer.appendChild(wrapper);
        
        const ctx = canvas.getContext('2d');
        
        renderStep(ctx, dataArray, 0, canvas.width / 2, 40, canvas.width / 4);
    }

    function renderStep(ctx, arr, i, x, y, offsetX) {
        if (i >= arr.length) return;

        const left = 2 * i + 1;
        const right = 2 * i + 2;

        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 1;

        if (left < arr.length) {
            drawLine(ctx, x, y, x - offsetX, y + 60);
            renderStep(ctx, arr, left, x - offsetX, y + 60, offsetX / 2);
        }
        if (right < arr.length) {
            drawLine(ctx, x, y, x + offsetX, y + 60);
            renderStep(ctx, arr, right, x + offsetX, y + 60, offsetX / 2);
        }

        drawNode(ctx, x, y, arr[i], i);
    }

    function drawNode(ctx, x, y, value, index) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = "#888";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`idx: ${index}`, 0, -25);

        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#61dafb";
        ctx.fill();
        ctx.strokeStyle = "#282c34";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = "#000";
        ctx.font = "bold 14px Arial";
        ctx.textBaseline = "middle";
        ctx.fillText(value, 0, 0);
        
        ctx.restore();
    }

    function drawLine(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
})();

function sortHeap(array, comparator) {
    let currentSize = array.length;
    let temp = array[0];

    const trickleDown = (array, index, comparator) => {
        const leftIndex = 2 * index + 1;
        const rightIndex = 2 * index + 2;

        if (rightIndex < currentSize) {
            const left = array[leftIndex];
            const right = array[rightIndex];

            const childIndex = comparator(left, right) > 0 ? rightIndex : leftIndex;

            if (comparator(array[index], array[childIndex]) > 0) {
                temp = array[index];
                array[index] = array[childIndex];
                array[childIndex] = temp;

                trickleDown(array, childIndex, comparator);
            }
        } else if (leftIndex < currentSize) {
            if (comparator(array[index], array[leftIndex]) > 0) {
                temp = array[index];
                array[index] = array[leftIndex];
                array[leftIndex] = temp;

                trickleDown(array, leftIndex, comparator);
            }
        }
    }

    window.drawHeap(array, 'random array');

    for (let i = Math.floor(currentSize / 2 - 1); i >= 0; i--) {
        trickleDown(array, i, comparator);
    }

    window.drawHeap(array, 'heap');

    let step = 0;
    
    while (currentSize > 1) {
        step++;
        const elem = array[0];
        currentSize = currentSize - 1;

        array[0] = array[currentSize];
        trickleDown(array, 0, comparator);
        array[currentSize] = elem;

        drawHeap(array.slice(0, currentSize), `Sort step ${step} | popped index ${0}, value ${elem}`);
    }

    console.log(array);
}


const array = [1, 34, 432, 43, 0, -23, 43, 523, 34, 4242, 100, 2000, 4, 5, 0];

sortHeap(array, (v1, v2) => v1 - v2);
sortHeap([...array], (v1, v2) => v2 - v1);


