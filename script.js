let currentSong = new Audio();
let songs;

function formatTime(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  seconds = Math.round(seconds);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(
        as[i].href.split(`/songs/`)[1].split(".mp3")[0].replaceAll("%20", " ")
      );
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/songs/${track}.mp3`; 
  if (!pause) {
    currentSong.play().catch((error) => console.error("Audio play error:", error));
    document.querySelector("#play").src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
  songs = await getSongs();
  playMusic(songs[0],true)

  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML +
      `<li>
            <img class="invert" src="music.svg" alt="" />
            <div class="info">
                <div>${song}</div>
                <div class="artist" >Amish</div>
            </div>
            <img class="invert playpause" src="play.svg" alt="" />
        </li>`;
  }

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click" , element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  })


  play.addEventListener("click" , ()=>{
    if(currentSong.paused){
      currentSong.play()
      play.src = "pause.svg"
    }
    else{
      currentSong.pause()
      play.src = "play.svg"
    }
  })

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%" //left is used to process an element horizontally
  });

  document.querySelector(".seekbar").addEventListener("click" , e =>{
    let percent = e.offsetX/e.target.getBoundingClientRect().width*100
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = ((currentSong.duration)*percent)/100
  }) 

  document.querySelector(".hamburger").addEventListener("click" , ()=>{
    document.querySelector(".left").style.left = "0"
  })

  document.querySelector(".cross").addEventListener("click" , ()=>{
    document.querySelector(".left").style.left = "-120%"
  })

  previous.addEventListener("click",()=>{
    let index = songs.indexOf(currentSong.src.split("/songs/")[1].split(".mp3")[0].replaceAll("%20", " "))
    if(index-1 >= 0){
      playMusic(songs[index-1])
    }
  })

  next.addEventListener("click",()=>{
    let index = songs.indexOf(currentSong.src.split("/songs/")[1].split(".mp3")[0].replaceAll("%20", " "))
    if(index+1 < songs.length){
      playMusic(songs[index+1])
    }
  })

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    currentSong.volume = parseInt(e.target.value)/100
  })

}

main();