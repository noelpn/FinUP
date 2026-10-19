// =============================================
// Finance Tracker - AI Suggestions
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    loadSuggestions();

});

// =============================================
// Load Suggestions
// =============================================

async function loadSuggestions() {

    try {

        const response = await fetch("/api/suggestions");

        const data = await response.json();

        if (!data.success) {

            console.log("No suggestions available.");

            return;

        }

        updateSummary(data);

        updateRecommendations(data);

        updateSavings(data);

        updateAlerts(data);

        updatePrediction(data);

    }

    catch(error){

        console.error(error);

    }

}

// =============================================
// Summary Cards
// =============================================

function updateSummary(data){

    const predictedExpense =
        document.getElementById("predictedExpense");

    const expectedSavings =
        document.getElementById("expectedSavings");

    const highestCategory =
        document.getElementById("highestCategory");

    const budgetStatus =
        document.getElementById("budgetStatus");

    if(predictedExpense)
        predictedExpense.innerHTML =
            "₹ " + data.predicted_expense;

    if(expectedSavings)
        expectedSavings.innerHTML =
            "₹ " + data.expected_savings;

    if(highestCategory)
        highestCategory.innerHTML =
            data.highest_category;

    if(budgetStatus)
        budgetStatus.innerHTML =
            data.budget_status;

}

// =============================================
// AI Recommendations
// =============================================

function updateRecommendations(data){

    const list =
        document.getElementById("recommendationList");

    if(!list) return;

    list.innerHTML="";

    data.recommendations.forEach(item=>{

        const li=document.createElement("li");

        li.className="list-group-item";

        li.innerHTML="💡 "+item;

        list.appendChild(li);

    });

}

// =============================================
// Savings Table
// =============================================

function updateSavings(data){

    const table =
        document.getElementById("savingsTable");

    if(!table) return;

    table.innerHTML="";

    data.savings.forEach(item=>{

        const row=document.createElement("tr");

        row.innerHTML=`

            <td>${item.category}</td>

            <td>₹ ${item.current}</td>

            <td>₹ ${item.suggested}</td>

            <td class="text-success">

                ₹ ${item.saved}

            </td>

        `;

        table.appendChild(row);

    });

}

// =============================================
// Alerts
// =============================================

function updateAlerts(data){

    const list =
        document.getElementById("alertList");

    if(!list) return;

    list.innerHTML="";

    data.alerts.forEach(item=>{

        const li=document.createElement("li");

        li.className="list-group-item";

        li.innerHTML="⚠ "+item;

        list.appendChild(li);

    });

}

// =============================================
// Prediction Chart
// =============================================

function updatePrediction(data){

    if(window.predictionChart){

        window.predictionChart.data.labels =
            data.months;

        window.predictionChart.data.datasets[0].data =
            data.prediction;

        window.predictionChart.update();

    }

}

// =============================================
// Refresh Every Minute
// =============================================

setInterval(loadSuggestions,60000);