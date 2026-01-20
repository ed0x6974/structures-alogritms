/*
    Implement Binary Search Tree (BST) Class with Insertion, Deletion, and Traversal API.

    Implement the following traversal methods:
    DFS (Depth-First Search)
    BFS (Breadth-First Search)
*/

class BinaryTreeNode {
    constructor (key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor(key, value) {
        this.root = new BinaryTreeNode(key, value);
    }

    insert({node = this.root, key, value}) {
        if (!node) return;
        
        if (value < node.value) {
            if (!node.left) {
                const newNode = new BinaryTreeNode(key, value);
                node.left = newNode;
                return newNode;
            }
            
            return this.insert({
                node: node.left,
                key,
                value,
            });
        } else {
            if (!node.right) {
                const newNode = new BinaryTreeNode(key, value);
                node.right = newNode;
                return newNode;
            }
            
            return this.insert({
                node: node.right,
                key,
                value,
            })
        }
    }

    searchParent(node) {
        return recSearchParent(this.root, node);

        function recSearchParent(currentNode, node) {
            if (currentNode === node) {
                return null;
            }

            if (node.value < currentNode.value) {
                if (!currentNode.left) {
                    return null;
                }

                if (currentNode.left === node) {
                    return currentNode;
                } else {
                    return recSearchParent(currentNode.left, node)
                }
            } else {
                if (!currentNode.right) {
                    return null;
                }

                if (currentNode.right === node) {
                    return currentNode;
                } else {
                    return recSearchParent(currentNode.right, node)
                }
            }
        }
    }

    getMax(node = this.root) {
        if (!node) return;

        if (node.right) {
            return this.getMax(node.right);
        } else {
            return node;
        }
    }

    getMin(node = this.root) {
        if (!node) return;

        if (node.left) {
            return this.getMin(node.left);
        } else {
            return node;
        }
    }

    delete(node) {
        if (!node.right && !node.left) {
            if (node === this.root) {
                this.root = null;
                return;
            }

            const parent = this.searchParent(node);

            if (parent.left === node) {
                parent.left = null;
            } else if (parent.right === node) {
                parent.right = null;
            }
        } else if (!node.right || !node.left) {
            const nodeToMove = node.right ? node.right : node.left;

            if (node !== this.root) {
                const parent = this.searchParent(node);

                const direction = parent.right === node ? "right" : "left";
                parent[direction] = nodeToMove;
            } else {
                this.root = nodeToMove;
            }
        } else if (node.right && node.left) {
            const leftMax = this.getMax(node.left);

            const { key, value } = leftMax;

            this.delete(leftMax);

            node.key = key;
            node.value = value;
        }
    }

    traversalDFS(node = this.root) {
        if (!node) return;

        this.traversalDFS(node.left);
        console.log(node.value);
        this.traversalDFS(node.right);
    }

    traversalBFS(node = this.root) {
        if (!node) return;
        const queue = [node];

        while (queue.length > 0) {
            const node = queue.shift();
            console.log(node.value);
            
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
    }
}

window.tree = new BinarySearchTree("a", 5);