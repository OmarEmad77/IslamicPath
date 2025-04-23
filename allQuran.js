prayerTimesUi = document.querySelector("br");
prayerTimesUi.replaceWith("");

let allQuranSour;

const allQuranContainer = document.querySelector(".quran-verses");
document.addEventListener("DOMContentLoaded", async () => {
  allQuranSour = JSON.parse(localStorage.getItem("allQuran"));
  allSouras = JSON.parse(localStorage.getItem("allSour"));
  console.log(allSouras);
  allQuran();
});
allSour = JSON.parse(localStorage.getItem("allSour"));
window.onload = async () => {
  setTimeout(() => {
    playSoura();
    document.body.style.display = "block";
  }, 1500);
};
document.body.style.display = "none";

document
  .getElementById("reciterSelect")
  .addEventListener("change", async function (e) {
    selectSheikh = this.value;
    console.log(selectSheikh);
    // هات الأصوات الجديدة بناءً على القارئ المختار
    // allSouras = await fetchData(
    //   "https://api.quran.com/api/v4/chapter_recitations/" + selectSheikh
    // );
    // localStorage.setItem("selectSheikh", selectSheikh);

    fetchSouraData();
    playSoura();
  });

// جلب الداتا بتاع كل سورة وتغيرها بعد اختيار كل شيخ وعمل مقارنه بين عدد عناصر الاري اللي راجع وعدد الكار واختيار الاصغر وتغير ال سورس لكل كارد
async function fetchSouraData() {
  const verseCards = document.querySelectorAll(".verse-card");

  const count = Math.min(verseCards.length, allSour.length);

  for (let i = 0; i < count; i++) {
    verseCards[i].dataset.audio = allSour[i].audio_url;
  }
}

// عرض الداتا بتاع كل سوره
function allQuran() {
  quranViewTrue = true;
  setTimeout(() => {
    console.log(selectSheikh);

    console.log(allQuranSour);
    allQuranSour.forEach((ele, i) => {
      const souraCard = `
        <div class="verse-card" data-audio = '${allSouras.audio_files[i].audio_url}'>
          <div class="verse-arabic">${ele.name}</div>
          <div class="verse-translation">
            ${ele.englishName}
          </div>
          <div class="verse-reference"> "${ele.revelationType} 
           <span class = 'AyahsNum'>"(${ele.numberOfAyahs} Ayahs)<span/></div>
        </div>
       
      `;

      allQuranContainer.insertAdjacentHTML("beforeend", souraCard);

      allQuranContainer.style.direction = "rtl";
      // allQuranContainer.addEventListener("click", function () {
      //   window.location.href = "soura.html";
      // });
    });
    document
      .querySelectorAll(".AyahsNum")
      .forEach((e) => (e.style.color = "#333333"));
  }, 1000);
}

