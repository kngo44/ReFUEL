const back_end_url = "http://localhost:500"
document.addEventListener('DOMContentLoaded', function() {
    const clientID = localStorage.getItem("clientID");
    const gallonsInput = document.getElementById('galreq');
    const suggestedPriceInput = document.getElementById('suggestedprice');
    const totaldueInput = document.getElementById('totaldue');

    gallonsInput.addEventListener('input', calculatetotaldue);
    suggestedPriceInput.addEventListener('input', calculatetotaldue);

    function calculatetotaldue() {
        const galreq = parseFloat(gallonsInput.value);
        const suggestedprice = parseFloat(suggestedPriceInput.value);

        if (!isNaN(galreq) && !isNaN(suggestedprice)) {
            const totaldue = galreq * suggestedprice;
            totaldueInput.value = totaldue.toFixed(2);
        }
        console.log("Total due calculated:", totaldueInput.value);
    }

    suggestedPriceInput.value = '2.57'; // hardcoding for now

    const fuelQuoteForm = document.getElementById('submit_quote');
    fuelQuoteForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const galreq = document.getElementById('galreq').value;
        const deliveryaddress = document.getElementById('deliveryaddress').value;
        const deliverydate = formatDate(document.getElementById('deliverydate').value);
        const suggestedprice = document.getElementById('suggestedprice').value;
        const totaldue = document.getElementById('totaldue').value;

        console.log("Form data:", galreq, deliveryaddress, deliverydate, suggestedprice, totaldue);

        const response = fetch(back_end_url + "/fuelquote/submit_quote", {
            method: 'POST',
            body: JSON.stringify({ 
                galreq,
                deliveryaddress, 
                deliverydate, 
                suggestedprice,
                totaldue, 
                clientID
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error submitting fuel quote');
            }
            return response.json();
        })
        .then(data => {
            console.log("Server response:", data);
            alert("Fuel quote submitted");
            gallonsInput.value = '';
            deliveryaddress.value = '';
            deliverydate.value = '';
            suggestedPriceInput.value = '';
            totaldueInput.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    })
        

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    }
});