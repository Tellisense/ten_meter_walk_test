// "use strict";
// ********************DOM SELECTORS****************************
var timer = document.querySelector('.stop-watch__timer');
var toggleBtn = document.querySelector('.stop-watch__toggle');
var resetBtn = document.querySelector('.stop-watch__reset');
var addBtn = document.querySelector('.stop-watch__use');
var displayTime = document.querySelector('.stop-watch__timer');
var finalizeBtn = document.querySelector('.btn--submit');
var transcript = document.querySelector('.patient-transcript');
var hidden = document.querySelector('.hidden');
var hidden2 = document.querySelector('.hidden2');
var firstName = document.querySelector('#first-name');
var lastName = document.querySelector('#last-name');
var DOB = document.querySelector('#DOB');
var copyText = document.querySelector('.patient-transcript');
var stopWatchTestsSection = document.getElementsByClassName('stop-watch-tests');
var slideBtn = document.querySelector('#idSlideBg');
var startBtn = document.querySelector('.btn--start');

var isSliderEnabled = true;

//********* Stop-watch timer functionality START ***********
var watch = new Stopwatch(timer);

function start() {
  var fieldsToChange = [
    firstName,
    lastName,
    DOB,
    addBtn,
    finalizeBtn
  ];
  // disable fields while start is depressed
  fieldsToChange.forEach(function (item) {
    item.setAttribute('disabled', true);
  })
  toggleBtn.textContent = 'Stop';
  isSliderEnabled = false;

  watch.start();
}

function stop() {
  toggleBtn.textContent = 'Start';
  addBtn.removeAttribute('disabled');
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

addBtn.addEventListener('click', function () {
  watch.add();
});

//  check speed of test being performed
function checkSpeed() {
  //  if true - slider switch is on fast
  if (slideBtn.classList.contains('Slider__Btn-active')) {
    return ` fast paced speed trial`;
  } else {
    return ' normal comfortable speed trial';
  }
}

var total = 0;
var calculatedSpeed = function () {
  var averageSpeed = total / 3;
  var geitSpeed = 6 / averageSpeed;
  return (geitSpeed * 1000).toFixed(2);
}

finalizeBtn.addEventListener('click', function (event) {
  hidden.style.display = 'block';
  hidden2.style.display = 'block';

  transcript.innerHTML = `During ${checkSpeed()},  patient ${firstName.value} ${lastName.value}, age: ${calculateAge(birthday)}, performed at a Gait Speed of :  ${calculatedSpeed()} meters per second (m/s).`;
  event.preventDefault();

  sendData({
    firstName: firstName.value,
    lastName: lastName.value,
    dob: DOB.value,
    age: calculateAge(birthday),
    speed: checkSpeed(),
    rate: calculatedSpeed()
  });
});

function Stopwatch(elem) {
  this.time = 0;
  var offset;
  var interval;
  this.counter = 0;
  this.total = 0;

  function update() {
    if (this.isOn) {
      this.time += delta();
    }

    elem.textContent = timeFormatter(this.time);
  }

  function delta() {
    var now = Date.now();
    var timePassed = now - offset;
    offset = now;
    return timePassed;
  }

  function timeFormatter(time) {
    this.time = new Date(time);
    var seconds = this.time.getSeconds().toString();
    var milliseconds = this.time.getMilliseconds().toString();
    if (seconds.length < 3) {
      seconds = '0' + seconds;
    }
    while (milliseconds.length < 3) {
      milliseconds = '0' + milliseconds;
    }
    return seconds + ' . ' + milliseconds;
  }
  this.start = function () {
    interval = setInterval(update.bind(this), 10);
    offset = Date.now();
    this.isOn = true;
  };

  this.add = function () {
    if (this.counter > 2) {
      return;
    } else if (this.counter === 2) {
      this.stop();
      addBtn.setAttribute('disabled', true);
      startBtn.setAttribute('disabled', true);
      resetBtn.setAttribute('disabled', true);
      finalizeBtn.removeAttribute('disabled');
    }
    this.counter++;
    // Appending the DOM element
    stopWatchTestsSection[0].insertAdjacentHTML('beforeend', `<div>Test # ${this.counter}&nbsp; &nbsp;  <span class="tests-result">${timeFormatter(this.time)}</span></div>`);
    total += this.time;
    this.time = 0;
  };

  this.stop = function () {
    clearInterval(interval);
    interval = null;
    this.isOn = false;
  };

  this.reset = function () {
    this.time = 0;
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






//********* API -- (XHR) objects to interact with servers START ***********
function sendData(data) {
  var XHR = new XMLHttpRequest();
  var jsonData;

  try {
    jsonData = JSON.stringify(data)
  } catch (err) {
    throw new Error(err);
  }

  // Define what happens in case of error
  XHR.addEventListener("error", function (event) {
    console.log('Oops! Something went wrong.');
  });

  // Set up our request
  XHR.open("POST", "/submit");
  //Send the proper header information along with the request
  XHR.setRequestHeader('Content-Type', 'application/json');

  // The data sent is what the user provided
  XHR.send(jsonData);
}
//********* API -- (XHR) objects to interact with servers END ***********






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
  if (!isSliderEnabled) {
    return;
  }
  classToggle(slideBg, 'Slider__Bg-active');
  classToggle(slideBtn, 'Slider__Btn-active');
}
//********* iPhone style sliding button END ***********