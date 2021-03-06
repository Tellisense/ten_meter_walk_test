// ********************DOM SELECTORS****************************
const timer = document.querySelector('.stop-watch__timer');
const toggleBtn = document.querySelector('.stop-watch__toggle');
const resetBtn = document.querySelector('.stop-watch__reset');
const addBtn = document.querySelector('.stop-watch__use');
const displayTime = document.querySelector('.stop-watch__timer');
const finalizeBtn = document.querySelector('.btn--submit');
const transcript = document.querySelector('.patient-transcript');
const hidden = document.querySelector('.hidden');
const hidden2 = document.querySelector('.hidden2');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const DOB = document.querySelector('#DOB');
const copyText = document.querySelector('.patient-transcript');
const copyBtn = document.querySelector("#btn--clipboard");
const stopWatchAppend = document.querySelectorAll('.stop-watch-tests');
const slideBtn = document.querySelector('.btn-slider__background');
const startBtn = document.querySelector('.btn--start');
const slideBg = document.querySelector('#btn-slider_bg');
const SliderBtnId = document.getElementById('Slider__Btn-id');
let isSliderEnabled = true;

//********** iPhone style sliding button START ***********
function classToggle(elem, className) {
  let arrClass = elem.className.split(' ');
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

function sliderOnClick() {
  SliderBtnId.classList.toggle('Slider__Btn-active');
  slideBg.style.background = SliderBtnId.classList.contains('Slider__Btn-active') ? '#36D1DC' : 'rgba(247, 102, 45, 0.76)';
}

function sliderBgOnClick() {
  if (!isSliderEnabled) {
    return;
  }
  classToggle(slideBg, 'btn-slider__background-active');
  classToggle(SliderBtnId, 'Slider__Btn-active');
}
//********* iPhone style sliding button END ***********




//********* Stop-watch timer functionality START ***********
let watch = new Stopwatch(timer);

function start() {
  let fieldsToChange = [
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

let birthday = new Date(DOB.value);

function calculateAge(birthday) {
  let ageDifMs = Date.now() - birthday.getTime();
  let ageDate = new Date(ageDifMs);
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

let total = 0;
let calculatedSpeed = function () {
  let averageSpeed = total / 3;
  let gaitSpeed = 6 / averageSpeed;
  return (gaitSpeed * 1000).toFixed(2);
}

finalizeBtn.addEventListener('click', loadTranscript);

function loadTranscript(event) {
  hidden.style.display = 'block';
  hidden2.style.display = 'block';
  transcript.innerHTML = `During ${checkSpeed()},  patient ${firstName.value} ${lastName.value}, age: ${calculateAge(birthday)}, performed at a Gait Speed of :  ${calculatedSpeed()} meters per second (m/s).`;

  sendData({
    firstName: firstName.value,
    lastName: lastName.value,
    dob: DOB.value,
    age: calculateAge(birthday),
    speed: checkSpeed(),
    rate: calculatedSpeed()
  });

  event.preventDefault();
}


function Stopwatch(elem) {
  this.time = 0;
  let offset;
  let interval;
  this.counter = 0;
  this.total = 0;

  function update() {
    if (this.isOn) {
      this.time += delta();
    }

    elem.textContent = timeFormatter(this.time);
  }

  function delta() {
    let now = Date.now();
    let timePassed = now - offset;
    offset = now;
    return timePassed;
  }

  function timeFormatter(time) {
    this.time = new Date(time);
    let seconds = this.time.getSeconds().toString();
    let milliseconds = this.time.getMilliseconds().toString();
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
    stopWatchAppend[0].insertAdjacentHTML('beforeend', `<div>Test # ${this.counter}&nbsp; &nbsp;  <span class="tests-result">${timeFormatter(this.time)}</span></div>`);
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
    stopWatchAppend[0].innerHTML = '';
    update();
  };
  this.isOn = false;
}
//********* Stop-watch timer functionality END ***********


//********* Copy to Clipboard START ***********
function copy() {
  copyText.select();
  document.execCommand("copy");
}
copyBtn.addEventListener("click", copy);
//********* Copy to Clipboard END ***********



//********* API -- (XHR) objects to interact with servers START ***********
function sendData(data) {
  let XHR = new XMLHttpRequest();
  let jsonData;

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