// Initialize Howler.js audio players for each file
var sounds = [
    new Howl({
        src: ['mp3/ipm1.mp3'],
        onplay: function() { handlePlay(); updateCurrentSeekPoint(); },
        onseek: updateCurrentSeekPoint,
        onend: playNextFile
    }),
    new Howl({
      src: ['mp3/ipm2.mp3'],
      onplay: function() { handlePlay(); updateCurrentSeekPoint(); },
      onseek: updateCurrentSeekPoint,
      onend: playNextFile
    })    // Add more Howl instances for additional files as needed
  ];
  
  let currentFileIndex = 0;
  let currentSound = sounds[currentFileIndex];
  
  // Play/pause button functionality
  const playPauseButton = document.getElementById('play-pause');
  playPauseButton.addEventListener('click', function() {
    if (currentSound.playing()) {
      currentSound.pause();
      playPauseButton.textContent = 'Play';
    } else {
      currentSound.play();
        playPauseButton.textContent = 'Pause';
    }
  });
  
  // Seek buttons functionality
  const seekPoints = document.querySelectorAll('.seek-point');
  seekPoints.forEach(function(point) {
    point.addEventListener('click', function(e) {
      e.preventDefault();
      const fileIndex = parseInt(point.getAttribute('data-file'));
      const seekTime = parseFloat(point.getAttribute('data-seek'));
  
      if (currentFileIndex !== fileIndex) {
        currentSound.stop();
        currentFileIndex = fileIndex;
        currentSound = sounds[currentFileIndex];
      }
      
      currentSound.seek(seekTime);
      currentSound.play();
    });
  });


  // Function that I am writing to update the status times. 
  function updateStatusTimes() {
    const statusTimes = document.querySelectorAll('.time_right');
    const durationTime = currentSound.duration();
    const currentTime = currentSound.seek();
  
    statusTimes.forEach(function(element, index) {
      if (index === currentFileIndex) {
        element.innerHTML = Math.floor(currentTime / 60) + " of " + Math.floor(durationTime / 60) + " minutes";
      } else {
        const fileDurationTime = sounds[index].duration();
        element.innerHTML = Math.floor(fileDurationTime / 60) + " minutes";
      }
    });
  }
  
    
  // Function to update the "current" class based on the current seek point
  function updateCurrentSeekPoint() {
    const currentTime = currentSound.seek();
    seekPoints.forEach(function(point) {
      const fileIndex = parseInt(point.getAttribute('data-file'));
      const seekTime = parseFloat(point.getAttribute('data-seek'));


      if (fileIndex === currentFileIndex && currentTime >= (seekTime + .001)) {
        point.classList.add('current');

      } else if (fileIndex < currentFileIndex) {
        point.classList.add('current');
      } else {
        point.classList.remove('current');
      }
    });
  }
  
  // Function to play the next file when the current file ends
  function playNextFile() {
    currentSound.stop();
    currentFileIndex = (currentFileIndex + 1) % sounds.length;
    currentSound = sounds[currentFileIndex];
    currentSound.play();
  }
  
// Function to handle play events, wait 2 seconds, and then scroll
const SCROLL_FACTOR = 442; // Factor to multiply with file index to get scroll position

function handlePlay() {
  // setTimeout(() => {
  //   const scrollPosition = currentFileIndex * SCROLL_FACTOR + 652;
  //   window.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  // }, 10000); // Wait 10 seconds before scrolling
}

  // Continuously update the seek points
  setInterval(updateCurrentSeekPoint, 500);
  setInterval(handlePlay, 30000);
  setInterval(updateStatusTimes, 1000);