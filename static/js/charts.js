// =======================================
// Finance Tracker - Chart.js
// =======================================

let expenseChart = null;
let categoryChart = null;
let comparisonChart = null;
let predictionChart = null;
let percentageChart = null;
let growthChart = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Expense Trend (Line Chart)
    const expenseTrendElement = document.getElementById('expenseTrendChart');
    if (expenseTrendElement) {
        expenseChart = new Chart(expenseTrendElement, {
            type: 'line',
            data: {
                labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                datasets: [{
                    label: 'Expenses',
                    data: [320,450,280,700,560,810,640],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    // Dashboard Expense Chart
    const expenseChartElement = document.getElementById('expenseChart');
    if (expenseChartElement) {
        window.expenseChart = new Chart(expenseChartElement, {
            type: 'line',
            data: {
                labels: ['Jan','Feb','Mar','Apr','May','Jun'],
                datasets: [{
                    label: 'Monthly Expenses',
                    data: [5000,6200,5800,7300,6900,8100],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    // Category Pie Chart
    const categoryChartElement = document.getElementById('categoryChart');
    if (categoryChartElement) {
        window.categoryChart = new Chart(categoryChartElement, {
            type: 'pie',
            data: {
                labels: ['Food','Shopping','Travel','Bills','Entertainment'],
                datasets: [{
                    data: [35,20,15,18,12],
                    backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    // Monthly Comparison
    const comparisonChartElement = document.getElementById('comparisonChart');
    if (comparisonChartElement) {
        window.comparisonChart = new Chart(comparisonChartElement, {
            type: 'bar',
            data: {
                labels: ['Jan','Feb','Mar','Apr','May','Jun'],
                datasets: [{
                    label: 'Current Month',
                    data: [5200,6100,7000,6800,7400,7900],
                    backgroundColor: '#007bff'
                },
                {
                    label: 'Previous Month',
                    data: [4700,5600,6500,6200,7100,7300],
                    backgroundColor: '#6c757d'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    // Prediction Chart
    const predictionChartElement = document.getElementById('predictionChart');
    if (predictionChartElement) {
        window.predictionChart = new Chart(predictionChartElement, {
            type: 'line',
            data: {
                labels: ['Current','Next','2 Months','3 Months'],
                datasets: [{
                    label: 'Predicted Spending',
                    data: [8200,8600,9000,9450],
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    borderDash: [6,6],
                    borderWidth: 3,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    // Category Percentage
    const percentageChartElement = document.getElementById('percentageChart');
    if (percentageChartElement) {
        window.percentageChart = new Chart(percentageChartElement, {
            type: 'doughnut',
            data: {
                labels: ['Food','Shopping','Travel','Bills','Others'],
                datasets: [{
                    data: [40,18,15,17,10],
                    backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    // Growth Chart
    const growthChartElement = document.getElementById('growthChart');
    if (growthChartElement) {
        window.growthChart = new Chart(growthChartElement, {
            type: 'bar',
            data: {
                labels: ['Jan','Feb','Mar','Apr','May','Jun'],
                datasets: [{
                    label: 'Growth %',
                    data: [5,8,12,10,15,18],
                    backgroundColor: '#ffc107'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }
}