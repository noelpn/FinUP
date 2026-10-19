// ======================================
// Finance Tracker Analytics
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    loadAnalytics();

});

// ======================================
// Load Analytics
// ======================================

async function loadAnalytics() {

    try {

        const response = await fetch("/api/analytics");

        const data = await response.json();

        if (!data.success) {

            console.log("No analytics data.");

            return;

        }

        updateStatistics(data);

        updateInsights(data);

        updateCharts(data);

    }

    catch (error) {

        console.error(error);

    }

}

// ======================================
// Statistics
// ======================================

function updateStatistics(data) {

    const totalExpense =
        document.getElementById("totalExpense");

    const avgDaily =
        document.getElementById("avgDaily");

    const highestCategory =
        document.getElementById("highestCategory");

    const prediction =
        document.getElementById("prediction");

    if(totalExpense)
        totalExpense.innerHTML = "₹ " + data.total_expense;

    if(avgDaily)
        avgDaily.innerHTML = "₹ " + data.average_daily;

    if(highestCategory)
        highestCategory.innerHTML =
            data.highest_category;

    if(prediction)
        prediction.innerHTML =
            "₹ " + data.predicted_expense;

}

// ======================================
// AI Insights
// ======================================

function updateInsights(data) {

    const list =
        document.getElementById("insightList");

    if(!list)
        return;

    list.innerHTML = "";

    data.insights.forEach((item)=>{

        const li =
            document.createElement("li");

        li.className =
            "list-group-item";

        li.innerHTML =

            "💡 " + item;

        list.appendChild(li);

    });

}

// ======================================
// Update Charts
// ======================================

function updateCharts(data){

    if(window.expenseChart){

        window.expenseChart.data.labels =
            data.months;

        window.expenseChart.data.datasets[0].data =
            data.expenses;

        window.expenseChart.update();

    }

    if(window.categoryChart){

        window.categoryChart.data.labels =
            data.categories;

        window.categoryChart.data.datasets[0].data =
            data.category_amounts;

        window.categoryChart.update();

    }

    if(window.predictionChart){

        window.predictionChart.data.labels =
            data.future_months;

        window.predictionChart.data.datasets[0].data =
            data.future_prediction;

        window.predictionChart.update();

    }

}

// ======================================
// Refresh Every Minute
// ======================================

setInterval(loadAnalytics,60000);