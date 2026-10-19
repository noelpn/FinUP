// ======================================
// Finance Tracker Comparison
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadComparison();

});

// ======================================
// Load Comparison Data
// ======================================

async function loadComparison() {

    try {

        const response = await fetch("/api/comparison");

        const data = await response.json();

        if (!data.success) {

            console.log("No comparison data.");

            return;

        }

        updateSummary(data);

        updateComparisonTable(data);

        updateInsights(data);

        updateCharts(data);

    }

    catch (error) {

        console.error(error);

    }

}

// ======================================
// Summary Cards
// ======================================

function updateSummary(data) {

    const current =
        document.getElementById("currentMonth");

    const previous =
        document.getElementById("previousMonth");

    const difference =
        document.getElementById("difference");

    const percentage =
        document.getElementById("percentage");

    if(current)
        current.innerHTML =
            "₹ " + data.current_month;

    if(previous)
        previous.innerHTML =
            "₹ " + data.previous_month;

    if(difference)
        difference.innerHTML =
            "₹ " + data.difference;

    if(percentage)
        percentage.innerHTML =
            data.percentage + "%";

}

// ======================================
// Update Table
// ======================================

function updateComparisonTable(data) {

    const tbody =
        document.getElementById("comparisonTable");

    if(!tbody)
        return;

    tbody.innerHTML = "";

    data.categories.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${item.category}</td>

            <td>₹ ${item.previous}</td>

            <td>₹ ${item.current}</td>

            <td>${item.change}</td>

        `;

        tbody.appendChild(row);

    });

}

// ======================================
// AI Insights
// ======================================

function updateInsights(data){

    const list =
        document.getElementById("comparisonInsights");

    if(!list)
        return;

    list.innerHTML = "";

    data.insights.forEach(text=>{

        const li =
            document.createElement("li");

        li.className =
            "list-group-item";

        li.innerHTML =

            "📈 " + text;

        list.appendChild(li);

    });

}

// ======================================
// Update Charts
// ======================================

function updateCharts(data){

    if(window.comparisonChart){

        window.comparisonChart.data.labels =
            data.months;

        window.comparisonChart.data.datasets[0].data =
            data.current;

        window.comparisonChart.data.datasets[1].data =
            data.previous;

        window.comparisonChart.update();

    }

    if(window.growthChart){

        window.growthChart.data.labels =
            data.months;

        window.growthChart.data.datasets[0].data =
            data.growth;

        window.growthChart.update();

    }

}

// ======================================
// Auto Refresh
// ======================================

setInterval(loadComparison,60000);