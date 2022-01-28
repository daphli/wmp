function myFunction(myid) {
    var element = document.getElementById(myid);
    element.classList.toggle("active");
    if (myid == 'addE') {
        if (state == 0) {
            state = 2;
        }
        else {
            state = 0;
        }
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let canvasX = 0;
let canvasY = 0;
let relPointer = {
    "x": 0,
    "y": 0
};
let vertices = [];
let edges = [];
const vRadius = 8;
let state = 0;
let lastPosition = {
    "x": 0,
    "y": 0
};
let xStart = 0;
let yStart = 0;
let lastEdge = {
    "xStart": 0,
    "xEnd": 0,
    "yStart": 0,
    "yEnd": 0
};
let fontSize = 16;

canvas.addEventListener('click', function(event) {
    alert("x: " + event.clientX + " | y: " + event.clientY);
    updateCanvasPosition(event);
    switch (state) {
        case 0: addVertex(event);
        break;
        case 1: removeVertex(event);
        break;
        case 2: addEdge(event);
        break;
        case 3: removeEdge(event);
        break;
        default: clearBoard();
        break;
    }
});

document.getElementById('weightInputBar').addEventListener('click', function() {
    setEdgeWeight();
});

function updateCanvasPosition(event) {
    //lastPosition = relPointer;
    canvasX = canvas.getBoundingClientRect().left;
    canvasY = canvas.getBoundingClientRect().top;
    relPointer.x = event.clientX - canvasX;
    relPointer.y = event.clientY - canvasY;
}

function addVertex(event) {
    let validPosition = true;
    // Vertices are not allowed to be placed near the boards end.
    if (relPointer.x < 3 * vRadius || relPointer.x > canvas.width - 3 * vRadius ||
        relPointer.y < 3 * vRadius || relPointer.y > canvas.height - 3 * vRadius) {
        alert("A Vertex can not be placed too close to an Edge of the Canvas.");
        return;
    }
    //Vertices are not allowed to be placed too close to other vertices.
    vertices.forEach(function(vertex) {
        if (distance(vertex, relPointer) < 5 * vRadius) {
            validPosition = false;
        }
    });
    if (!validPosition) {
        alert("A Vertex can not be placed too close to another Vertex of the Graph.");
        return;
    }
    //Add Vertex to Array.
    vertices.push({x: relPointer.x, y: relPointer.y});
    console.log(vertices);
    //Draw new vertex.
    drawVertex();
}

function drawVertex() {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#f3ac09';
    ctx.beginPath();
    ctx.arc(relPointer.x, relPointer.y, vRadius, 0, Math.PI * 2, true);
    ctx.fill();
}

function distance(v1, v2) {
    return Math.sqrt(Math.pow((v1.x - v2.x), 2) + Math.pow((v1.y - v2.y), 2));
}

function addEdge() {
    console.log(lastPosition);
    if (lastPosition.x == 0 && lastPosition.y == 0) {
        if(selectVertex()) {
            markVertex(lastPosition);
        }
    }
    else {
        xStart = lastPosition.x;
        yStart = lastPosition.y;
        if (selectVertex()) {
            markVertex(lastPosition);
            getEdgeWeight();
        }
    }
}

function getEdgeWeight() {
    document.getElementById("weightInputBar").classList.toggle("dominant");
}

function setEdgeWeight() {
    document.getElementById("weightInputBar").classList.toggle("dominant");
    drawEdge(document.getElementById("weightInputBar").value);
    //drawEdge(8);
}

function drawEdge(weight) {
    //Edge
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#f3ac09";
    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(lastPosition.x, lastPosition.y);
    ctx.stroke();
    //Weight
    ctx.beginPath();
    relPointer.x = (xStart + lastPosition.x) / 2;
    relPointer.y = (yStart + lastPosition.y) / 2;
    ctx.moveTo(relPointer.x, relPointer.y);

    if (Math.abs(xStart - lastPosition.x) >= Math.abs(yStart - lastPosition.y)) {
        //up or down
        if (relPointer.y * 2 > canvas.height) {
            ctx.lineTo(relPointer.x, relPointer.y - 10);
            relPointer.y -= 14;
        }
        else {
            ctx.lineTo(relPointer.x, relPointer.y + 10);
            relPointer.y += (10 + fontSize);
        }
        relPointer.x -= 4;
    }
    else {
        //left or right
        if (relPointer.x * 2 > canvas.width) {
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
    ctx.font = fontSize + 'px serif';
    ctx.fillText(weight, relPointer.x, relPointer.y);
    unmarkVertices();
    lastPosition.x = 0;
    lastPosition.y = 0;
}

function selectVertex() {
    let found = false;
    vertices.forEach(function(vertex) {
        if (distance(vertex, relPointer) <= vRadius) {
            lastPosition.x = vertex.x;
            lastPosition.y = vertex.y;
            found = true;
            return;
        }
    });
    return found;
}

function markVertex(vertex) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'none';
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, vRadius + 4, 0, Math.PI * 2, true);
    ctx.stroke();
}

function unmarkVertices() {
    vertices.forEach(function(vertex) {

    });
}