const wordAudio = () => {
  const audioBoxEl = document.querySelector(".audio-box");
  const wordAudioEl = document.querySelector(".word__audio source");
  const wordSection = document.querySelector(".word-section");

  console.log("word audio", wordAudioEl.src);
  console.log("audiobox element", audioBoxEl);
  audioBoxEl.addEventListener("click", () => {
    // your code

    let audio = new Audio(wordAudioEl.src);
    audio.play();
  });
};
