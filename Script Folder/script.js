let currentSong = new Audio();
let songs;
let currentFolder;

async function getSong(folder){
    currentFolder = folder;
    const dir = await fetch(`/${folder}/`);
    const response = await dir.text();
    const div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs= [];
    for(let i=0; i<as.length; i++){
        let element = as[i];
        if(element.href.endsWith('.mp3')){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUl = document.querySelector('.song-list').getElementsByTagName('ul')[0];
    songUl.innerHTML = ""
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

    return songs
}

function secondsToMinSec(seconds) {
if(isNaN(seconds) || seconds < 0){
    return "00:00";
}

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    return `${formattedMins}:${formattedSecs}`;
  }
  

playMusic = (track, pause=false)=>{
    currentSong.src = `/${currentFolder}/${track}`;
    if(!pause){
        currentSong.play();
        play.src = 'resources/pause.svg'
    }
    document.querySelector('.song-information').innerHTML = decodeURI(track)
    document.querySelector('.song-time').innerHTML = "00.00 / 00.00";
} 


async function displayAlbums(){
    const a = await fetch(`/songs/`);
    const response = await a.text();
    const div = document.createElement('div');
    div.innerHTML = response;  
    let anchor = div.getElementsByTagName('a')
    let array = Array.from(anchor)
    for(let i=0; i<array.length; i++){
        let e = array[i];
        if(array[i].href.includes('/songs/')){
            let folderName = array[i].href.split('/').slice(-2)[1];
            const b = await fetch(`/songs/${folderName}/info.json`);
            const response = await b.json();
            document.querySelector('.card-container').innerHTML = document.querySelector('.card-container').innerHTML + `
            <div data-folder="${folderName}" class="card flex">
                <div class="play"><i class="fa-solid fa-play black-play"></i></div>
                <img src="songs/${folderName}/cover.jpg">
                <h3>${response.title}</h3>
                <p>${response.description}</p>
            </div>
            `
        }
    }

    //Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName('card')).forEach(function(e){
        e.addEventListener('click', async function(item){
            console.log(item.currentTarget)
            songs = await getSong(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
    
}


async function main(){

    // get songs and apped them into the playlist.
    await getSong("songs/folder1");
    playMusic(songs[0], true)


    //Display all the albums on the page
    displayAlbums();


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
      document.querySelector('.seek-circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
      console.log(currentSong.duration, currentSong.currentTime)
    })


    //Listen on seek bar click
    document.querySelector('.seekbar').addEventListener('click', function(e){
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.seek-circle').style.left = percent + "%";
        currentSong.currentTime = (percent *  currentSong.duration) / 100;
    })

    //Add listener to hamburger menu
    document.querySelector('.hamburger-icon').addEventListener('click', ()=>{
        document.querySelector('.left').style.left = 0;
    })  

    //Add listener to close icon  
    document.querySelector('.close-icon').addEventListener('click', ()=>{
        document.querySelector('.left').style.left = '-200%';
    })  

    //Add listener to previous button
    previous.addEventListener('click', ()=>{
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        if((index-1) >= 0){
            playMusic(songs[index-1]);
        }
    })

    //Add listener to next button
    next.addEventListener('click', ()=>{
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        if((index+1)  < songs.length){
            playMusic(songs[index+1]);
        }
    })

    //Add Listener to volume slider
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e)=>{
        currentSong.volume = parseInt(e.target.value)/100;
    })

   //Add listener to mute 
   document.querySelector('.volume').addEventListener('click', function(e){
        if(e.target.src.split('resources/')[1] == 'volume.svg'){
            e.target.src.split('resources/')[1] = 'mute.svg';
            e.target.src = "resources/mute.svg"
            currentSong.volume = 0;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 0;
        }
        else{
            e.target.src = "resources/volume.svg"
            currentSong.volume = 0.10;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 10;
        }
       
   })

}

main();
