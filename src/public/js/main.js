// "use strict";
// ********************DOM SELECTORS****************************
var timer = document.querySelector('.stop-watch__timer');
var toggleBtn = document.querySelector('.stop-watch__toggle');
var resetBtn = document.querySelector('.stop-watch__reset');
var useBtn = document.querySelector('.stop-watch__use');
var displayTime = document.querySelector('.stop-watch__timer');
var finalizeBtn = document.querySelector('.test__finalize');
var transcript = document.querySelector('.patient-transcript');
var hidden = document.querySelector('.hidden');
var hidden2 = document.querySelector('.hidden2');
var firstName = document.querySelector('#first-name');
var lastName = document.querySelector('#last-name');
var DOB = document.querySelector('#DOB');
var copyText = document.querySelector('.patient-transcript');
var stopWatchTestsSection = document.getElementsByClassName('stop-watch-tests');




//********* Stop-watch timer functionality START ***********
var watch = new Stopwatch(timer);

function start() {
  toggleBtn.textContent = 'Stop';
  watch.start();
}

function stop() {
  toggleBtn.textContent = 'Start';
  watch.stop();
}

var birthday = new Date(DOB.value);

function calculateAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

toggleBtn.addEventListener('click', function () {
  watch.isOn ? stop() : start();
});

resetBtn.addEventListener('click', function () {
  watch.reset();
});

useBtn.addEventListener('click', function () {
  watch.use();
});


// calculated Speed
var speedType = ' normal comfortable speed trial';
var calculatedSpeed = '76.36';

// normal comfortable speed trial
// maximum speed trial

finalizeBtn.addEventListener('click', function (event) {
  hidden.style.display = 'block';
  hidden2.style.display = 'block';

  transcript.innerHTML = `During ${speedType} Patient ${firstName} ${lastName}, age: ${calculateAge(birthday)} performed at a ${calculatedSpeed} speed`;
  event.preventDefault();

  sendData();
});

function Stopwatch(elem) {
  var time = 0;
  var offset;
  var interval;
  this.counter = 0;

  function update() {
    if (this.isOn) {
      time += delta();
    }

    elem.textContent = timeFormatter(time);
  }

  function delta() {
    var now = Date.now();
    var timePassed = now - offset;
    offset = now;
    return timePassed;
  }

  function timeFormatter(time) {
    time = new Date(time);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString();
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }
    while (milliseconds.length < 3) {
      milliseconds = '0' + milliseconds;
    }
    return minutes + ' : ' + seconds + ' . ' + milliseconds;
  }
  this.start = function () {
    interval = setInterval(update.bind(this), 10);
    offset = Date.now();
    this.isOn = true;
  };

  this.use = function () {
    if (this.counter > 2) {
      stopWatchTestsSection[0].insertAdjacentHTML('beforeend', `<div>ONLY 3 tests are allowed</div>`);
      return;
    } else if (this.counter === 2) {
      this.stop();
    }
    this.counter++;
    // Appending the DOM element
    stopWatchTestsSection[0].insertAdjacentHTML('beforeend', `<div>Test #${this.counter}: <span class="tests--first">${timeFormatter(time)}</span></div>`);
  };

  this.stop = function () {
    clearInterval(interval);
    interval = null;
    this.isOn = false;
  };

  this.reset = function () {
    time = 0;
    // Resting the counter to 0 on reset
    this.counter = 0;
    // removing the test results from DOM
    stopWatchTestsSection[0].innerHTML = '';
    update();
  };
  this.isOn = false;
}
//********* Stop-watch timer functionality END ***********




//********* Copy to Clipboard START ***********
function copy() {
  var copyText = document.querySelector(".patient-transcript");
  copyText.select();
  document.execCommand("copy");
}
document.querySelector(".copy").addEventListener("click", copy);
//********* Copy to Clipboard END ***********




function sendData() {
  var XHR = new XMLHttpRequest();

  // Bind the FormData object and the form element
  var form = document.querySelector('form');
  var FD = new FormData(form);

  // Define what happens on successful data submission
  XHR.addEventListener("load", function (event) {
    console.log(event.target.responseText);
  });

  // Define what happens in case of error
  XHR.addEventListener("error", function (event) {
    console.log('Oops! Something went wrong.');
  });

  // Set up our request
  XHR.open("POST", "/");

  // The data sent is what the user provided in the form
  XHR.send(FD);
}



//********** iPhone style sliding button START ***********
function classToggle(elem, className) {
  var arrClass = elem.className.split(' ');
  for (item in arrClass) {
    if (arrClass[item] === className) {
      arrClass.splice(item);
      elem.className = arrClass.join(' ');
      return;
    }
  }
  arrClass.push(className);
  elem.className = arrClass.join(' ');
}
var slideBg = document.getElementById('idSlideBg');
var slideBtn = document.getElementById('idSlideBtn');

function sliderOnClick() {
  slideBtn.classList.toggle('Slider__Btn-active');
  slideBg.style.background = slideBtn.classList.contains('Slider__Btn-active') ? '#36D1DC' : 'rgba(247, 102, 45, 0.76)';
}

function sliderBgOnClick() {
  classToggle(slideBg, 'Slider__Bg-active');
  classToggle(slideBtn, 'Slider__Btn-active');
}
//********* iPhone style sliding button END ***********