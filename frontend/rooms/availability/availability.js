document.querySelector(".back-button").addEventListener("click", function () {
    window.history.back()
})

document.querySelector(".save-button").addEventListener("click", function () {
    let day = document.getElementById("day").value
    let time = document.getElementById("time").value

    if (day && time) {
        alert(`Availability saved: ${day}, ${time}`)
    }
    else
    {
        alert("Please select both day and time")
    }
})