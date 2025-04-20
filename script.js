console.log("hello from qasr bagdad");

// UI Elements
let prayerTimesUi = document.querySelector("#prayers");
let quranUi = document.querySelector("#quran");
const audioPlayer = document.getElementById("quranAudio");
// Global Obj from API
let prayersTimes;
let quran;
let quranViewTrue = false;
let allSouras;

const today = new Date();
const options = {
  weekday: "long", // اسم اليوم
  year: "numeric",
  month: "long", // اسم الشهر
  day: "numeric",
};

const arabicDate = today.toLocaleDateString("ar-EG", options);

console.log(arabicDate);

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const fetchData = async function (url) {
  try {
    let response = await fetch(url);
    console.log(response);
    let data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const viewData = async () => {
  document
    .querySelectorAll(".prayer-time")
    .forEach((e) => (e.textContent = `00:00 `));
  navigator.geolocation.getCurrentPosition(
    function (position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      // استخدم Nominatim لعمل Reverse Geocoding
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      )
        .then((response) => response.json())
        .then(async (data) => {
          let country = data.address.country;
          let city = data.address.city;
          console.log(data);

          console.log("البلد: " + country);
          prayersTimes = await fetchData(
            `https://api.aladhan.com/v1/timingsByCity/17-04-2025?city=${city}&country=${country}&method=8`
          );
          quran = await fetchData(`https://api.alquran.cloud/v1/surah`);
          console.log(prayersTimes.data, prayersTimes.data, quran.data[0]);
          allSouras = await fetchData(
            `https://api.quran.com/api/v4/chapter_recitations/7`
          );
          console.log(allSouras);

          displayData(prayersTimes, quran);
        })
        .catch((error) => {
          console.error("حصل خطأ في جلب اسم البلد:", error);
        });
    },
    function (error) {
      console.error("حدث خطأ أثناء جلب الموقع:", error.message);
    }
  );
};
viewData();

const displayData = (prayersTimes = "", quran) => {
  prayerTimesUi.innerHTML = `
<div class="container">
<h2 class="section-title">Prayer Times</h2>
<p class="section-subtitle">Connecting with Allah five times a day helps us stay mindful and present in our faith.</p>

<div class="prayer-cards">
<div class="prayer-card">
<div class="arabic-name"><span class = 'arabic-Date'>${arabicDate}</span></div>
<div class="arabic-name">الفجر</div>
    <div class="prayer-name">${Object.keys(prayersTimes.data.timings)[0]}</div>
    <div class="prayer-time">${
      Object.values(prayersTimes.data.timings)[0]
    } AM</div>
  </div>

  <div class="prayer-card">
  <div class="arabic-name"><span class = 'arabic-Date'>${arabicDate}</span></div>

    <div class="arabic-name">الظهر</div>
    <div class="prayer-name">${Object.keys(prayersTimes.data.timings)[2]}</div>
    <div class="prayer-time">${
      Object.values(prayersTimes.data.timings)[2]
    } PM</div>
  </div>

  <div class="prayer-card">
  <div class="arabic-name"><span class = 'arabic-Date'>${arabicDate}</span></div>

    <div class="arabic-name">العصر</div>
    <div class="prayer-name">${Object.keys(prayersTimes.data.timings)[3]}</div>
    <div class="prayer-time">${
      Object.values(prayersTimes.data.timings)[3]
    } PM</div>
  </div>

  <div class="prayer-card">
  <div class="arabic-name"><span class = 'arabic-Date'>${arabicDate}</span></div>

    <div class="arabic-name">المغرب</div>
    <div class="prayer-name">${Object.keys(prayersTimes.data.timings)[5]}</div>
    <div class="prayer-time">${
      Object.values(prayersTimes.data.timings)[5]
    } PM</div>
  </div>

  <div class="prayer-card">
  <div class="arabic-name"><span class = 'arabic-Date'>${arabicDate}</span></div>

    <div class="arabic-name">العشاء</div>
    <div class="prayer-name">${Object.keys(prayersTimes.data.timings)[6]}</div>
    <div class="prayer-time">${
      Object.values(prayersTimes.data.timings)[6]
    } PM</div>
  </div>
</div>

<p class="prayer-note">Prayer times are calculated for ${
    prayersTimes.data.meta.timezone
  }. </p>
</div>
`;
  delay(500);
  const randomSoura = {
    1: Math.floor(Math.random() * 114),
    2: Math.floor(Math.random() * 114),
    3: Math.floor(Math.random() * 114),
    4: Math.floor(Math.random() * 114),
    5: Math.floor(Math.random() * 114),
    6: Math.floor(Math.random() * 114),
  };

  if (!quranViewTrue)
    quranUi.innerHTML = `
<div class="container">
      <h2 class="section-title">Quranic Verses</h2>
      <p class="section-subtitle">Find peace and wisdom in the words of Allah</p>
      
      <div class="quran-verses">
        <div class="verse-card"  data-audio = '${
          allSouras.audio_files[randomSoura[`1`]].audio_url
        }'>
          <div class="verse-arabic">${
            (prayersTimes.data, quran.data[randomSoura["1"]].name)
          }</div>
          <div class="verse-translation">"${
            (prayersTimes.data, quran.data[randomSoura["1"]].englishName)
          }"</div>
          <div class="verse-reference">${
            (prayersTimes.data, quran.data[randomSoura["1"]].revelationType)
          } <span class = 'AyahsNum'>"(${
      quran.data[randomSoura["1"]].numberOfAyahs
    } Ayahs)"<span/></div>
        </div>

        <div class="verse-card"  data-audio = '${
          allSouras.audio_files[randomSoura[`2`]].audio_url
        }'>
        <div class="verse-arabic">${
          (prayersTimes.data, quran.data[randomSoura["2"]].name)
        }</div>
        <div class="verse-translation">"${
          (prayersTimes.data, quran.data[randomSoura["2"]].englishName)
        }"</div>
        <div class="verse-reference">${
          (prayersTimes.data, quran.data[randomSoura["2"]].revelationType)
        } <span class = 'AyahsNum'>"(${
      quran.data[randomSoura["2"]].numberOfAyahs
    } Ayahs)"<span/></div>
        </div>

        <div class="verse-card" data-audio = '${
          allSouras.audio_files[randomSoura[`3`]].audio_url
        }'>
        <div class="verse-arabic">${
          (prayersTimes.data, quran.data[randomSoura["3"]].name)
        }</div>
        <div class="verse-translation">"${
          (prayersTimes.data, quran.data[randomSoura["3"]].englishName)
        }"</div>
        <div class="verse-reference">${
          (prayersTimes.data, quran.data[randomSoura["3"]].revelationType)
        } <span class = 'AyahsNum'>"(${
      quran.data[randomSoura["3"]].numberOfAyahs
    } Ayahs)"<span/></div>
        </div>
        <div class="verse-card" data-audio = '${
          allSouras.audio_files[randomSoura[`4`]].audio_url
        }'>
        <div class="verse-arabic">${
          (prayersTimes.data, quran.data[randomSoura["4"]].name)
        }</div>
        <div class="verse-translation">"${
          (prayersTimes.data, quran.data[randomSoura["4"]].englishName)
        }"</div>
        <div class="verse-reference">${
          (prayersTimes.data, quran.data[randomSoura["4"]].revelationType)
        }<span class = 'AyahsNum'>"(${
      quran.data[randomSoura["4"]].numberOfAyahs
    } Ayahs)"<span/></div>
        </div>
        <div class="verse-card" data-audio = '${
          allSouras.audio_files[randomSoura[`5`]].audio_url
        }'>
        <div class="verse-arabic">${
          (prayersTimes.data, quran.data[randomSoura["5"]].name)
        }</div>
        <div class="verse-translation">"${
          (prayersTimes.data, quran.data[randomSoura["5"]].englishName)
        }"</div>
        <div class="verse-reference">${
          (prayersTimes.data, quran.data[randomSoura["5"]].revelationType)
        }<span class = 'AyahsNum'>"(${
      quran.data[randomSoura["5"]].numberOfAyahs
    } Ayahs)"<span/></div>
        </div>
        <div class="verse-card" data-audio = '${
          allSouras.audio_files[randomSoura[`6`]].audio_url
        }'>
        <div class="verse-arabic">${
          (prayersTimes.data, quran.data[randomSoura["6"]].name)
        }</div>
        <div class="verse-translation">"${
          (prayersTimes.data, quran.data[randomSoura["6"]].englishName)
        }"</div>
        <div class="verse-reference">${
          (prayersTimes.data, quran.data[randomSoura["6"]].revelationType)
        }   <span class = 'AyahsNum'>"(${
      quran.data[randomSoura["6"]].numberOfAyahs
    } Ayahs)"<span/></div>
        </div>
        <div >
          
        </div>
        <div class="verse-card-end">
          <a href="allQuran.html" >Go to More ...</a>
        </div>
      </div>
    </div>
          <audio id="quranAudio" controls style="display: none"></audio>
`;
  document
    .querySelectorAll(".AyahsNum")
    .forEach((e) => (e.style.color = "#333333"));

  document.querySelectorAll(".verse-card").forEach((card) => {
    card.addEventListener("click", () => {
      console.log("play");

      const souraSrc = card.getAttribute("data-audio");
      audioPlayer.src = souraSrc;
      audioPlayer.play();
    });
  });
};

const obj = {
  name: "omar",
  age: 20,
};

console.log();
