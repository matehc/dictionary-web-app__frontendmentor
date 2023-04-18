const wordAudio = () => {
  const audioBoxEl = document.querySelector(".audio-box");
  const wordAudioEl = document.querySelector(".word__audio source");


  audioBoxEl.addEventListener("click", () => {
    let audio = new Audio(wordAudioEl.src);
    audio.play();
  });
};
