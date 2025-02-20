const apiKey = "cc9c8760e0693d76684e7d88eaf241c9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchButton = document.getElementById("searchbutton");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
    else {
        var data = await response.json();

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        }
        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "https://freesvg.org/img/sivvus_weather_symbols_4.png";
        }
        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }
        else {
            weatherIcon.src = "images/snow.png";
        }

        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}


searchButton.addEventListener("click", () => {
    checkWeather(searchBox.value);
})

searchBox.addEventListener("keypress", (event)=>{
    if (event.key === "Enter"){
        checkWeather(searchBox.value);
    }
})




const searchBox2 = document.querySelector("#cityInput");
const cityList = document.querySelector("#cityList");

async function getCitySuggestions(query) {
    if (query.length < 2) return; 

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${query}&format=json&limit=10`);
        const data = await response.json();

        cityList.innerHTML = "";

        data.forEach((city) => {
            let option = document.createElement("option");
            option.value = city.display_name;
            cityList.appendChild(option);
        });
    } 
    catch (error) {
        console.error("Error fetching city suggestions:", error);
    }
}

searchBox2.addEventListener("input", () => {
    getCitySuggestions(searchBox2.value);
});




const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function toggleTheme() {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    } 
    else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
    }
}

if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {
    toggleTheme();
});




const voiceButton = document.getElementById("voiceSearch");
const searchInput = document.querySelector(".search input");


if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US"; 
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1;

    voiceButton.addEventListener("click", () => {
        recognition.start(); 
        voiceButton.classList.add("listening");
    });

    recognition.onresult = (event) => {
        const city = event.results[0][0].transcript;
        searchInput.value = city; 
        checkWeather(city); 
        voiceButton.classList.remove("listening");
    };

    recognition.onend = () => {
        voiceButton.classList.remove("listening");
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Sorry, could not recognize your voice. Please try again.");
        voiceButton.classList.remove("listening");
    };
} 
else {
    alert("Voice search is not supported in this browser. Please use Google Chrome.");
}




if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
            registration.unregister();
        }
    });

    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((error) => console.log("Service Worker Registration Failed:", error));
}




let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    console.log("✅ beforeinstallprompt event fired");
    event.preventDefault();  
    deferredPrompt = event;  
});

document.getElementById("installApp").addEventListener("click", async () => {
    console.log("📥 Install button clicked!");

    if (deferredPrompt) {
        console.log("✅ Showing install prompt...");
        deferredPrompt.prompt();

        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
            console.log("🎉 User accepted the install prompt");
        } 
        else {
            console.log("❌ User dismissed the install prompt");
        }
        deferredPrompt = null; 
    } 
    else {
        console.log("⚠️ No valid install prompt available.");
    }
});








