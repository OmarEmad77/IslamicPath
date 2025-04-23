let allSouras, quran;
let selectSheikh = localStorage.getItem("selectSheikh") || 1;

document.addEventListener("DOMContentLoaded", async () => {
  quran = await fetchData(`https://api.alquran.cloud/v1/surah`);
  allSouras = await fetchData(
    `https://api.quran.com/api/v4/chapter_recitations/${selectSheikh}`
  );

  displayAllQuran();
  playSoura();
});

async function fetchData(url) {
  const res = await fetch(url);
  return await res.json();
}

function displayAllQuran() {
  const container = document.querySelector(".quran-verses");

  quran.data.forEach((sura, i) => {
    const card = `
      <div class="verse-card" data-audio="${
        allSouras.audio_files[i]?.audio_url || ""
      }">
        <div class="verse-arabic">${sura.name}</div>
        <div class="verse-translation">${sura.englishName}</div>
        <div class="verse-reference">${sura.revelationType}
          <span class='AyahsNum'>(${sura.numberOfAyahs} Ayahs)</span>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", card);
  });

  document
    .querySelectorAll(".AyahsNum")
    .forEach((e) => (e.style.color = "#333"));
}
