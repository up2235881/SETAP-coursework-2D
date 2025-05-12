document.querySelector(".back-button").addEventListener("click", function () {
    window.history.back()
})

document.querySelector(".save-button").addEventListener("click", function () {
    let name = document.getElementById("name").value.trim()
    let day = document.getElementById("day").value
    let time = document.getElementById("time").value

    if (name && day && time) {
        let availability = JSON.parse(localStorage.getItem("availability") || "[]")
        availability.push({ name, day, time })
        localStorage.setItem("availability", JSON.stringify(availability))
        alert(`Saved: ${name} - ${day}, ${time}`)

        // Optional: clear form
        document.getElementById("name").value = ""
        document.getElementById("day").value = ""
        document.getElementById("time").value = ""
    } else {
        alert("Please fill in all fields (name, day, and time).")
    }
})
