const image = document.getElementsByClassName("cover"),
    title = document.getElementsByClassName("title"),
    artist = document.getElementsByClassName("artist"),
    prevButton = document.getElementById("prevButton"),
    nextButton = document.getElementById("nextButton"),
    progress = document.getElementById("progress"),
    ctrlIcon = document.getElementById("ctrlIcon"),
    playButton = document.getElementById("playButton"),
    durationTime = document.getElementsByClassName("durationTime"),
    elapsedTime = document.getElementsByClassName("elapsedTime"),
    menuButton = document.getElementById("menuButton"),
    songList = document.getElementById("songListBox"),
    bottomNav = document.getElementById("bottom-nav"),
    songInfoBox = document.getElementById("songInfoBox");


    const path = require('path');
    const fs = require('fs');

    let songs = [];
    
    function fetchSongData() {
        const songsPath = path.join(__dirname, 'songs.json');
        
        fs.readFile(songsPath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            songs = JSON.parse(data);
            console.log("Songs loaded:", songs);
            
            // Initialize the player with the first song
            if (songs.length > 0) {
                loadMusic(songs[0]);
            }
        });
    }


const music = new Audio();

function formatTime(seconds) {
    if (isNaN(seconds)) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

music.onloadedmetadata = function(){
    progress.max = music.duration;
    progress.value = music.currentTime;
    durationTime.textContent = formatTime(music.duration);
}

let musicIndex = 0;
let isPlaying = false;

function togglePlay(){
    if(isPlaying){
        pauseMusic();
    }
    else{
        playMusic();
    }
}

function playMusic(){
    isPlaying = true;

    ctrlIcon.classList.replace('fa-play', 'fa-pause');
    ctrlIcon.setAttribute('title', 'pause');
    music.play();
}

function pauseMusic(){
    isPlaying = false;

    ctrlIcon.classList.replace('fa-pause', 'fa-play');
    ctrlIcon.setAttribute('title', 'play');
    music.pause();
}

function loadMusic(song) {
    music.src = path.join(__dirname, song.path);
    title[0].textContent = song.displayName;
    title[1].textContent = song.displayName;
    artist[0].textContent = song.artist;
    artist[1].textContent = song.artist;
    image[0].src = path.join(__dirname, song.cover);
    image[1].src = path.join(__dirname, song.cover);
    
    music.currentTime = 0;
    if (isPlaying) music.play();
}

function changeMusic(direction) {
    if (songs.length === 0) return;
    
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

console.log("Script loaded!");
fetchSongData();

playButton.addEventListener('click', togglePlay);
prevButton.addEventListener('click', () => changeMusic(-1));
nextButton.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));

pauseMusic();

let isProgressClicked = false;

progress.addEventListener('mousedown', () => {
    isProgressClicked = true;
});
progress.addEventListener('mouseup', () => {
    isProgressClicked = false;
});
progress.addEventListener('mouseleave', () => {
    isProgressClicked = false;
});

music.addEventListener('timeupdate', function() {
    elapsedTime.textContent = formatTime(music.currentTime);
});

menuButton.addEventListener('click', function() {
    hideSongInfo();
})

bottomNav.addEventListener('click', function() {
    hideSongInfo();
})

function hideSongInfo(){
    if(songInfoBox.classList.contains('hide')){
        songInfoBox.classList.remove('hide');
    }
    else{
        songInfoBox.classList.add('hide');
    }
}

setInterval(() => {
    if (!isProgressClicked) {
        progress.value = music.currentTime;
    }
}, 500);

progress.onchange = function(){
    music.currentTime = progress.value;
    elapsedTime.textContent = formatTime(music.currentTime);
}

const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.querySelector('.volume-control i');

music.volume = volumeSlider.value;

const savedVolume = localStorage.getItem('volume');
if (savedVolume) {
    music.volume = savedVolume;
    volumeSlider.value = savedVolume;
}

volumeSlider.addEventListener('input', function() {
    localStorage.setItem('volume', this.value);
    music.volume = this.value;
    
    if (this.value == 0) {
        volumeIcon.classList.replace('fa-volume-high', 'fa-volume-off');
    } else if (this.value < 0.5) {
        volumeIcon.classList.replace('fa-volume-off', 'fa-volume-low');
        volumeIcon.classList.replace('fa-volume-high', 'fa-volume-low');
    } else {
        volumeIcon.classList.replace('fa-volume-off', 'fa-volume-high');
        volumeIcon.classList.replace('fa-volume-low', 'fa-volume-high');
    }
});

volumeIcon.addEventListener('click', function() {
    if (music.volume > 0) {
        volumeSlider.value = 0;
        music.volume = 0;
        volumeIcon.classList.replace('fa-volume-high', 'fa-volume-off');
        volumeIcon.classList.replace('fa-volume-low', 'fa-volume-off');
    } else {
        volumeSlider.value = 1;
        music.volume = 1;
        volumeIcon.classList.replace('fa-volume-off', 'fa-volume-high');
    }
});