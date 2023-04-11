
let inputEl= document.querySelector('.word-input');
let inputSectionEl = document.querySelector('.input-section');


inputEl.addEventListener('keypress', (e)=> {
    if(e.key === "Enter"){
        console.log("input value", inputEl.value);
        e.preventDefault();
        let inputValue = inputEl.value;
        inputEl.value = '';
        getWordDef(inputValue);
    }

})




getWordDef = (word)=> {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => res.json())
    .then(data => {
        injectWordDefinitionUI(data)
    })
    .catch(err => console.log("ERROR",err))
}

injectWordDefinitionUI = (data) => {
    let dictionaryBodyUI = ` <section class="wrapper word-section">
    <div class="word-transcript__container">
      <h1 class="word">${data[0].word}</h1>
      <span class="transcript">${getPhoneticsText(data)}</span>
    </div>

    <div class="audio-box">
      <img src="/assets/images/icon-play.svg" alt="">
      <audio class="word__audio">
        <source src=${getPhoneticsAudio(data)}>
      </audio>
    </div>
  </section>


  <section class="wrapper noun-meaning-section">
    <div class="ruler__container">
      <h2 class="noun-verb__heading noun__heading">noun</h2>
      <hr/>
    </div>

    <div class="meaning__container">
      <p class="meaning__title">Meaning</p>
      <ul class="meaning-list noun-meaning__list">
        ${nounDefinitionListCreator(data)}
      </ul>
    </div>

    <div class="synonyms">
      <p class="synonyms__title">synonyms</p>
      <p class="synonyms__words">
        ${getSynonyms(data)}
      </p>
    </div>
  </section>




  <section class="wrapper noun-meaning-section">
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

  inputSectionEl.insertAdjacentHTML('afterend', dictionaryBodyUI);
    
}

nounDefinitionListCreator = (data) => {
    let meaningNode;
    // let nounDefinitionList;
    for (i = 0; i <  data[0].meanings.length; i++){
        meaningNode = data[0].meanings;
        if(meaningNode[i].partOfSpeech === 'noun') {
            return meaningNode[i].definitions.map(definitonNode => {
                // console.log("noun definition",definitonNode.definition)
                return `<li class="meaning__item noun-meaning__item">${definitonNode.definition}</li>`;
            }).join("");
        }
    }

    // return nounDefinitionList;
}



/**
 * The verbDefinitionCreator loops throught the 
 * 
 * 
 */
// DONE
verbDefinitionCreator = (data) => {
  let verbList = "";

  
  for (let i = 0; i < data.length; i++) {
    //  this is established that data[i] is the loop for individual objects in parent array. can be 1, 2, 3, or more
    // console.log("first console",data[i]);
  
    for(let j = 0; j < data[i].meanings.length; j++){
      if (data[i].meanings[j].partOfSpeech !== "verb") continue
      console.log("meanings, ", data[i].meanings[j]);
      verbList = data[i].meanings[j].definitions.map(verbDefinition => {
        // console.log("verb definition", verbDefinition)
        return `<li class="meaning__item verb-meaning__item">${verbDefinition.definition}<br>${verbDefinition.example}</li>`;
    }).join("");

    }
  }

  return verbList.length > 0 ? verbList : " ";
}


// DONE
getPhoneticsAudio = (data) => {
  let audioExtension = ".mp3"

  for (let i = 0; i < data.length; i++){

    for(let j = 0; j < data[i].phonetics.length; j++){
      if(data[i].phonetics[j].audio === "") {
        continue
      } else if(data[i].phonetics[j].audio.substring(data[i].phonetics[j].audio.length - audioExtension.length) === audioExtension) {
        return data[i].phonetics[j].audio;
      } else {
        return ""
      }
    }
  }



}


// DONE
getPhoneticsText = (data) => {

  for (let i = 0; i < data.length; i++) {

    // check to see if data[i].phonotic.length > 0 ? return it : continue
    data[i].phonetic.length > 0 ? data[i].phonetic.text : "";

    for(let j = 0; j < data[i].phonetics.length; j++){
      let phonetic = data[i].phonetics[j];
      if(phonetic.text.length > 0 ) {
        return phonetic.text;
      } else {
        return ""
      }
    }
  }
}



// DONE
getSynonyms = (data) => {
    let synonymsString = '';
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].meanings.length; j++) {
        let synonyms = data[i].meanings[j].synonyms;
    
        if (synonyms && synonyms.length > 0) {
          synonymsString += synonyms.map(synonym => synonym + ' ').join('');
        }
      }
    }
  return synonymsString;
}


