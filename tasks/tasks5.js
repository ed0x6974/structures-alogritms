/*
    Implement a graph using matrix-based structures (adjacency matrix) as well as using adjacency lists.
    Create several variants for both directed graphs (digraphs) and undirected graphs.
    Visualize the graphs as an image using SVG markup.

    The API should provide functionality to check relationships, for example, that A is a parent of B, etc.
    The API should allow describing directed graphs, undirected graphs, as well as adjacency graphs. It should also allow adding weights to all edges.

    Implement transitive closure

    Implement iterators that perform depth-first and breadth-first traversals of a graph, as well as a topological sorting method.
*/

class GraphVisual {
    constructor({
        width = 1000,
        height = 1000,
        vertexRadius = 50,
        isWeighted = false,
    }){
        this.isWeighted = isWeighted;
        const svgns = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(svgns, "svg");
        this.maxX = width-vertexRadius;
        this.maxY = width-vertexRadius;
        this.radius = vertexRadius;

        this.svg.setAttribute("width", width);
        this.svg.setAttribute("height", height);
        this.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        this.svg.setAttribute("style", "border: 1px solid #ccc; background: #f9f9f9;");

        let $wrapper = document.getElementById("graphVisual");

        if ($wrapper) {
            $wrapper.innerHTML = null;
        } else {
            $wrapper = document.createElement('div');
            $wrapper.id = "graphVisual";
            document.body.appendChild($wrapper);
        }

        $wrapper.appendChild(this.svg);

        this.vertexes = Array();
        this.edges = Array();
    } 

    checkNewPosition(xPos1, yPos1) {
        for (let i = 0; i < this.vertexes.length; i++) {
            const {
                xPos: xPos2,
                yPos: yPos2,
            } = this.vertexes[i];

            const dx = xPos2 - xPos1;
            const dy = yPos2 - yPos1;

            const d = Math.sqrt(dx*dx + dy*dy);

            if (d <= (this.radius * 2)) {
                return false;
            }
        }

        return true;
    }

    drawVertex(key, text) {
        const generateRandomNumber = (min, max) => {
            return Math.floor(Math.random() * (max) + min)
        };

        let xPos = generateRandomNumber(this.radius, this.maxX - this.radius);
        let yPos = generateRandomNumber(this.radius, this.maxY - this.radius);

        while (!this.checkNewPosition(xPos, yPos)) {
            xPos = generateRandomNumber(this.radius, this.maxX - this.radius);
            yPos = generateRandomNumber(this.radius, this.maxY - this.radius); 
        }

        const svgns = "http://www.w3.org/2000/svg";

        const $circle = document.createElementNS(svgns, "circle");
        $circle.setAttribute("cx", xPos);
        $circle.setAttribute("cy", yPos);
        $circle.setAttribute("r", this.radius);
        $circle.setAttribute("fill", "skyblue");

        this.svg.appendChild($circle);

        const $text = document.createElementNS(svgns, "text");
        $text.setAttribute("x", xPos);
        $text.setAttribute("y", yPos);
        $text.setAttribute("text-anchor", "middle");
        $text.setAttribute("dominant-baseline", "middle");
        $text.setAttribute("font-size", "20");
        $text.setAttribute("fill", "black");
        $text.textContent = text;
        this.svg.appendChild($text);

        this.vertexes.push({
            key,
            xPos,
            yPos,
            circle: $circle,
            text: $text,
        })
    }

    removeVertex(key) {
        const index = this.vertexes.findIndex(v => v.key === key);

        if (index === -1) return;

        const vertex = this.vertexes[index];
        const {
            text,
            circle,
        } = vertex;

        this.svg.removeChild(text);
        this.svg.removeChild(circle);
        this.vertexes.splice(index, 1);
    }

    drawEdge(vertexKey1, vertexKey2, isDirected, weight) {
        const vertex1 = this.vertexes.find(v => v.key === vertexKey1);
        const vertex2 = this.vertexes.find(v => v.key === vertexKey2);

        if (!vertex1 || !vertex2) {
            throw new Error('some vertex is not found');
        }

        if (!isDirected) {
            const isAlreadyAdded = Boolean(this.edges.find(edge => {
                return (edge.vertexKey1 === vertexKey2 && edge.vertexKey2 === vertexKey1);
            }));

            if (isAlreadyAdded) return;
        }

        const {
            xPos: xPos1,
            yPos: yPos1,
        } = vertex1;

        const {
            xPos: xPos2,
            yPos: yPos2,
        } = vertex2;

        if (xPos2 === xPos1 && yPos2 === yPos1) {
            console.error('loop is not implemented, skipping...');
            return;
        }

        const dx = xPos2 - xPos1;
        const dy = yPos2 - yPos1;

        const dist = Math.sqrt(dx*dx + dy*dy)
        const nx = dx / dist;
        const ny = dy / dist;
        const ax = xPos1 + nx * this.radius;
        const ay = yPos1 + ny * this.radius;
        const bx = xPos2 - nx * this.radius;
        const by = yPos2 - ny * this.radius;

        const svgns = "http://www.w3.org/2000/svg";

        const $line = document.createElementNS(svgns, "line");
        $line.setAttribute("x1", ax);
        $line.setAttribute("y1", ay);
        $line.setAttribute("x2", bx);
        $line.setAttribute("y2", by);
        $line.setAttribute("stroke", "black");
        $line.setAttribute("stroke-width", 2);

        let $path = null;
        if (isDirected) {
            let $defs = this.svg.querySelector("defs");
            if (!$defs) {
                $defs = document.createElementNS(svgns, "defs");
                this.svg.appendChild($defs);
            }

            const $marker = document.createElementNS(svgns, "marker");
            $marker.setAttribute("id", "arrow");
            $marker.setAttribute("markerWidth", "10");
            $marker.setAttribute("markerHeight", "10");
            $marker.setAttribute("refX", "10");
            $marker.setAttribute("refY", "3");
            $marker.setAttribute("orient", "auto");
            $marker.setAttribute("markerUnits", "strokeWidth");

            const $path = document.createElementNS(svgns, "path");
            $path.setAttribute("d", "M0,0 L10,3 L0,6 z");
            $path.setAttribute("fill", "black");

            $marker.appendChild($path);
            $defs.appendChild($marker);
            $line.setAttribute("marker-end", "url(#arrow)");
        }

        let text = null;

        if (this.isWeighted) {
            const midX = (ax + bx) / 2;
            const midY = (ay + by) / 2;

            const offset = 10;
            const textX = midX - ny * offset;
            const textY = midY + nx * offset;

            const $text = document.createElementNS(svgns, "text");
            $text.setAttribute("x", textX);
            $text.setAttribute("y", textY);
            $text.setAttribute("fill", "red");
            $text.setAttribute("font-size", "24");
            $text.setAttribute("text-anchor", "middle");
            $text.setAttribute("dominant-baseline", "middle");
            $text.textContent = weight;

            this.svg.appendChild($text);
            text = $text;
        }

        this.svg.appendChild($line);
        this.edges.push({
            vertexKey1,
            vertexKey2,
            line: $line,
            path: $path,
            text,
        })
    }

    removeEdge(vertexKey1, vertexKey2) {
        const index = this.edges.findIndex(edge => edge.vertexKey1 === vertexKey1 && edge.vertexKey2 === vertexKey2);

        if (index === -1) {
            return;
        }

        const edge = this.edges[index];
        const {
            line: $line,
            path: $path,
            text: $text,
        } = edge;
        
        this.svg.removeChild($line);
        if ($path) {
            this.svg.removeChild($path);
        }
        if ($text) {
            this.svg.removeChild($text);
        }
        this.edges.splice(index, 1);
    }

    cleanup() {
        const vertexesKeys = this.vertexes.map(({key}) => key);
        const edgesKeys = this.edges.map(({vertexKey1, vertexKey2}) => {
            return {
                vertexKey1,
                vertexKey2,
            }
        });

        vertexesKeys.forEach((key) => {
            this.removeVertex(key);
        });

        edgesKeys.forEach(({
            vertexKey1,
            vertexKey2,
        }) => {
            this.removeEdge(
                vertexKey1,
                vertexKey2
            )
        });
    }
}

class MatrixGraph {
    maxNodeSize;
    #buffer;
    isWeighted;

    constructor(maxNodeSize = 100, type="undirected", weightType = "nonWeighted", initialData) {
        if (weightType !== "weighted" && weightType !== "nonWeighted") {
            throw new Error('invalid weight type');
        }

        this.maxNodeSize = maxNodeSize; // will be reserved to store vertexes (0 = empty / 1 = vertex set)
        if (weightType === "weighted") {
            this.isWeighted = true;
            this.MAX_WEIGHT = 2147483647 - 1;
            this.MIN_WEIGHT = -2147483648 + 1;

            this.#buffer = Array(this.maxNodeSize + this.maxNodeSize * this.maxNodeSize).fill(this.MAX_WEIGHT + 1);
            this.#buffer.fill(0, 0, this.maxNodeSize);
        } else {
            this.isWeighted = false;
            this.#buffer = Array(this.maxNodeSize + this.maxNodeSize * this.maxNodeSize).fill(0);
        }

        this.type = type;
        
        if (initialData) {
            const {
                buffer,
                keyMap,
                valueMap,
            } = initialData;

            this.#buffer = [...buffer];
            this.keyMap = new Map(keyMap);
            this.valueMap = new Map(valueMap);
        } else {
            this.keyMap = new Map();
            this.valueMap = new Map();
        }
    }

    topologicalSort() {
        const weightType = this.isWeighted ? "weighted" : "nonWeighted";
        const newGraph = new MatrixGraph(this.maxNodeSize, this.type, weightType, {
            buffer: this.#buffer,
            keyMap: this.keyMap,
            valueMap: this.valueMap,
        });
        const vertexesCount = newGraph.getVertexesCount();
        const sorted = [];

        while (true) {
            const newVertex = newGraph.findVertexWithNoEdges();

            if (newVertex === null) {
                break;
            }

            sorted.push(newVertex);
            newGraph.removeVertex(newVertex);
        }

        if (sorted.length === vertexesCount) {
            return sorted;
        }

        console.error('topoligical sort is impossible');
        return null;
    }

    findVertexWithNoEdges() {
        if (this.type === "undirected") {
            throw new Error("cannot find vertex with no edges for undirected graph");
        }

        const size = this.getSize();
        for (let x = 0; x < size; x++) {
            let noEdges = true;
            
            if (this.#buffer[x] === 0) {
                continue;
            }

            for (let y = 0; y < size; y++) {
                const matrixValue = this.getMatrixValue({
                    yPos: y,
                    xPos: x,
                });

                if (this.isWeighted) {
                    if (matrixValue <= this.MAX_WEIGHT && matrixValue >= this.MIN_WEIGHT) {
                        noEdges = false;
                        break;
                    }
                } else {
                    if (matrixValue === 1) {
                        noEdges = false;
                        break;
                    }
                }
            }

            if (noEdges) {
                return this.valueMap.get(x);
            }
        }

        return null;
    }

    getHeadVertex() {
        const key = this.findVertexWithNoEdges();

        if (key) {
            return key;
        }

        for (let i = 0; i < this.maxNodeSize; i++) {
            if (this.#buffer[i] === 1) {
                return this.valueMap.get(i);
            }
        }
    }

    setMatrixValue({yPos, xPos, value}) {
        const index = this.maxNodeSize + this.maxNodeSize * yPos + xPos;
        this.#buffer[index] = value;
    }

    getMatrixValue({yPos, xPos}) {
        const index = this.maxNodeSize + this.maxNodeSize * yPos + xPos;
        return this.#buffer[index];
    }

    hasSiblings(key) {
        const siblings = this.getAllSiblings(key);
        return siblings.length > 0;
    }

    isParent(key1, key2) {
        const index1 = this.keyMap.get(key1);
        const index2 = this.keyMap.get(key2);

        const value = this.getMatrixValue({
            yPos: index1,
            xPos: index2,
        });

        if (this.isWeighted) {
            if (value >= this.MIN_WEIGHT && value <= this.MAX_WEIGHT) {
                return true;
            }
        } else {
            if (value === 1) {
                return true;
            }
        }

        return false;
    }

    getAllSiblings(key) {
        const index = this.keyMap.get(key);
        const siblings = [];

        for (let i = 0; i < this.maxNodeSize; i++) {
            const matrixValue1 = this.getMatrixValue({
                xPos: i,
                yPos: index,
            });

            if (this.isWeighted) {
                if (matrixValue1 <= this.MAX_WEIGHT && matrixValue1 >= this.MIN_WEIGHT) {
                    siblings.push(this.valueMap.get(i));
                    continue;
                }
            } else {
                if (matrixValue1 === 1) {
                    siblings.push(this.valueMap.get(i));
                    continue;               
                }
            }

            if (this.type === 'undirected') {
                const matrixValue2 = this.getMatrixValue({
                    xPos: index,
                    yPos: i,
                });

                if (this.isWeighted) {
                    if (matrixValue2 <= this.MAX_WEIGHT && matrixValue2 >= this.MIN_WEIGHT) {
                        siblings.push(this.valueMap.get(i));
                        continue;
                    }
                } else {
                    if (matrixValue2 === 1) {
                        siblings.push(this.valueMap.get(i));
                        continue;
                    }
                } 
            }
        }

        return siblings;
    }

    addVertex(key) {
        let index = -1;
        
        for (let i = 0; i < this.maxNodeSize; i++) {
             if (this.#buffer[i] === 0) {
                index = i;
                this.#buffer[i] = 1;

                this.keyMap.set(key, i);
                this.valueMap.set(i, key);
                break;
            }
        }

        if (index === -1) {
            throw new Error('Matrix is full');
        }
    }

    removeVertex(key) {
        const index = this.keyMap.get(key);

        if (index === undefined) {
            throw new Error('vertex is not found');
        }

        const size = this.getSize();
        
        for (let i = 0; i < size; i++) {
            const value = this.isWeighted ? this.MAX_WEIGHT + 1 : 0;

            this.setMatrixValue({
                xPos: index,
                yPos: i,
                value,
            })

            this.setMatrixValue({
                xPos: i,
                yPos: index,
                value,
            })
        }

        this.#buffer[index] = 0;
        this.keyMap.delete(key);
        this.valueMap.delete(index);
    }

    removeConnection(key1, key2) {
        const index1 = this.keyMap.get(key1);
        const index2 = this.keyMap.get(key2);

        if (index1 === undefined || index2 === undefined) {
            throw new Error('vertex with some key is not found');
        }

        const value = this.isWeighted ? this.MAX_WEIGHT + 1 : 0;

        this.setMatrixValue({
            yPos: index1,
            xPos: index2,
            value,
        });

        if (this.type === "undirected") {
            this.setMatrixValue({
                yPos: index2,
                xPos: index1,
                value,
            });
        }

        this.keyMap.delete(key1);
        this.keyMap.delete(key2);
        this.valueMap.delete(index1);
        this.valueMap.delete(index2);
    }

    connectVertexes(key1, key2, weight = 0) {
        const index1 = this.keyMap.get(key1);
        const index2 = this.keyMap.get(key2);

        if (index1 === undefined || index2 === undefined) {
            throw new Error('vertex with some key is not found');
        }

        if (this.isWeighted && (weight < this.MIN_WEIGHT || weight > this.MAX_WEIGHT)) {
            throw new Error('weight is out of available range');
        }

        const value = this.isWeighted ? weight : 1;

        this.setMatrixValue({
            yPos: index1,
            xPos: index2,
            value,
        });

        if (this.type === "undirected") {
            this.setMatrixValue({
                yPos: index2,
                xPos: index1,
                value,
            });
        }
    }

    getVertexesCount() {
        const size = this.getSize();
        let count = 0;

        for (let i = 0; i < size; i++) {
            if (this.#buffer[i] === 1) {
                count++;
            }
        }

        return count;
    }

    getSize() {
        for (let i = this.maxNodeSize - 1; i >= 0; i--) {
            if (this.#buffer[i] === 1) {
                return i + 1;
            }
        }

        return 1;
    }

    computeTransitiveClosure() {
        const matrixSize = this.getSize();

        // Transitive closure by row propagation
        let isChanged = true;

        while (isChanged) {
            isChanged = false;

            for (let i = 0; i < matrixSize; i++) {
                for (let j = 0; j < matrixSize; j++) {
                    const value_j_i = this.getMatrixValue({
                        xPos: i,
                        yPos: j,
                    });

                    if (this.isWeighted) {
                        if (value_j_i > this.MAX_WEIGHT) continue;
                    } else {
                        if (!value_j_i) continue;
                    }

                    if (i === j) continue; 

                    for (let k = 0; k < matrixSize; k++) {
                        const value_i_k = this.getMatrixValue({
                            xPos: k,
                            yPos: i,
                        });

                        const value_j_k = this.getMatrixValue({
                            xPos: k,
                            yPos: j,
                        });

                        if (this.isWeighted) {
                            const setNewWeight = (value) => {
                                this.setMatrixValue({
                                    xPos: k,
                                    yPos: j,
                                    value,
                                })

                                isChanged = true;
                            }

                            if (value_i_k > this.MAX_WEIGHT) {
                                continue;
                            }

                            if (this.MAX_WEIGHT - value_j_i < value_i_k) {
                                console.error('max weight overflow');
                                continue;
                            }

                            const candidateWeight = value_i_k + value_j_i;

                            if (value_j_k > this.MAX_WEIGHT || value_j_k > candidateWeight) {
                                setNewWeight(candidateWeight);
                            }
                        } else {
                            if (value_i_k === 1 && value_j_k === 0) {
                                this.setMatrixValue({
                                    xPos: k,
                                    yPos: j,
                                    value: 1,
                                })

                                isChanged = true;
                            }
                        }
                    }
                }
            }
        }
    }    

    drawMatrix() {
        const sizeToShow = this.getSize();

        let $wrapper = document.getElementById("matrix");

        if ($wrapper) {
            $wrapper.innerHTML = null;
        } else {
            $wrapper = document.createElement('div');
            $wrapper.id = "matrix";
            document.body.appendChild($wrapper);
        }

        const styleId = "matrix-styles";
        let styleEl = document.getElementById(styleId);

        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = styleId;

            styleEl.textContent = `
                #matrix {
                margin: 20px auto;
                overflow-x: auto;
                font-family: Arial, sans-serif;
                }
                #matrix table {
                border-collapse: collapse;
                table-layout: fixed;
                }
                #matrix th, #matrix td {
                width: 50px;
                height: 50px;
                border: 1px solid #ccc;
                text-align: center;
                vertical-align: middle;
                padding: 0;
                overflow: hidden;
                }
                #matrix th,
                #matrix td.key {
                background-color: #4CAF50;
                color: white;
                font-weight: bold;
                }
                #matrix tr:nth-child(even) {
                background-color: #f9f9f9;
                }
                #matrix tr:hover {
                background-color: #f1f1f1;
                }
            `;

            document.head.appendChild(styleEl);
        }

        const $table = document.createElement('table');
        const $thead = document.createElement('thead');
        const $headerRow = document.createElement('tr');

        for (let i = -1; i < sizeToShow; i++) {
            if (this.#buffer[i] === 0) {
                continue;
            }

            const th = document.createElement('th');
            if (i >= 0) {
                const key = this.valueMap.has(i) ? ` (${this.valueMap.get(i)})` : '';
                th.textContent = `${i}${key}`;;
            } else {
                th.textContent = "";
            }
            $headerRow.appendChild(th);
        }

        $thead.appendChild($headerRow);
        $table.appendChild($thead);

        const $tbody = document.createElement('tbody');
        for (let y = 0; y < sizeToShow; y++){
            const $row = document.createElement('tr');

            if (this.#buffer[y] === 0) {
                continue;
            }

            for (let x = -1; x < sizeToShow; x++) {
                if (this.#buffer[x] === 0) {
                    continue;
                }

                const $td = document.createElement('td');

                if (x >= 0) {
                    $td.textContent = this.getMatrixValue({
                        yPos: y,
                        xPos: x,
                    })
                } else {
                    const key = this.valueMap.has(y) ? ` (${this.valueMap.get(y)})` : '';
                    $td.textContent = `${y}${key}`;
                    $td.classList.add('key');
                }
                $row.appendChild($td); 
            }      

            $tbody.appendChild($row);  
        }
        $table.appendChild($tbody);

        $wrapper.appendChild($table);
    }

    visual() {
        if (!this.graphVisual) {
            this.graphVisual = new GraphVisual({
                width: 1000,
                height: 1000,
                isWeighted: this.isWeighted,
            })
        } else {
            this.graphVisual.cleanup();
        }

        for (let i = 0; i < this.getSize(); i++) {
            this.graphVisual.drawVertex(i, `${i}`);
        }

        for (let i = 0; i < this.getSize(); i++) {
            for (let k = 0; k < this.getSize(); k++) {
                const matrixValue = this.getMatrixValue({
                    yPos: i,
                    xPos: k,
                });
                const isDirected = this.type === "directed";

                if (this.isWeighted) {
                    if (matrixValue <= this.MAX_WEIGHT && matrixValue >= this.MIN_WEIGHT) {
                        this.graphVisual.drawEdge(i, k, isDirected, matrixValue);
                    }
                } else {
                    if (matrixValue === 1) {
                        this.graphVisual.drawEdge(i, k, isDirected);
                    }
                }
            }
        }
    }
}

class ListsGraph {
    constructor(type = "undirected") {
        this.vertexes = Array();
        this.type = type;
    }

    addVertex(key) {
        const index = this.vertexes.findIndex(vertex => vertex.key === key);

        if (index !== -1) {
            throw new Error('this vertex is already created');
        }

        this.vertexes.push({
            key,
            siblings: [],
        })
    }

    removeVertex(key) {
        const index = this.vertexes.findIndex(vertex => vertex.key === key);

        if (index === -1) {
            throw new Error("there is no vertex with this key");
        }

        this.vertexes.splice(index, 1);

        this.vertexes.forEach((vertex) => {
            const index = vertex.siblings.findIndex(sibling => sibling.key === key);

            if (index >= 0) {
                vertex.siblings.splice(index, 1);
            }
        })
    }

    removeConnection(key1, key2) {
        const index1 = this.vertexes.findIndex(vertex => vertex.key === key1);
        const index2 = this.vertexes.findIndex(vertex => vertex.key === key2);

        if (index1 === -1 || index2 === -1) {
            throw new Error("one of vertex is not found");
        }

        const vertex1 = this.vertexes[index1];
        const vertex2 = this.vertexes[index2];

        const index = vertex1.siblings.findIndex(vertex => vertex.key === vertex2.key);

        if (index >= 0) {
            vertex1.siblings.splice(index, 1);
        }
        
        if (this.type === "undirected") {
            const index = vertex2.siblings.findIndex(vertex => vertex.key === vertex1.key);
            if (index >= 0) {
                vertex2.siblings.splice(index, 1);
            }
        }
    }

    connectVertex(key1, key2) {
        const index1 = this.vertexes.findIndex(vertex => vertex.key === key1);
        const index2 = this.vertexes.findIndex(vertex => vertex.key === key2);

        if (index1 === -1 || index2 === -1) {
            throw new Error("one of vertex is not found");
        }
 
        const vertex1 = this.vertexes[index1];
        const vertex2 = this.vertexes[index2];

        if (!vertex1.siblings.find(sibling => sibling.key === key2)) {
            vertex1.siblings.push(vertex2);
        }

        if (this.type === "undirected") {
            if (!vertex2.siblings.find(sibling => sibling.key === key1)) {
                vertex2.siblings.push(vertex1);
            }
        }
    }

    visual() {
        if (!this.graphVisual) {
            this.graphVisual = new GraphVisual({
                width: 1000,
                height: 1000,
            })
        }

        this.vertexes.forEach((vertex) => {
            this.graphVisual.drawVertex(vertex.key, `${vertex.key}`);
        })

        this.vertexes.forEach((vertex) => {
            vertex.siblings.forEach((sibling) => {
                this.graphVisual.drawEdge(vertex.key, sibling.key, this.type === "directed");
            })
        })
    }
}

function getIterator({type = "DFS", getHead, getAllSiblings}) {
    return function() {
        const stack = [getHead()];
        const visited = [];

        return {
            getNextKey() {
                if (stack.length === 0) return null;

                if (type === "DFS") {
                    return stack.pop();
                }

                if (type === "BFS") {
                    return stack.shift();
                }
                
            },
            next() {
                while (true) {
                    let currentKey = this.getNextKey();

                    if (currentKey === null) {
                        return {
                            done: true,
                        }
                    }

                    if (!visited.includes(currentKey)) {
                        stack.push(...getAllSiblings(currentKey));
                        visited.push(currentKey);

                        return {
                            done: false,
                            value: currentKey,
                        }
                    }
                }
            }

        }
    }
};


const graph = new MatrixGraph(20, "directed", "weighted");
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addVertex('E');
graph.connectVertexes('A','B', 10);
graph.connectVertexes('B','C', 20);
graph.connectVertexes('C','D', 30);
graph.connectVertexes('D','E', 40);
// console.log(graph.hasSiblings('B'));
// console.log(graph.hasSiblings('A'));
// console.log(graph.hasSiblings('D'));
// console.log(graph.hasSiblings('E'));
console.log(graph.isParent('B', 'A'));
console.log(graph.isParent('A', 'B'));
graph.addVertex('F');
graph.drawMatrix();
graph.visual();
debugger;
graph.computeTransitiveClosure();
graph.drawMatrix();
graph.visual();
debugger;

graph[Symbol.iterator] = getIterator({
    type: "DFS",
    getHead: graph.getHeadVertex.bind(graph), 
    getAllSiblings: graph.getAllSiblings.bind(graph)
});

for (let vertex of graph) {
  console.log('vertex: ', vertex);
}

// const graph2 = new ListsGraph("directed");
// graph2.addVertex('A');
// graph2.addVertex('B');
// graph2.addVertex('C');
// graph2.addVertex('D');
// graph2.connectVertex('A', 'B');
// graph2.connectVertex('B', 'A');
// graph2.connectVertex('D', 'B');
// graph2.connectVertex('B', 'C');
// graph2.removeConnection('A', 'B');
// graph2.visual();

window.Graph = graph;