let currentSong = new Audio();

async function getSong(){
    const dir = await fetch("http://127.0.0.1:5500/songs/");
    const response = await dir.text();
    const div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs= [];
    for(let i=0; i<as.length; i++){
        let element = as[i];
        if(element.href.endsWith('.mp3')){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

function secondsToMinSec(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    return `${formattedMins}:${formattedSecs}`;
  }
  

playMusic = (track)=>{
    currentSong.src = `/songs/${track}`;
    currentSong.play();
    play.src = 'resources/pause.svg'
    document.querySelector('.song-information').innerHTML = `${track}`;
    document.querySelector('.song-time').innerHTML = "00.00/00.00";
} 

async function main(){


    // get songs and apped them into the playlist.
    let songs = await getSong();
    let songUl = document.querySelector('.song-list').getElementsByTagName('ul')[0];
    for(const song of songs){
        songUl.innerHTML = songUl.innerHTML + `
                                        <li class="flex">
                                            <div class="song-info flex">
                                                <i class="fa-solid fa-headphones"></i>
                                                <div class="song-name">${song.replaceAll("%20", " ")}</div>
                                            </div>
                                            <div class="play-now">
                                                <i class="fa-regular fa-circle-play"></i>
                                            </div>
                                        </li>`
    }
    

    //Select all songs from the list
    Array.from(document.querySelector('.song-list').getElementsByTagName('li')).forEach(function(e){
        e.addEventListener('click', function(){
            playMusic(e.querySelector('.song-name').innerHTML.trim());
            
        })
        console.log(e.querySelector('.song-name').innerHTML);
    })


    //Attach listeners to the previous, next and play buttons
    play.addEventListener('click', ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = 'resources/pause.svg'
        }
        else{
            currentSong.pause();
            play.src = 'resources/play.svg'
        }
    })


    //Listen for time update events
    currentSong.addEventListener('timeupdate', function(){
      document.querySelector('.song-time').innerHTML = `${secondsToMinSec(currentSong.currentTime)}/${secondsToMinSec(currentSong.duration)}`;
    })
}

main();
