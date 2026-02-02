// shout out to gtp 4o for one-shotting this one

document.addEventListener("DOMContentLoaded", () => {
    const calculateButton = document.querySelector(".calc-button");
    const inputs = document.querySelectorAll(".text-input");
    const radioButtons = document.querySelectorAll("input[name='group-1']");
    const errorMessages = document.querySelectorAll(".input-error");
    const resultsContainer = document.querySelector(".results");
    const mortgageAmountInput = document.querySelector(".mortgage-amount .text-input");
    
    function clearErrors() {
        errorMessages.forEach(error => error.classList.remove("show"));
        document.querySelectorAll(".input-container").forEach(input => {
            input.style.border = ""
            input.classList.remove("error")
        });
    }

    function validateInputs() {
        let isValid = true;
        clearErrors();
        
        inputs.forEach((input, index) => {
            const container = input.closest(".input-container")
            const label = container.querySelector(".blue-label")
            let value = input.value.trim().replace(/,/g, "")

            if (!value || isNaN(value)) {
                errorMessages[index].classList.add("show");
                errorMessages[index].style.display = "block";
                container.style.border = "2px solid hsl(4, 69%, 50%)"
                container.classList.add("error")

                if (label)
                    label.classList.add("error")
                
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

        if (isNaN(principal) || isNaN(interestRate) || isNaN(numPayments))
            return { monthlyPayment: "Error", totalPayment: "Error"}
        
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

    function formatLargeNumber(number) {
        const num = parseFloat(number.replace(/,/g, ""))

        if (num >= 1_000_000_000)
            return (num / 1_000_000_000).toFixed(1) + "B"
        else if (num > 1_000_000)
            return (num / 1_000_000).toFixed(1) + "M"

        return number
    }

    function displayResults(monthly, total) {
        resultsContainer.classList.add('on')

        const formattedMonthly = formatLargeNumber(monthly)
        const formattedTotal = formatLargeNumber(total)

        resultsContainer.innerHTML = `
            <p class="results-title">Your results</p>
            <p class="results-p">Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again.</p>
            <div class="results-container">
                <div class="monthly-repayment">
                    <p class="monthly-p">Your monthly repayments</p>
                    <p class="monthly">£${formattedMonthly}</p>
                </div>
                <div class="total-repayment">
                    <p class="total-p">Total you'll repay over the term</p>
                    <p class="total">£${formattedTotal}</p>
                </div>
            </div>
        `;
        resultsContainer.classList.remove("off");
    }

    mortgageAmountInput.addEventListener("input", () => formatNumberInput(mortgageAmountInput));

    inputs.forEach(input => {
        input.addEventListener("input", () => {
            const container = input.closest(".input-container");
            const error = container.nextElementSibling;
            const label = container.querySelector(".blue-label");
            if (error && error.classList.contains("input-error")) {
                error.style.display = "none";
                container.style.border = ""
                container.classList.remove("error")

                if (label)
                    label.classList.remove("error")
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