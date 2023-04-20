const inputEl = document.querySelector(".word-input");
const inputSectionEl = document.querySelector(".input-section");
const searchImg = document.querySelector(".search-icon");
const errMsgEl = document.querySelector(".no-input");

const spinner = document.querySelector('.spinner');
spinner.style.display = "none";




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
  try {
    if(inputEl.value.trim() === ''){
      throw "no input";
    }else{
      errMsgEl.classList.remove('show-msg');
      inputEl.classList.remove('input-error');
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



getWordDef = async (word) => {
    try {
      document.querySelector('.spinner').style.display = "block";
      let res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      if(res.status == '404'){
        throw "404";
      }

      let data = await res.json();

      document.querySelector('.spinner').style.display = "none";
      injectWordDefinitionUI(data);
      

     
      


      
    } catch (error) {
      spinner.style.display = "none";
      if(error == 404){
        injectErrorUI();
      }




    }

    spinner.style.display = "none";
};


injectErrorUI = () => {
  const existingWordSection = document.querySelectorAll(
    ".word-section, .audio-box, .noun-meaning-section, .source-section"
  );
  if (existingWordSection.length > 1) {
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
  

  let dictionaryBodyUI =  ` <section class="wrapper word-section">
    <div class="word-transcript__container">
      <h1 class="word">${data[0].word}</h1>
      <span class="transcript">${getPhoneticsText(data)}</span>
    </div>

    <div class="audio-box">
      <svg class="audio__img" xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g fill="#A445ED" fill-rule="evenodd"><circle cx="37.5" cy="37.5" r="37.5" opacity=".25"/><path d="M29 27v21l21-10.5z"/></g></svg>
      <audio class="word__audio">
        <source src=${getPhoneticsAudio(data)}>
      </audio>
    </div>
  </section>


${( data => posDefinitionMaker(data) === " "? " " : posDefinitionMaker(data).map(data => `<section class="wrapper noun-meaning-section">
  <div class="ruler__container">
    <h2 class="noun-verb__heading noun__heading">${data.pos}</h2>
    <hr/>
  </div>
  
  <div class="meaning__container">
    <p class="meaning__title">Meaning</p>
    <ul class="meaning-list noun-meaning__list">
      ${data.definintionList}
    </ul>
  </div>
  
  <div class="synonyms">
    <p class="synonyms__title">synonyms</p>
    <p class="synonyms__words">
      ${data.synonymList === "" ? "": data.synonymList}
    </p>
  </div>
  </section>`).join(""))(data)}





  <section class="wrapper source-section">
    <p class="source__title">source</p>
    <div class="source__link">
      <a href=${data[0].sourceUrls[0]}>
        <p class="source">${data[0].sourceUrls[0]}</p>
      </a>
      
      <a href=${data[0].sourceUrls[0]}>
        <img src="assets/images/icon-new-window.svg" alt="">
      </a>
    
    </div>
  </section>`;

  inputSectionEl.insertAdjacentHTML("afterend", dictionaryBodyUI);

  wordAudio();
};







posDefinitionMaker = (data) => {
  let posDefinitionList = [];


for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < data[i].meanings.length; j++) {
    if(data[i].meanings[j].partOfSpeech.length > 0){
      let partOfSpeechValue = data[i].meanings[j].partOfSpeech;
    
      let definition = definitionsHelper(data[i].meanings[j].definitions);
      let synonym = synonymHelper(data[i].meanings[j].synonyms);
     posDefinitionList.push({pos: partOfSpeechValue, synonymList:synonym, definintionList: definition})
     
    } else {
      continue;
    }
  }
}
return posDefinitionList;
}




function definitionsHelper(definitionsList){
  let result = "";
  definitionsList.forEach(definition => {
    result += `<li class="meaning__item verb-meaning__item">${
      definition.definition
    }<br><span class="definition-example">${definition.example ? definition.example : ""}</span></li>`;
  });

  return result;

}


// DONE
function synonymHelper(synonymsList){
  let result = "";
  if(synonymsList && synonymsList.length) {
    synonymsList.forEach(synonym => {
      if(synonym.length > 0){
        result += synonym + " ";
      }
    });
  }

  return result.trim();
}

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
