// =========================================
// Finance Tracker
// Manual AI Expense Entry
// =========================================

const aiExpenseForm = document.querySelector(
    'form[action="/ai_expense"]'
);

if (aiExpenseForm) {

    aiExpenseForm.addEventListener("submit", async function(e){

        e.preventDefault();

        const textarea =
            document.querySelector(
                'textarea[name="expense_text"]'
            );

        const expenseText = textarea.value.trim();

        if(expenseText === ""){

            alert("Please enter an expense.");

            return;

        }

        const submitButton =
            aiExpenseForm.querySelector("button");

        submitButton.disabled = true;

        submitButton.innerHTML = "Analyzing...";

        try{

            const response = await fetch("/ai_expense",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    expense_text:expenseText

                })

            });

            const result = await response.json();

            submitButton.disabled = false;

            submitButton.innerHTML =
                "Analyze with AI";

            if(result.success){

                alert(

                    "Expense Saved!\n\n" +

                    "Amount : ₹" + result.amount +

                    "\nCategory : " + result.category +

                    "\nMerchant : " + result.merchant +

                    "\nDate : " + result.date

                );

                textarea.value="";

            }

            else{

                alert(result.message);

            }

        }

        catch(error){

            submitButton.disabled = false;

            submitButton.innerHTML =
                "Analyze with AI";

            console.error(error);

            alert("Unable to process expense.");

        }

    });

}