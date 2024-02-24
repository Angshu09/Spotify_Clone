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

async function main(){
    let songs = await getSong();

    let songUl = document.querySelector('.song-list').getElementsByTagName('ul')[0];
    console.log(songUl);
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
    
    let audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener('loadeddata', function(){
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
    })
}

main();
