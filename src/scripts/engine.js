const State = {
  score: {
    playerScore: 0,
    computeScore: 0,
    scoreBoxView: document.getElementById("score_points"),
  },
  cardSprites: {
    avatarView: document.getElementById("card-image"),
    nameView: document.getElementById("card-name"),
    typeView: document.getElementById("card-type"),
  },
  fieldCards: {
    playerView: document.getElementById("player-cards"),
    computeView: document.getElementById("compute-cards"),
  },
  vesusFields: {
    playerView: document.getElementById("player-field-card"),
    computeView: document.getElementById("computer-field-card"),
  },
  buttonView: document.getElementById("next-duel"),
};

const pathImages = "src/assets/icons";

const cardType = {
  Paper: "Paper",
  Rock: "Rock",
  Scissors: "Scissor",
};

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: cardType.Paper,
    img: `${pathImages}/dragon.png`,
    winOf: cardType.Rock,
    loseOf: cardType.Scissors,
  },
  {
    id: 1,
    name: "Dark Magician",
    type: cardType.Rock,
    img: `${pathImages}/magician.png`,
    winOf: cardType.Scissors,
    loseOf: cardType.Paper,
  },
  {
    id: 2,
    name: "Exodia",
    type: cardType.Scissors,
    img: `${pathImages}/exodia.png`,
    winOf: cardType.Paper,
    loseOf: cardType.Rock,
  },
];

async function playAudio(status){
  const audio = new Audio(`src/assets/audios/${status}.wav`);
  audio.volume = 0.5
  audio.play();
}

const playerSides = {
  player1: "playerView",
  compute: "computeView",
};

function checkCardWin(carda, cardb) {
  if (carda.type == cardb.type) return false;
  return carda.type === cardb.loseOf ? carda : cardb;
}

function drawSelectedCard(id) {
  State.cardSprites.avatarView.src = cardData[id].img;
  State.cardSprites.nameView.innerText = cardData[id].name;
  State.cardSprites.typeView.innerText = `Attribute: ${cardData[id].type}`;
}

async function getRandomCardId() {
  return cardData[Math.floor(Math.random() * cardData.length)].id;
}

async function removeAllCardsImages() {
  let cards = document.querySelectorAll(".card-box.framed")
  cards.forEach(box => box.innerHTML = "")

}

function drawButton(text) {
  State.buttonView.style.display = 'block'
  State.buttonView.innerText = text
}

async function setCardsField(id) {
  await removeAllCardsImages();
  let computerCardId = await getRandomCardId();
  State.vesusFields.playerView.style.display = "block";
  State.vesusFields.computeView.style.display = "block";
  const cardPlayer = cardData[id];
  const cardComputer = cardData[computerCardId];
  State.vesusFields.computeView.src = cardComputer.img;
  State.vesusFields.playerView.src = cardPlayer.img;
  const winCard = checkCardWin(cardPlayer, cardComputer);
  if (winCard) {
    if (winCard === cardPlayer) {
      State.score.playerScore++;
      drawButton("GANHOU")
      playAudio('win')
    } else {
      State.score.computeScore++;      
      drawButton("PERDEU")
      playAudio('lose')
    }
  } else {    
    drawButton("EMPATE")
  }
  State.score.scoreBoxView.innerText = `Win: ${State.score.playerScore} | Lose: ${State.score.computeScore}`;
  
}

async function createCardImage(id, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", `${pathImages}/card-back.png`);
  cardImage.setAttribute("data-id", `${fieldSide}-${id}`);
  cardImage.classList.add("card");
  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("click", () => {
      setCardsField(id);
    });

    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(id);
    });
  }

  return cardImage;
}

async function drawCards(cardNumber, fieldSide) {
  for (let i = 0; i < cardNumber; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);
    State.fieldCards[fieldSide].appendChild(cardImage);
  }
}

// function playBGsound(){
//   const bgm = document.getElementById("bgm")
//   bgm.volume = 0.2
//   bgm.muted = false
//   bgm.play()
// }

function init() {
  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.compute);
  // document.getElementById("")
}

function resetDuel( ) {  
  State.vesusFields.computeView.style.display = "none"
  State.vesusFields.playerView.style.display = "none"
  State.buttonView.style.display = 'none'
  init()
}

resetDuel( )
