class GraphWMP {

    constructor(_canvas, _ctx, _rad) {
        this.vertices = [];
        this.edges = [];
        this.canvas = _canvas;
        this.ctx = _ctx;
        this.rad = _rad;
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].draw(this.ctx, this.rad);
        }
        for (let i = 0; i < this.edges.length; i++) {
            this.edges[i].draw(this.canvas, this.ctx);
        }
    }

    activeVertex() {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].focus) {
                return i;
            }
        }
        return -1;
    }

    glimmingVertex() {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].glim) {
                return i;
            }
        }
        return -1;
    }

    addVertex(vertex) {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].isCloseTo(vertex.x, vertex.y, this.rad * 8)) {
                alert("Sorry, this Vertex would be positioned too close to another Vertex.");
                return;
            }
        }
        this.vertices.push(vertex);
        this.update()
    }

    removeVertex(x, y) {
        let v = new Vertex(x, y);
        for (let i = 0; i < this.edges.length; i++) {
            if (this.edges[i].partnerOf(v, this.rad) != null) {
                this.unmarkAllVertices();
                this.edges[i].v1.focus = true;
                this.edges[i].v2.glim = true;
                this.removeEdge();
                i--;
            }
        }
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].isCloseTo(x, y, this.rad)) {
                this.vertices.splice(i, 1);
                this.update();
                return;
            }
        }
    }

    addEdge() {
        let a = this.activeVertex();
        let g = this.glimmingVertex();
        if (a >= 0 && g >= 0) {
            if (a == g) {
                console.log("bad!!!: " + a + " " + g);
            }
            else {
                let randomWeight = Math.floor(Math.random() * 9) + 1;
                let e = new Edge(this.vertices[g], this.vertices[a], randomWeight);
                for (let i = 0; i < this.edges.length; i++) {
                    if (this.edges[i].isEqualTo(e, this.rad)) {
                        alert("Sorry, this Edge already exists.");
                        return;
                    }
                }
                this.edges.push(e);
                this.vertices[a].addRelation(this.vertices[g], randomWeight);
                this.vertices[g].addRelation(this.vertices[a], randomWeight);
                this.unmarkAllVertices();
                this.update();
            }
        }
    }

    addWeightedEdge(weight) {
        let a = this.activeVertex();
        let g = this.glimmingVertex();
        if (a >= 0 && g >= 0) {
            if (a == g) {
                console.log("bad!!!: " + a + " " + g);
            }
            else {
                let e = new Edge(this.vertices[g], this.vertices[a], weight);
                for (let i = 0; i < this.edges.length; i++) {
                    if (this.edges[i].isEqualTo(e, this.rad)) {
                        alert("Sorry, this Edge already exists.");
                        return;
                    }
                }
                this.edges.push(e);
                this.vertices[a].addRelation(this.vertices[g], weight);
                this.vertices[g].addRelation(this.vertices[a], weight);
                this.unmarkAllVertices();
                this.update();
            }
        }
    }

    removeEdge() {
        let a = this.activeVertex();
        let g = this.glimmingVertex();
        //console.log("selected vertices are:");
        //console.log(this.vertices[a]);
        //console.log(this.vertices[g]);
        if (a >= 0 && g >= 0) {
            if (a == g) {
                alert("bad!!!: " + a + " " + g);
            }
            else {
                let e = new Edge(this.vertices[g], this.vertices[a], this.rad);
                for (let i = 0; i < this.edges.length; i++) {
                    if (this.edges[i].isEqualTo(e, this.rad)) {
                        /*
                        for (let j = 0; j < this.vertices.length; j++) {
                            if (this.edges[i].partnerOf(this.vertices[j], this.rad) != null) {
                                this.vertices[j].removeRelation(this.edges[i].partnerOf(this.vertices[j], this.rad), this.rad);
                                this.edges[i].partnerOf(this.vertices[j], this.rad).removeRelation(this.vertices[j], this.rad);
                                this.edges.splice(i, 1);
                                this.unmarkAllVertices();
                                this.update();
                                return;
                            }
                        }*/
                        this.vertices[g].removeRelation(this.vertices[a], this.rad);
                        this.vertices[a].removeRelation(this.vertices[g], this.rad);
                        this.edges.splice(i, 1);
                        this.unmarkAllVertices();
                        this.update();
                    }
                }
            }
        }
        //slice from edges
        //cut the wiring and removeRelations
        //update()
    }

    selectVertex(x, y, rad) {
        var hit = false;
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].isCloseTo(x, y, rad)) {
                hit = true;
            }
        }
        if (hit) {
            for (let i = 0; i < this.vertices.length; i++) {
                if (this.vertices[i].isCloseTo(x, y, rad)) {
                    this.vertices[i].activate();
                } else {
                    this.vertices[i].deactivate();
                }
            }
            this.update();
        }
    }

    simpleSelect(x, y, rad) {
        var hit = false;
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].isCloseTo(x, y, rad)) {
                hit = true;
            }
        }
        if (hit) {
            for (let i = 0; i < this.vertices.length; i++) {
                if (this.vertices[i].isCloseTo(x, y, rad)) {
                    this.vertices[i].focus = true;
                    this.vertices[i].glim = false;
                }
            }
        }
        else {
            this.unmarkAllVertices();
        }
        this.update();
    }

    unmarkAllVertices() {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].deactivate();
            this.vertices[i].deactivate();
        }
    }

    reset() {
        this.vertices = [];
        this.edges = [];
        this.update();
    }

    randomVertex() {
        return Math.floor(Math.random() * this.vertices.length);
    }

    pickVertex(vertex) {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].isCloseTo(vertex.x, vertex.y, this.rad)) {
                return i;
            }
        }
        return -1;
    }

    pickEdge(vertex, index) {
        let e = null;
        for (let i = 0; i < this.edges.length; i++) {
            if (this.edges[i].partnerOf(vertex, this.rad) != null && this.edges[i].partnerOf(this.vertices[index], this.rad) != null) {
                e = new Edge(new Vertex(this.edges[i].v1.x, this.edges[i].v1.y), new Vertex(this.edges[i].v2.x, this.edges[i].v2.y), this.edges[i].weight);
                //console.log(e);
                return e;
            }
        }
        //console.log("!!!!!!!PICKED NULL!!!!!!!");
        return null;
    }

    isValid() {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].matchings.length == 0) {
                return false;
            }
        }
        return true;
    }

    run() {
        if (!this.isValid()) {
            alert("Sorry, there can not be any Vertices without a connection.");
            selectTool(2);
            return;
        }
        let originalVertices = this.vertices;
        let sets = [];
        let set1 = [];
        let set2 = [];
        sets.push(set1);
        sets.push(set2);
        let alternater = 0;
        let currentVertex;
        let tempVertex;
        let currentMaxWeight = 0;
        let index = -1;
        while (this.edges.length > 0) {
            index = this.randomVertex();
            //console.log("PICKED #" + index);
            currentVertex = this.vertices[index];
            //console.log(currentVertex.matchings.length);
            while (currentVertex.matchings.length > 0) {
                for (let i = 0; i < currentVertex.matchings.length; i++) {
                    if (currentVertex.matchings[i].weight > currentMaxWeight) {
                        currentMaxWeight = currentVertex.matchings[i].weight;
                        tempVertex = currentVertex.matchings[i].match;
                    }
                }
                //console.log(tempVertex);
                currentMaxWeight = 0;
                sets[alternater].push(this.pickEdge(tempVertex, index));
                //console.log(sets);
                alternater = 1 - alternater;
                this.removeVertex(currentVertex.x, currentVertex.y);
                currentVertex = tempVertex;
                index = this.pickVertex(currentVertex);
            }
            
        }
        //console.log("sets:");
        //console.log(sets);
        this.recreateGraphFromEdgeSets(sets, originalVertices);
    }

    recreateGraphFromEdgeSets(sets, originalVertices) {
        this.reset();
        let foundV1 = false;
        let foundV2 = false;
        let accumulatedWeights = [0, 0];
        //vertices
        for (let i = 0; i < sets.length; i++) {
            for (let j = 0; j < sets[i].length; j++) {
                accumulatedWeights[i] += sets[i][j].weight;
                //console.log(accumulatedWeights);
                // add vertex if its not there already
                for (let k = 0; k < this.vertices.length; k++) {
                    if (this.vertices[k].isCloseTo(sets[i][j].v1.x, sets[i][j].v1.y, this.rad * 8)) {
                        foundV1 = true;
                    }
                    if (this.vertices[k].isCloseTo(sets[i][j].v2.x, sets[i][j].v2.y, this.rad * 8)) {
                        foundV2 = true;
                    }
                }
                if (!foundV1) {
                    this.vertices.push(sets[i][j].v1);
                }
                if (!foundV2) {
                    this.vertices.push(sets[i][j].v2);
                }
                foundV1 = false;
                foundV2 = false;
            }
        }
        //this.update();
        //which set is heavier?
        if (accumulatedWeights[0] > accumulatedWeights[1]) {
            sets[1] = [];
            //console.log("set 0 was heavier");
        }
        else {
            sets[0] = [];
            //console.log("set 1 was heavier");
        }
        //edges
        for (let i = 0; i < sets.length; i++) {
            for (let j = 0; j < sets[i].length; j++) {
                this.vertices[this.pickVertex(sets[i][j].v1)].glim = true;
                this.vertices[this.pickVertex(sets[i][j].v2)].focus = true;
                //sets[i][j].v1.glim = true;
                //sets[i][j].v2.focus = true;
                this.addWeightedEdge(sets[i][j].weight);
            }
        }
        //restoring losers
        let current = null;
        for (let i = 0; i < originalVertices.length; i++) {
            current = new Vertex(originalVertices[i].x, originalVertices[i].y);
            for (let j = 0; j < this.vertices.length; j++) {
                if (this.pickVertex(current) == -1) {
                    this.vertices.push(current);
                }
            }
        }
        this.update();
        selectTool(6);
    }
}

class Vertex {

    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.focus = false;
        this.glim = false;
        this.matchings = [];
    }

    draw(ctx, rad) {
        //ctx.strokeStyle = '#000000';
        //ctx.lineWidth = 2;
        if (this.focus) {
            ctx.fillStyle = '#56bba2';
        } else if (this.glim) {
            ctx.fillStyle = '#235a42';
        } else {
            ctx.fillStyle = '#000000';
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.fillStyle = "#000000";
    }

    isCloseTo(x, y, rad) {
        return Math.sqrt(Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2)) <= rad;
    }

    addRelation(match, weight) {
        let m = {"match": match, "weight": weight};
        this.matchings.push(m);
        //console.log("added relation:");
        //console.log(m);
    }

    removeRelation(vertex, rad) {
        for (let i = 0; i < this.matchings.length; i++) {
            if (this.matchings[i].match.isCloseTo(vertex.x, vertex.y, rad)) {
                //console.log("removed relation with weigth: " + this.matchings[i].weight);
                this.matchings.splice(i, 1);
                return;
            }
        }
    }

    activate() {
        this.focus = true;
        this.glim = false;
    }

    deactivate() {
        if (this.focus) {
            this.focus = false;
            this.glim = true;
        }
        else if (this.glim) {
            this.glim = false;
        }
    }
}

class Edge {

    constructor(_v1, _v2, _weight) {
        this.v1 = _v1;
        this.v2 = _v2;
        this.weight = _weight;
        this.focus = false;
    }

    draw(cv, ctx) {
        ctx.lineWidth = 1;
        if (this.focus) {
            ctx.strokeStyle = '#56bba2';
        }
        else {
            ctx.strokeStyle = "#000000";
        }
        ctx.beginPath();
        ctx.moveTo(this.v1.x, this.v1.y);
        ctx.lineTo(this.v2.x, this.v2.y);
        ctx.stroke();
        //Weight label
        ctx.beginPath();
        relPointer.x = (this.v1.x + this.v2.x) / 2;
        relPointer.y = (this.v1.y + this.v2.y) / 2;
        ctx.moveTo(relPointer.x, relPointer.y);
        if (Math.abs(this.v1.x - this.v2.x) >= Math.abs(this.v1.y - this.v2.y)) {
            //up or down
            if (relPointer.x * 2 > cv.height) {
                ctx.lineTo(relPointer.x, relPointer.y - 10);
                relPointer.y -= 14;
            }
            else {
                ctx.lineTo(relPointer.x, relPointer.y + 10);
                relPointer.y += (10 + 16);
            }
            relPointer.x -= 4;
        }
        else {
            //left or right
            if (relPointer.x * 2 > cv.width) {
                ctx.lineTo(relPointer.x - 10, relPointer.y);
                relPointer.x -= 20;
            }
            else {
                ctx.lineTo(relPointer.x + 10, relPointer.y);
                relPointer.x += 12;
            }
            relPointer.y += 5;
        }
        ctx.stroke();
        ctx.font = 16 + 'px serif';
        ctx.fillText(this.weight, relPointer.x, relPointer.y);
        ctx.strokeStyle = "#000000";
    }

    isEqualTo(edge, rad) {
        if (this.v1.isCloseTo(edge.v1.x, edge.v1.y, rad) && this.v2.isCloseTo(edge.v2.x, edge.v2.y, rad)) {
            return true;
        }
        else if (this.v1.isCloseTo(edge.v2.x, edge.v2.y, rad) && this.v2.isCloseTo(edge.v1.x, edge.v1.y, rad)) {
            return true;
        }
        else {
            return false;
        }
    }

    partnerOf(vertex, rad) {
        if (this.v1.isCloseTo(vertex.x, vertex.y, rad)) {
            return this.v2;
        }
        else if (this.v2.isCloseTo(vertex.x, vertex.y, rad)) {
            return this.v1;
        }
        else {
            //console.log("super bad");
            return null;
        }
    }

    toggleFocus() {
        this.focus = !this.focus;
    }
}

document.getElementById('tool0').addEventListener('click', function(event) {
    selectTool(0);
});

document.getElementById('tool1').addEventListener('click', function(event) {
    selectTool(1);
});

document.getElementById('tool2').addEventListener('click', function(event) {
    selectTool(2);
});

document.getElementById('tool3').addEventListener('click', function(event) {
    selectTool(3);
});

document.getElementById('tool4').addEventListener('click', function(event) {
    selectTool(4);
    g.reset();
});

document.getElementById('tool5').addEventListener('click', function(event) {
    selectTool(5);
    g.run();
});

document.getElementById('tool6').addEventListener('click', function(event) {
    selectTool(6);
})

function selectTool(tool) {
    g.selectVertex(0, 0, -1);
    if (tool == state) {
        return;
    }
    var lastTool = document.getElementById('tool' + state);
    var latestTool = document.getElementById('tool' + tool);
    lastTool.classList.toggle("active");
    latestTool.classList.toggle("active");
    state = tool;
    //console.log("state is now: " + state);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const vRadius = 8;
let g = new GraphWMP(canvas, ctx, vRadius);
let v = new Vertex(0, 0, -1);
let canvasX = 0;
let canvasY = 0;
let state = 6;
let relPointer = {
    "x": 0,
    "y": 0
};

canvas.addEventListener('click', function(event) {
    //alert("x: " + event.clientX + " | y: " + event.clientY);
    updateCanvasPosition(event);
    switch (state) {
        case 0:
            v1 = new Vertex(relPointer.x, relPointer.y);
            g.addVertex(v1);
            break;
        case 1:
            g.removeVertex(relPointer.x, relPointer.y);
            break;
        case 2: //add edge
            g.selectVertex(relPointer.x, relPointer.y, vRadius);
            g.addEdge();
            break;
        case 3:
            g.selectVertex(relPointer.x, relPointer.y, vRadius);
            g.removeEdge();
            break;
        case 6:
            g.simpleSelect(relPointer.x, relPointer.y, vRadius);
            break;
        default:
            break;
    }
});

function updateCanvasPosition(event) {
    //lastPosition = relPointer;
    canvasX = canvas.getBoundingClientRect().left;
    canvasY = canvas.getBoundingClientRect().top;
    relPointer.x = event.clientX - canvasX;
    relPointer.y = event.clientY - canvasY;
}

