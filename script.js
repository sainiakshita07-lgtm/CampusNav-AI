// ========================================
// CAMPUS LOCATIONS
// ========================================

const locations = {

    gate: {
        name: "Main Gate",
        building: "Campus Entrance",
        floor: "Ground Floor",
        x: 120,
        y: 520
    },

    reception: {
        name: "Reception Area",
        building: "Reception",
        floor: "Ground Floor",
        x: 390,
        y: 500
    },

    block1: {
        name: "Block 1",
        building: "Block 1",
        floor: "Ground Floor",
        x: 250,
        y: 330
    },

    library: {
        name: "Library",
        building: "Block 1",
        floor: "First Floor",
        x: 220,
        y: 100
    },

    block2: {
        name: "Block 2",
        building: "Block 2",
        floor: "Ground Floor",
        x: 500,
        y: 330
    },

    cslab: {
        name: "CS Lab",
        building: "Block 2",
        floor: "First Floor",
        x: 480,
        y: 100
    },

    block3: {
        name: "Block 3",
        building: "Block 3",
        floor: "Ground Floor",
        x: 760,
        y: 330
    },

    communication: {
        name: "Communication Lab",
        building: "Block 3",
        floor: "First Floor",
        x: 790,
        y: 100
    },

    canteen: {
        name: "Canteen",
        building: "Campus Facility",
        floor: "Ground Floor",
        x: 690,
        y: 500
    },

    parking: {
        name: "Parking",
        building: "Campus Entrance",
        floor: "Ground Floor",
        x: 100,
        y: 120
    }

};


// ========================================
// CAMPUS GRAPH
// ========================================

const graph = {

    gate: [
        "reception",
        "parking"
    ],

    reception: [
        "gate",
        "block1",
        "block2",
        "block3",
        "canteen"
    ],

    block1: [
        "reception",
        "library"
    ],

    library: [
        "block1"
    ],

    block2: [
        "reception",
        "cslab"
    ],

    cslab: [
        "block2"
    ],

    block3: [
        "reception",
        "communication"
    ],

    communication: [
        "block3"
    ],

    canteen: [
        "reception"
    ],

    parking: [
        "gate"
    ]

};


// ========================================
// BFS ROUTE FINDER
// ========================================

function findPath(start, destination) {

    const queue = [[start]];

    const visited = new Set();

    visited.add(start);


    while (queue.length > 0) {

        const path = queue.shift();

        const current =
            path[path.length - 1];


        if (current === destination) {

            return path;

        }


        for (const neighbour of graph[current]) {

            if (!visited.has(neighbour)) {

                visited.add(neighbour);

                queue.push([
                    ...path,
                    neighbour
                ]);

            }

        }

    }


    return null;

}


// ========================================
// DRAW ROUTE ON MAP
// ========================================

function drawRoute(path) {

    const routeLine =
        document.getElementById("routeLine");

    const startMarker =
        document.getElementById("startMarker");

    const destinationMarker =
        document.getElementById(
            "destinationMarker"
        );


    const points = path.map(location => {

        return `${locations[location].x},
                ${locations[location].y}`;

    }).join(" ");


    routeLine.setAttribute(
        "points",
        points
    );


    const start =
        locations[path[0]];


    const destination =
        locations[path[path.length - 1]];


    startMarker.setAttribute(
        "cx",
        start.x
    );

    startMarker.setAttribute(
        "cy",
        start.y
    );

    startMarker.setAttribute(
        "opacity",
        "1"
    );


    destinationMarker.setAttribute(
        "cx",
        destination.x
    );

    destinationMarker.setAttribute(
        "cy",
        destination.y
    );

    destinationMarker.setAttribute(
        "opacity",
        "1"
    );


    highlightLocations(path);

}


// ========================================
// HIGHLIGHT ROUTE LOCATIONS
// ========================================

function highlightLocations(path) {

    document
        .querySelectorAll(".map-location")
        .forEach(element => {

            element.classList.remove(
                "route-active"
            );

        });


    path.forEach(location => {

        const element =
            document.querySelector(
                `[data-location="${location}"]`
            );


        if (element) {

            element.classList.add(
                "route-active"
            );

        }

    });

}


// ========================================
// FIND ROUTE
// ========================================

function findRoute() {

    const start =
        document.getElementById("start").value;

    const destination =
        document.getElementById(
            "destination"
        ).value;


    const summary =
        document.getElementById(
            "routeSummary"
        );


    if (start === destination) {

        summary.innerHTML = `

            <div class="summary-title">
                📍 You are already here
            </div>

            <p style="font-size:12px;color:#64748b">
                Your current location and
                destination are the same.
            </p>

        `;

        clearRoute();

        return;

    }


    const path =
        findPath(start, destination);


    if (!path) {

        summary.innerHTML = `

            <div class="summary-title">
                ❌ Route not available
            </div>

        `;

        clearRoute();

        return;

    }


    // Approximate demo distance

    const distance =
        (path.length - 1) * 80;


    const time =
        Math.max(
            1,
            Math.ceil(distance / 60)
        );


    const startName =
        locations[start].name;


    const destinationName =
        locations[destination].name;


    summary.innerHTML = `

        <div class="summary-title">
            ✅ Route Found
        </div>

        <p style="font-size:12px;
                  color:#64748b;
                  margin-bottom:12px">

            ${startName}
            →
            ${destinationName}

        </p>


        <div class="summary-stats">

            <div class="stat">

                <strong>
                    ${distance}m
                </strong>

                <span>
                    Approx. distance
                </span>

            </div>


            <div class="stat">

                <strong>
                    ${time} min
                </strong>

                <span>
                    Walking time
                </span>

            </div>

        </div>


        <div style="
            margin-top:15px;
            font-size:11px;
            color:#64748b;
        ">

            🧭 ${path.length - 1}
            navigation steps

        </div>

    `;


    drawRoute(path);

}


// ========================================
// CLEAR ROUTE
// ========================================

function clearRoute() {

    document
        .getElementById("routeLine")
        .setAttribute("points", "");


    document
        .getElementById("startMarker")
        .setAttribute("opacity", "0");


    document
        .getElementById("destinationMarker")
        .setAttribute("opacity", "0");


    document
        .querySelectorAll(".map-location")
        .forEach(element => {

            element.classList.remove(
                "route-active"
            );

        });

}


// ========================================
// SWAP LOCATIONS
// ========================================

function swapLocations() {

    const start =
        document.getElementById("start");

    const destination =
        document.getElementById(
            "destination"
        );


    const temporary =
        start.value;


    start.value =
        destination.value;


    destination.value =
        temporary;


    findRoute();

}


// ========================================
// QUICK DESTINATION
// ========================================

function quickDestination(destination) {

    document
        .getElementById("destination")
        .value = destination;


    findRoute();

}


// ========================================
// CAMPUS ASSISTANT
// ========================================

function askAssistant() {

    const question =
        document
        .getElementById("question")
        .value
        .toLowerCase();


    const answer =
        document.getElementById(
            "assistantAnswer"
        );


    let message = "";


    if (
        question.includes("library")
    ) {

        message =
            "📚 The Library is in Block 1, First Floor.";

    }

    else if (
        question.includes("cs lab") ||
        question.includes("computer lab")
    ) {

        message =
            "💻 The CS Lab is in Block 2, First Floor.";

    }

    else if (
        question.includes("communication")
    ) {

        message =
            "🎤 The Communication Lab is in Block 3, First Floor.";

    }

    else if (
        question.includes("canteen")
    ) {

        message =
            "🍴 The Canteen is located near the central campus area.";

    }

    else if (
        question.includes("parking")
    ) {

        message =
            "🅿️ Parking is located near the Main Gate.";

    }

    else if (
        question.includes("reception")
    ) {

        message =
            "🛎️ Reception Area is near the Main Gate.";

    }

    else {

        message =
            "🤖 Try asking: Where is the Library, CS Lab, Communication Lab, Canteen or Parking?";

    }


    answer.innerHTML = message;

    answer.style.display = "block";

}
// ========================================
// HACKATHON IMPROVEMENTS
// ========================================


// CLEAR COMPLETE NAVIGATION
function clearNavigation() {

    clearRoute();

    const summary =
        document.getElementById("routeSummary");

    summary.innerHTML = `
        <div class="summary-placeholder">

            <div class="placeholder-icon">
                🗺️
            </div>

            <p>
                Route cleared.<br>
                Select two locations to start again.
            </p>

        </div>
    `;
}


// GENERATE STEP-BY-STEP ROUTE
function showRouteInstructions(path) {

    const summary =
        document.getElementById("routeSummary");

    if (!path || path.length < 2) {
        return;
    }

    let instructions = `
        <div class="route-instructions">

            <div class="route-instructions-title">
                🧭 Navigation Steps
            </div>
    `;

    for (let i = 1; i < path.length; i++) {

        const previous =
            locations[path[i - 1]].name;

        const current =
            locations[path[i]].name;

        instructions += `
            <div class="route-step">

                <span class="route-step-number">
                    ${i}
                </span>

                <span>
                    Walk from
                    <strong>${previous}</strong>
                    to
                    <strong>${current}</strong>
                </span>

            </div>
        `;
    }

    instructions += `
        </div>
    `;

    summary.insertAdjacentHTML(
        "beforeend",
        instructions
    );
}


// ENTER KEY FOR CAMPUS ASSISTANT

const assistantInput =
    document.getElementById("question");

if (assistantInput) {

    assistantInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                askAssistant();
            }

        }
    );
}


// MAP LOCATION CLICK

document
    .querySelectorAll(".map-location")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const location =
                    this.dataset.location;

                const destination =
                    document.getElementById(
                        "destination"
                    );

                destination.value = location;

                findRoute();

            }
        );

    });