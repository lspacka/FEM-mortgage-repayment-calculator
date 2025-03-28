document.addEventListener("DOMContentLoaded", () => {
    const calculateButton = document.querySelector(".calc-button");
    const inputs = document.querySelectorAll(".text-input");
    const radioButtons = document.querySelectorAll("input[name='group-1']");
    const errorMessages = document.querySelectorAll(".input-error");
    const resultsContainer = document.querySelector(".results");
    const mortgageAmountInput = document.querySelector(".mortgage-amount .text-input");
    
    function clearErrors() {
        errorMessages.forEach(error => error.classList.remove("show"));
        document.querySelectorAll(".input-container").forEach(input => input.style.border = "");
    }

    function validateInputs() {
        let isValid = true;
        clearErrors();
        
        inputs.forEach((input, index) => {
            if (!input.value.trim()) {
                errorMessages[index].classList.add("show");
                errorMessages[index].style.display = "block";
                input.closest(".input-container").style.border = "2px solid hsl(4, 69%, 50%)";
                isValid = false;
            }
        });

        if (![...radioButtons].some(radio => radio.checked)) {
            const radioError = document.querySelector(".radio-error");
            radioError.classList.add("show");
            radioError.style.display = "block";
            isValid = false;
        }
        
        return isValid;
    }

    function calculateMortgage(amount, years, rate, isRepayment) {
        const principal = parseFloat(amount.replace(/,/g, ""));
        const interestRate = parseFloat(rate) / 100 / 12;
        const numPayments = parseInt(years) * 12;
        let monthlyPayment, totalPayment;
        
        if (isRepayment) {
            monthlyPayment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -numPayments));
        } else {
            monthlyPayment = (principal * (parseFloat(rate) / 100)) / 12;
        }
        
        totalPayment = isRepayment ? monthlyPayment * numPayments : monthlyPayment * numPayments;
        
        return { 
            monthlyPayment: monthlyPayment.toLocaleString("en-UK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
            totalPayment: totalPayment.toLocaleString("en-UK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
        };
    }

    function formatNumberInput(input) {
        let value = input.value.replace(/,/g, "");
        if (!isNaN(value) && value !== "") {
            input.value = parseFloat(value).toLocaleString("en-UK");
        }
    }

    function displayResults(monthly, total) {
        resultsContainer.classList.add('on')
        resultsContainer.innerHTML = `
            <p class="results-title">Your results</p>
            <p class="results-p">Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again.</p>
            <div class="results-container">
                <div class="monthly-repayment">
                    <p class="monthly-p">Your monthly repayments</p>
                    <p class="monthly">£${monthly}</p>
                </div>
                <div class="total-repayment">
                    <p class="total-p">Total you'll repay over the term</p>
                    <p class="total">£${total}</p>
                </div>
            </div>
        `;
        resultsContainer.classList.remove("off");
    }

    mortgageAmountInput.addEventListener("input", () => formatNumberInput(mortgageAmountInput));

    inputs.forEach(input => {
        input.addEventListener("input", () => {
            const error = input.closest(".input-container").nextElementSibling;
            if (error && error.classList.contains("input-error")) {
                error.style.display = "none";
                input.closest(".input-container").style.border = "";
            }
        });
    });

    radioButtons.forEach(radio => {
        radio.addEventListener("change", () => {
            const radioError = document.querySelector(".radio-error");
            if (radioError) {
                radioError.style.display = "none";
            }
        });
    });

    calculateButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (!validateInputs()) return;

        const mortgageAmount = mortgageAmountInput.value;
        const mortgageTerm = document.querySelector(".term-rate .info:nth-child(1) .text-input").value;
        const interestRate = document.querySelector(".term-rate .info:nth-child(2) .text-input").value;
        const isRepayment = document.getElementById("radio-1").checked;

        const { monthlyPayment, totalPayment } = calculateMortgage(mortgageAmount, mortgageTerm, interestRate, isRepayment);
        displayResults(monthlyPayment, totalPayment);
    });
});
