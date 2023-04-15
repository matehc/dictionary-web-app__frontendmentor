const inputEl = document.querySelector(".word-input");
const inputSectionEl = document.querySelector(".input-section");
const searchImg = document.querySelector(".search-icon");
const errMsgEl = document.querySelector(".no-input");



inputEl.addEventListener("keypress", (e) => {
 
  try {
    if (e.key === 'Enter' && inputEl.value.trim() === '') {
      e.preventDefault();
      throw "no input";
    }else if(e.key === 'Enter'){
      e.preventDefault();
      errMsgEl.classList.remove('show-msg');
      inputEl.classList.remove('input-error')
      let inputValue = inputEl.value;
      inputEl.value = "";
      getWordDef(inputValue);
    }
  } catch (error) {
    if(error === "no input"){
      errMsgEl.classList.add('show-msg');
      inputEl.classList.add('input-error')
    }
  }
});


searchImg.addEventListener("click", ()=> {
  let inputValue = inputEl.value;
  inputEl.value = "";
  getWordDef(inputValue);
});




removeSection = () => {};

getWordDef = async (word) => {

    try {
      let res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      let data = await res.json();

      if(res.status === 404){
        throw "404";
      }

      injectWordDefinitionUI(data);
      
    } catch (error) {
      // console.log(error.status); 
      // if(error instanceof TypeError && error.message === "Failed to fetch"){
      //   console.log('network error')
      //   injectErrorUI();
      // } else if (res && res.status === 404) {
      //   console.log('word not found')
      //   injectErrorUI();
      // }

      if(error == 404){
        injectErrorUI();
      }
    }
};


injectErrorUI = () => {
  const existingWordSection = document.querySelectorAll(
    ".word-section, .audio-box, .noun-meaning-section, .source-section"
  );
  if (existingWordSection) {
    existingWordSection.forEach((el) => {
      el.remove();
    });
  }
 let errorUI = ` <section class="wrapper not-found-section">
  <p class="emoji">😕</p>

  <p class="not-found__msg">No Definitions Found</p>
  <p class="not-found__info">Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>
 </section>`

 inputSectionEl.insertAdjacentHTML("afterend",errorUI );
}

injectWordDefinitionUI = (data) => {
  const existingWordSection = document.querySelectorAll(
    ".word-section, .audio-box, .noun-meaning-section, .source-section"
  );
  if (existingWordSection) {
    existingWordSection.forEach((el) => {
      el.remove();
    });
  }
  let dictionaryBodyUI = ` <section class="wrapper word-section">
    <div class="word-transcript__container">
      <h1 class="word">${data[0].word}</h1>
      <span class="transcript">${getPhoneticsText(data)}</span>
    </div>

    <div class="audio-box">
      <img class="audio__img" src="/assets/images/icon-play.svg" alt="">
      <audio class="word__audio">
        <source src=${getPhoneticsAudio(data)}>
      </audio>
    </div>
  </section>


${( data => nounDefinitionCreator(data) === " "? " " : `<section class="wrapper noun-meaning-section">
<div class="ruler__container">
  <h2 class="noun-verb__heading noun__heading">noun</h2>
  <hr/>
</div>

<div class="meaning__container">
  <p class="meaning__title">Meaning</p>
  <ul class="meaning-list noun-meaning__list">
    ${nounDefinitionCreator(data)}
  </ul>
</div>

<div class="synonyms">
  <p class="synonyms__title">synonyms</p>
  <p class="synonyms__words">
    ${getSynonyms(data)}
  </p>
</div>
</section>`)(data)}


  


${(data => 
  verbDefinitionCreator(data) === " " ? " ": ` <section class="wrapper noun-meaning-section">
  <div class="ruler__container">
    <h2 class="noun-verb__heading verb__heading">verb</h2>
    <hr/>
  </div>

  <div class="meaning__container">
    <p class="meaning__title">Meaning</p>
    <ul class="meaning-list verb-meaning__list">
      ${verbDefinitionCreator(data)}
    </ul>
  </div>
</section>
  `)(data)}

 


  <section class="wrapper source-section">
    <p class="source__title">source</p>
    <div class="source__link">
      <a href=${data[0].sourceUrls[0]}>
        <p class="source">${data[0].sourceUrls[0]}</p>
      </a>
      
      <a href=${data[0].sourceUrls[0]}>
        <img src="/assets/images/icon-new-window.svg" alt="">
      </a>
    
    </div>
  </section>`;

  inputSectionEl.insertAdjacentHTML("afterend", dictionaryBodyUI);

  wordAudio();
};

nounDefinitionCreator = (data) => {
  let nounList = "";

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].meanings.length; j++) {
      if (data[i].meanings[j].partOfSpeech !== "noun") continue;
      console.log("meanings, ", data[i].meanings[j]);
      nounList = data[i].meanings[j].definitions
        .map((nounDefinition) => {
          return `<li class="meaning__item verb-meaning__item">${
            nounDefinition.definition
          }<br><span class="definition-example">${nounDefinition.example ? nounDefinition.example : ""}</span></li>`;
        })
        .join("");

    }
  }

  return nounList.length > 0 ? nounList : " ";
};

/**
 * The verbDefinitionCreator loops throught the
 *
 *
 */
// DONE
verbDefinitionCreator = (data) => {
  let verbList = "";

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].meanings.length; j++) {
      if (data[i].meanings[j].partOfSpeech !== "verb") continue;
      console.log("meanings, ", data[i].meanings[j]);
      verbList = data[i].meanings[j].definitions
        .map((verbDefinition) => {
          return `<li class="meaning__item verb-meaning__item">${
            verbDefinition.definition
          }<br><span class="definition-example">${verbDefinition.example ? verbDefinition.example : ""}</span></li>`;
        })
        .join("");
    }
  }

  return verbList.length > 0 ? verbList : " ";
};

// DONE
getPhoneticsAudio = (data) => {
  let audioExtension = ".mp3";

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].phonetics.length; j++) {
      if (data[i].phonetics[j].audio === "") {
        continue;
      } else if (
        data[i].phonetics[j].audio.substring(
          data[i].phonetics[j].audio.length - audioExtension.length
        ) === audioExtension
      ) {
        return data[i].phonetics[j].audio;
      } else {
        return "";
      }
    }
  }
};

// DONE
getPhoneticsText = (data) => {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].phonetics.length; j++) {
      let phonetic = data[i].phonetics[j];
      if (phonetic.text) {
        if (phonetic.text.length > 0) {
          return phonetic.text;
        } else {
          return "";
        }
      }
      continue;
    }
  }
};

// DONE
getSynonyms = (data) => {
  let synonymsString = "";
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].meanings.length; j++) {
      let synonyms = data[i].meanings[j].synonyms;

      if (synonyms && synonyms.length > 0) {
        synonymsString += synonyms.map((synonym) => synonym + " ").join("");
      }
    }
  }
  return synonymsString;
};