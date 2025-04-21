prayerTimesUi = document.querySelector("br");
prayerTimesUi.replaceWith("");

window.onload = () => {
  setTimeout(() => {
    document.body.style.display = "block";
  }, 500);
};
document.body.style.display = "none";
const allQuranContainer = document.querySelector(".quran-verses");

const allQuran = () => {
  quranViewTrue = true;
  setTimeout(() => {
    console.log(quran.data);
    quran.data.forEach((ele, i) => {
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
    document.querySelectorAll(".verse-card").forEach((card) => {
      card.addEventListener("click", () => {
        console.log("play");

        const souraSrc = card.getAttribute("data-audio");
        audioPlayer.src = souraSrc;
        const audioPromise = audioPlayer.play();
      console.log(audioPromise);

      if (audioPromise !== undefined) {
        audioPromise
          .then((_) => {})
          .catch((error) => {
            // Auto-play was prevented
            // Show paused UI.
            console.error(error);
          });
      }
      });
    });
  }, 1000);
};
allQuran();
