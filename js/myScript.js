//DOM Elements
const time = document.querySelector("#time"),
      greeting = document.querySelector("#greeting"),
      name = document.querySelector("#name");

const showAmPm = true;

//Show Time
function showTheTime() {
  let today = new Date(),
      hour = today.getHours(),
      min = today.getMinutes(),
      sec = today.getSeconds();
  
  const AmPm = hour >= 12 ? 'PM' : 'AM';
  
  //12-Hour Format
  hour = hour % 12 || 12;
  
  //Outputing Time
  time.innerHTML = `${hour}:${addZero(min)}:${addZero(sec)} ${showAmPm ? AmPm : ''}`;
  
  setTimeout(showTheTime, 1000);
}

//Adding Zero To Minutes and Seconds
function addZero(n) {
  return(parseInt(n, 10) < 10 ? '0' : '') + n;
}

//Set Background and Greeting
function setBgGreet() {
  let today = new Date(),
      hour = today.getHours();
  
  if(hour < 12) {
    //Morning
    document.body.style.backgroundImage = "url('https://images.pexels.com/photos/1659689/pexels-photo-1659689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center bottom";
    document.body.style.color = "#fff";
    greeting.textContent = "Good Morning, ";
  }
  else if(hour < 18) {
    //Afternoon
    document.body.style.backgroundImage = "url('https://images.pexels.com/photos/296234/pexels-photo-296234.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center bottom";
    greeting.textContent = "Good Afternoon, ";
  }
  else {
    //Evening
    document.body.style.backgroundImage = "url('https://images.pexels.com/photos/414144/pexels-photo-414144.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "top center";
    document.body.style.color = "#fff";
    greeting.textContent = "Good Evening, ";
  }
}

//Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  }
  else {
    name.textContent = localStorage.getItem('name');
  }
}

//Set Name
function setName(e) {
  if(e.type == 'keypress') {
    //Checking if 'Enter' is pressed
    if(e.which == 13 || e.keycode == 13) {
      localStorage.setItem('name', e.target.innerText);
      name.blur();
    }
  }
  else {
    localStorage.setItem('name', e.target.innerText);
  }
}

name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);

showTheTime();

setBgGreet();

getName();