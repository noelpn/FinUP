// =============================================
// Finance Tracker - Budget Management
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    loadBudget();

});

// =============================================
// Load Budget Information
// =============================================

async function loadBudget() {

    try {

        const response = await fetch("/api/budget");

        const data = await response.json();

        if (!data.success) {

            console.log("No budget data available.");

            return;

        }

        updateSummary(data);

        updateProgress(data);

        updateCategoryBudget(data);

        updateAlerts(data);

        updateRecommendations(data);

    }

    catch (error) {

        console.error("Budget Error:", error);

    }

}

// =============================================
// Summary Cards
// =============================================

function updateSummary(data) {

    const monthlyBudget =
        document.getElementById("monthlyBudget");

    const totalSpent =
        document.getElementById("totalSpent");

    const remainingBudget =
        document.getElementById("remainingBudget");

    const usagePercentage =
        document.getElementById("usagePercentage");

    if(monthlyBudget)
        monthlyBudget.innerHTML =
            "₹ " + data.monthly_budget;

    if(totalSpent)
        totalSpent.innerHTML =
            "₹ " + data.total_spent;

    if(remainingBudget)
        remainingBudget.innerHTML =
            "₹ " + data.remaining_budget;

    if(usagePercentage)
        usagePercentage.innerHTML =
            data.usage_percentage + "%";

}

// =============================================
// Budget Progress
// =============================================

function updateProgress(data){

    const progress =
        document.getElementById("budgetProgress");

    if(!progress)
        return;

    progress.style.width =
        data.usage_percentage + "%";

    progress.innerHTML =
        data.usage_percentage + "%";

    progress.className = "progress-bar";

    if(data.usage_percentage < 60){

        progress.classList.add("bg-success");

    }

    else if(data.usage_percentage < 90){

        progress.classList.add("bg-warning");

    }

    else{

        progress.classList.add("bg-danger");

    }

}

// =============================================
// Category Budget Table
// =============================================

function updateCategoryBudget(data){

    const table =
        document.getElementById("categoryBudgetTable");

    if(!table)
        return;

    table.innerHTML = "";

    data.categories.forEach(category=>{

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${category.name}</td>

            <td>₹ ${category.limit}</td>

            <td>₹ ${category.spent}</td>

            <td>₹ ${category.remaining}</td>

        `;

        table.appendChild(row);

    });

}

// =============================================
// Alerts
// =============================================

function updateAlerts(data){

    const list =
        document.getElementById("budgetAlerts");

    if(!list)
        return;

    list.innerHTML = "";

    data.alerts.forEach(alert=>{

        const li =
            document.createElement("li");

        li.className =
            "list-group-item";

        li.innerHTML =

            "⚠ " + alert;

        list.appendChild(li);

    });

}

// =============================================
// AI Recommendations
// =============================================

function updateRecommendations(data){

    const list =
        document.getElementById("budgetRecommendations");

    if(!list)
        return;

    list.innerHTML = "";

    data.recommendations.forEach(item=>{

        const li =
            document.createElement("li");

        li.className =
            "list-group-item";

        li.innerHTML =

            "💡 " + item;

        list.appendChild(li);

    });

}

// =============================================
// Auto Refresh
// =============================================

setInterval(loadBudget,60000);