/*
    Implement a graph using matrix-based structures (adjacency matrix) as well as using adjacency lists.
    Create several variants for both directed graphs (digraphs) and undirected graphs.
    Visualize the graphs as an image using SVG markup.
*/

class GraphVisual {
    constructor({
        width = 1000,
        height = 1000,
        vertexRadius = 50,
    }){
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

    drawVertex(key, text) {
        const xPos = Math.floor(Math.random() * (this.maxX - this.radius) + this.radius);
        const yPos = Math.floor(Math.random() * (this.maxY - this.radius) + this.radius);

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

    drawEdge(vertexKey1, vertexKey2, isDirected) {
        const vertex1 = this.vertexes.find(v => v.key === vertexKey1);
        const vertex2 = this.vertexes.find(v => v.key === vertexKey2);

        if (!vertex1 || !vertex2) {
            throw new Error('some vertex is not found');
        }

        const {
            xPos: xPos1,
            yPos: yPos1,
        } = vertex1;

        const {
            xPos: xPos2,
            yPos: yPos2,
        } = vertex2;

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

        this.svg.appendChild($line);
        this.edges.push({
            vertexKey1,
            vertexKey2,
            line: $line,
            path: $path,
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
        } = edge;
        
        this.svg.removeChild($line);
        if ($path) {
            this.svg.removeChild($path);
        }
        this.edges.splice(index, 1);
    }
}

class MatrixGraph {
    maxNodeSize;
    #buffer;

    constructor(maxNodeSize = 100, type="undirected") {
        this.maxNodeSize = maxNodeSize;
        this.#buffer = Array(this.maxNodeSize + this.maxNodeSize * this.maxNodeSize).fill(0);
        this.type = type;
        this.keyMap = new Map();
        this.valueMap = new Map();
    }

    setMatrixValue({xPos, yPos, value}) {
        const index = this.maxNodeSize + this.maxNodeSize * xPos + yPos;
        this.#buffer[index] = value;
    }

    getMatrixValue({xPos, yPos}) {
        const index = this.maxNodeSize + this.maxNodeSize * xPos + yPos;
        return this.#buffer[index];
    }

    addVertex(key) {
        let index = -1;
        
        for (let i = 0; i < this.maxNodeSize; i++) {
             if (this.#buffer[i] === 0) {
                index = i;
                this.#buffer[index] = 1;
                this.keyMap.set(key, index);
                this.valueMap.set(index, key);
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
            this.setMatrixValue({
                xPos: index,
                yPos: i,
                value: 0,
            })

            this.setMatrixValue({
                xPos: i,
                yPos: index,
                value: 0,
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

        this.setMatrixValue({
            xPos: index1,
            yPos: index2,
            value: 0,
        });

        if (this.type === "undirected") {
            this.setMatrixValue({
                xPos: index2,
                yPos: index1,
                value: 0,
            });
        }

        this.keyMap.delete(key1);
        this.keyMap.delete(key2);
        this.valueMap.delete(index1);
        this.valueMap.delete(index2);
    }

    connectVertexes(key1, key2) {
        const index1 = this.keyMap.get(key1);
        const index2 = this.keyMap.get(key2);

        if (index1 === undefined || index2 === undefined) {
            throw new Error('vertex with some key is not found');
        }

        this.setMatrixValue({
            xPos: index1,
            yPos: index2,
            value: 1,
        });

        if (this.type === "undirected") {
            this.setMatrixValue({
                xPos: index2,
                yPos: index1,
                value: 1,
            });
        }
    }

    getSize() {
        for (let i = this.maxNodeSize - 1; i >= 0; i--) {
            if (this.#buffer[i] === 1) {
                return i + 1; 
            }
        }

        return 1;
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
        for (let x = 0; x < sizeToShow; x++){
            const $row = document.createElement('tr');

            for (let y = -1; y < sizeToShow; y++) {
                const $td = document.createElement('td');

                if (y >= 0) {
                    $td.textContent = this.getMatrixValue({
                        xPos: x,
                        yPos: y,
                    })
                } else {
                    const key = this.valueMap.has(x) ? ` (${this.valueMap.get(x)})` : '';
                    $td.textContent = `${x}${key}`;
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
            })
        }

        for (let i = 0; i < this.getSize(); i++) {
            this.graphVisual.drawVertex(i, `${i}`);
        }

        for (let i = 0; i < this.getSize(); i++) {
            for (let k = 0; k < this.getSize(); k++) {
                if (this.getMatrixValue({
                    xPos: i,
                    yPos: k,
                }) === 1) {
                    const isDirected = this.type === "directed";
                    this.graphVisual.drawEdge(i, k, isDirected);
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
        debugger;
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

const graph = new MatrixGraph(20, "directed");
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addVertex('E');
graph.removeVertex('C');
graph.connectVertexes('D','A');
graph.connectVertexes('B','A');
graph.addVertex('F');
graph.drawMatrix();
graph.visual();

const graph2 = new ListsGraph("directed");
graph2.addVertex('A');
graph2.addVertex('B');
graph2.addVertex('C');
graph2.addVertex('D');
graph2.connectVertex('A', 'B');
graph2.connectVertex('B', 'A');
graph2.removeConnection('A', 'B');
graph2.visual();