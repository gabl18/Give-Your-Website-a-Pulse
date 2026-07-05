const date = document.querySelector("#datepicker").value;
const API_KEY = import.meta.env.VITE_NASA_API_KEY;

/*fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)*/

function fetchNasaData(selectedDate) {
    const appDiv = document.querySelector("#app");
    appDiv.innerHTML = "<p>loading...</p>";

    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    if (selectedDate) {
        url += `&date=${selectedDate}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network-Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let media = "";

            if (data.media_type === "image") {
                media = `<img src="${data.url}" alt="${data.title}" style="max-width: 100%; height: auto;" />`;
            } else if (data.media_type === "video") {
                if (data.url.includes("youtube.com") || data.url.includes("youtu.be") || data.url.includes("vimeo.com")) {
                    media = `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width: 100%; height: 400px;"></iframe>`;
                } else {
                    media = `<video src="${data.url}" controls style="max-width: 100%;"></video>`;
                }
            }

            appDiv.innerHTML = `
                <h1>${data.title}</h1>
                ${media}
                <p>${data.explanation}</p>
            `;
        })
        .catch(err => {
            appDiv.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
            console.error(err);
        });
}
fetchNasaData("");

document.querySelector("#datepicker").addEventListener("change", (event) => {
    fetchNasaData(event.target.value);
});