const image = document.getElementById("cover"),
    title = document.getElementById("title"),
    artist = document.getElementById("artist"),
    prevButton = document.getElementById("prevButton"),
    nextButton = document.getElementById("nextButton"),
    progress = document.getElementById("progress"),
    ctrlIcon = document.getElementById("ctrlIcon"),
    playButton = document.getElementById("playButton"),
    durationTime = document.getElementById("durationTime"),
    elapsedTime = document.getElementById("elapsedTime");

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

const songs = [
    {
        path: "assets/C4CHello.mp3",
        displayName: 'Hello (feat. kokoro)',
        cover: 'assets/C4CHello.jpg',
        artist: 'C4C',
    },
    {
        path: "assets/ptrLittleThings.mp3",
        displayName: 'Little Things',
        cover: 'assets/ptrLittleThings.jpg',
        artist: 'Ptr.',
    },
    {
        path: "assets/deebuKinou.mp3",
        displayName: 'Kinou',
        cover: 'assets/deebuKinou.jpg',
        artist: 'Deebu',
    },
    {
        path: "assets/sharou223.mp3",
        displayName: '2:23 AM',
        cover: 'assets/sharou223.jpg',
        artist: 'しゃろう',
    },
    {
        path: "assets/sharou303.mp3",
        displayName: '3:03 PM',
        cover: 'assets/sharou303.jpg',
        artist: 'しゃろう',
    },
    {
        path: "assets/reoNeonIroNoMachi.mp3",
        displayName: 'ネオン色のまち',
        cover: 'assets/reoNeonIroNoMachi.jpg',
        artist: 'Reo',
    }
];

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

function loadMusic(song){
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
}

function changeMusic(direction){
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

playButton.addEventListener('click', togglePlay);
prevButton.addEventListener('click', () => changeMusic(-1));
nextButton.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));

loadMusic(songs[musicIndex]);
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

// Set initial volume
music.volume = volumeSlider.value;

const savedVolume = localStorage.getItem('volume');
if (savedVolume) {
    music.volume = savedVolume;
    volumeSlider.value = savedVolume;
}

// Update volume when slider changes
volumeSlider.addEventListener('input', function() {
    localStorage.setItem('volume', this.value);
    music.volume = this.value;
    
    // Update volume icon based on volume level
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

// Toggle mute when clicking the icon
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