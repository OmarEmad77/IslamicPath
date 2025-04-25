console.log("hello from qasr bagdad");

// UI Elements
let prayerTimesUi = document.querySelector("#prayers");
let quranUi = document.querySelector("#quran");
const audioPlayer = document.getElementById("quranAudio");

let prayersTimes;
let quran;
let quranViewTrue = false;
let allSouras;
let selectSheikh = 1;
let lat, lon, country, city;

window.onload = async () => {
  setTimeout(() => {
    playSoura();
  }, 1000);
};

const today = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const arabicDate = today.toLocaleDateString("ar-EG", options);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchData = async function (url) {
  try {
    let response = await fetch(url);
    let data = await response.json();
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

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        try {
          lat = position.coords.latitude;
          lon = position.coords.longitude;

          const geoData = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
          ).then((res) => res.json());

          country = geoData.address.country || "egypt";
          city =
            geoData.address.city ||
            geoData.address.town ||
            geoData.address.village ||
            "cairo";

          await fetchAndDisplayData(city, country);
        } catch (error) {
          console.error("Error fetching geolocation data:", error);
          await fallbackToManualInput();
        }
      },
      async function (error) {
        console.error("Geolocation error:", error.message);
        await fallbackToManualInput();
      }
    );
  } else {
    alert("المتصفح لا يدعم تحديد الموقع الجغرافي.");
    await fallbackToManualInput();
  }
};

async function fallbackToManualInput() {
  let city = prompt(
    "لم نتمكن من تحديد موقعك. من فضلك أدخل اسم المدينة:",
    "Cairo"
  );
  let country = prompt("أدخل اسم الدولة:", "Egypt");

  if (!city || !country) {
    city = "Cairo";
    country = "Egypt";
  }

  await fetchAndDisplayData(city, country);
  playSoura();
}

async function fetchAndDisplayData(city = "cairo", country = "egypt") {
  try {
    prayersTimes = await fetchData(
      `https://api.aladhan.com/v1/timingsByCity/${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}?city=${city}&country=${country}&method=8`
    );

    quran = await fetchData(`https://api.alquran.cloud/v1/surah`);
    localStorage.setItem("allQuran", JSON.stringify(quran.data));

    allSouras = await fetchData(
      `https://api.quran.com/api/v4/chapter_recitations/${selectSheikh}`
    );
    // localStorage.setItem("allSour", JSON.stringify(allSouras.audio_files));
    displayData(prayersTimes, quran);
  } catch (error) {
    console.error("Error fetching prayer or Quran data:", error);
    alert("حدث خطأ أثناء جلب البيانات. تأكد من اتصال الإنترنت.");
  }
}

viewData();

//Display السور بطريقة عشوائية كل مره
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
      
             <div class="select-container">
          <label for="reciterSelect">اختر القارئ:</label>
          <select id="reciterSelect">
            <!-- الخمسة الجدد -->
            <option value="9">محمد صديق المنشاوي</option>
            <option value="104">ناصر القطامي</option>
            <option value="4">أبو بكر الشاطري</option>
            <option value="159">ماهر المعيقلي</option>
            <option value="13">سعد الغامدي</option>

            <!-- الخمسة الأولين -->
            <option value="1">عبد الباسط عبد الصمد</option>
            <option value="7">مشاري راشد العفاسي</option>
           <option value="15">عبدالباري الثبيتي</option>

            <option value="6">الحصري</option>
            <option value="80">هزاع البلوشي</option>
          </select>
        </div>
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
  changeSelector();
  document.getElementById("reciterSelect").value = selectSheikh;
  document
    .querySelectorAll(".AyahsNum")
    .forEach((e) => (e.style.color = "#333333"));
};

// اختيار القيمة الموجوده داخل السليكتو عند تغيره كل مره باستخدام ايفينت change
function changeSelector() {
  const reciterSelect = document.getElementById("reciterSelect");

  reciterSelect.addEventListener("change", async function () {
    selectSheikh = this.value;
    console.log("الشيخ المختار:", selectSheikh);

    // إعادة جلب الصوتيات للقارئ الجديد
    allSouras = await fetchData(
      `https://api.quran.com/api/v4/chapter_recitations/${selectSheikh}`
    );

    // إعادة عرض البيانات مع القارئ الجديد
    displayData(prayersTimes, quran);
    // تشغيل الصور عند الضغط علي الكارد
    playSoura();
  });
}

// تشغيل السور بعد الضغط علي كل سورة بعد اختيار الشيخ عن طريق عمل عنصر اوديو في ال html و بعد كده استخدام العنصر ده بعد اختياره فانكشن " audioPlayer.play()"
function playSoura() {
  document.querySelectorAll(".verse-card").forEach((card) => {
    card.addEventListener("click", () => {
      const souraSrc = card.getAttribute("data-audio").replace(/['"]/g, ""); // إزالة أي تنصيص بالغلط
      console.log("Playing:", souraSrc);

      // التاكد من ايقاف السورة الاول باستخدام "audioPlayer.pause()"
      if (!audioPlayer.paused) {
        audioPlayer.pause(); // إيقاف التشغيل السابق
        audioPlayer.currentTime = 0; // إعادة التوقيت إلى البداية
      }
      // تعيين مصدر الصوت الجديد
      audioPlayer.src = souraSrc;

      audioPlayer.play().catch((error) => {
        console.error("Audio play error:", error);
      });
    });
  });
}
