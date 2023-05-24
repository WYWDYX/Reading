const urlParams = new URLSearchParams(window.location.search);
const directoryName = urlParams.get('referrer');
const fileCount = parseInt(urlParams.get('fileCount'), 10);
var currentPageNumber = parseInt(localStorage.getItem(directoryName)) || 1;

function loadText(fileName) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200) {
      const txtContent = xhr.responseText;
      const txtLines = txtContent.split('\n');
      let htmlContent = "";
      let inParagraph = false;
      let partTitle = null;
      let chapterTitle = null;
      for (let i = 0; i < txtLines.length; i++) {
        const txtLine = txtLines[i].trim();
        if (txtLine.length === 0) {
          if (inParagraph) {
            htmlContent += "</p>";
            inParagraph = false;
          }
          htmlContent += "<p><em>&nbsp;&nbsp;</em>";
        } else if (/^第([一二三四五六七八九十百千万]+|[0-9]+|\{.+?\})部\s/.test(txtLine)) {
          if (inParagraph) {
            htmlContent += "</p>";
            inParagraph = false;
          }
          if (partTitle !== null) {
            htmlContent += "</div>";
          }
          partTitle = txtLine;
          htmlContent += `<h1>${partTitle}</h1><div>`;
        } else if (/^第([一二三四五六七八九十百千万]+|[0-9]+|\{.+?\})章\s/.test(txtLine)) {
          if (inParagraph) {
            htmlContent += "</p>";
            inParagraph = false;
          }
          if (chapterTitle !== null) {
            htmlContent += "</div>";
          }
          chapterTitle = txtLine;
          htmlContent += `<h2>${chapterTitle}</h2><div>`;
        } else {
          if (!inParagraph) {
            htmlContent += "<p>";
            inParagraph = true;
          }
          htmlContent += "<p>" + txtLine + "</p>";
        }
      }
      if (inParagraph) {
        htmlContent += "</p>";
      }
      if (chapterTitle !== null) {
        htmlContent += "</div>";
        chapterTitle = null;
      }
      if (partTitle !== null) {
        htmlContent += "</div>";
        partTitle = null;
      }
      document.getElementById('txtContent').innerHTML = htmlContent;
      window.scroll({top:0,left:0,behavior:'smooth'});
      if (currentPageNumber == 1) {
        document.getElementById("prevButton").disabled = true; 
        document.getElementById("prevButton").style.opacity = 0.5;
      } else {
        document.getElementById("prevButton").disabled = false; 
        document.getElementById("prevButton").style.opacity = 1;
      }
      if (currentPageNumber == fileCount) {
        document.getElementById("nextButton").disabled = true; 
        document.getElementById("nextButton").style.opacity = 0.5;
      } else {
        document.getElementById("nextButton").disabled = false; 
        document.getElementById("nextButton").style.opacity = 1;
      }
      fontSizeSpan.innerHTML = 20;
      fontSize = 20;
      localStorage.setItem(directoryName , currentPageNumber);
    } else {
      document.getElementById('txtContent').innerHTML = `
      <p id="warning-1">无法加载 (๑╹っ╹๑):${xhr.statusText}</p>
      <p id="warning-2">向站长反馈:PGWD_YX@iCloud.com</p>`;
    }
  };
  xhr.onerror = function() {
    document.getElementById('txtContent').innerHTML = `<p id="warning-1">网络连接断开 (๑╹っ╹๑)</p>`;
  };
  xhr.open('GET', `../Text/${directoryName}/${fileName}`);
  xhr.send();
}

function changePageNumber(change) {
  const totalPagesNumber = fileCount * Math.pow(10, (directoryName.length - 4));
  currentPageNumber += change;
  if (currentPageNumber < 1) {
    currentPageNumber = 1;
  }
  if (currentPageNumber > totalPagesNumber) {
    currentPageNumber = totalPagesNumber;
  }
}

const pageNumberInput = document.getElementById('pageNumberInput');
pageNumberInput.addEventListener('input', function (event) {
  currentPageNumber = parseInt(event.target.value);
  if (isNaN(currentPageNumber)) {
    currentPageNumber = 1;
  }
});

pageNumberInput.addEventListener('keydown', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    goButton.click();
  }
});

const goButton = document.getElementById('goButton');
goButton.addEventListener('click', function() {
  const totalPagesNumber = fileCount * Math.pow(10, (directoryName.length - 4));
  if (currentPageNumber < 1) {
    currentPageNumber = 1;
  }
  if (currentPageNumber > totalPagesNumber) {
    currentPageNumber = totalPagesNumber;
  }
  document.title = decodeURIComponent(directoryName) + '-' + currentPageNumber + '页';
  const fileName = `Text-${String(currentPageNumber).padStart(directoryName.length - 4, '0')}.txt`;
  loadText(fileName);
  pageNumberInput.value = currentPageNumber;
});    

const prevButton = document.getElementById('prevButton');
prevButton.addEventListener('click', function() {
  document.title = '启始 - 阅读 - ' + decodeURIComponent(directoryName) + ' - ' + (currentPageNumber - 1) + '页';
  changePageNumber(-1);
  const fileName = `Text-${String(currentPageNumber).padStart(directoryName.length - 4, '0')}.txt`;
  loadText(fileName);
  pageNumberInput.value = currentPageNumber;
});

const nextButton = document.getElementById('nextButton');
nextButton.addEventListener('click', function() {
  document.title = '启始 - 阅读 - ' + decodeURIComponent(directoryName) + ' - ' + (currentPageNumber + 1) + '页';
  changePageNumber(1);
  const fileName = `Text-${String(currentPageNumber).padStart(directoryName.length - 4, '0')}.txt`;
  loadText(fileName);
  pageNumberInput.value = currentPageNumber;
});

const fileName = `Text-${String(currentPageNumber).padStart(directoryName.length - 4, '0')}.txt`;
document.title = '启始 - 阅读 - ' + decodeURIComponent(directoryName);
if (currentPageNumber == 1) {
  document.getElementById("prevButton").disabled = true; 
  document.getElementById("prevButton").style.opacity = 0.5;
} else {
  document.getElementById("prevButton").disabled = false; 
  document.getElementById("prevButton").style.opacity = 1;
}
if (currentPageNumber == fileCount) {
  document.getElementById("nextButton").disabled = true; 
  document.getElementById("nextButton").style.opacity = 0.5;
} else {
  document.getElementById("nextButton").disabled = false; 
  document.getElementById("nextButton").style.opacity = 1;
}
if (navigator.maxTouchPoints > 0) {
  const cssRules = [].slice.call(document.styleSheets).map(s => [].slice.call(s.cssRules || s.rules));
  cssRules.reduce((p, c) => (
    c.forEach(r => {
      if (r.selectorText === '.pagination button:hover') {
        Object.assign(r, { selectorText: '.pagination button:active' });
      } else if (r.selectorText === '.size button:hover') {
        Object.assign(r, { selectorText: '.size button:active' });
      } else if (r.selectorText === '.width button:hover') {
        Object.assign(r, { selectorText: '.width button:active' });
      }
    }), p
  ), null);
}
loadText(fileName);
pageNumberInput.value = currentPageNumber;

var settingsBtn = document.getElementById('settingsBtn');
var settingsPanel = document.getElementById('settingsPanel');

var colorOptions = document.getElementsByClassName('color');
var containers = document.querySelectorAll('header, body, #txtContent, .pagination, #settingsPanel, #settingsBtn');

var pagination = document.getElementsByClassName('pagination');
var fontBtns = document.getElementsByClassName('font');
var txtContent = document.getElementById('txtContent');

var fontDecreaseBtn = document.getElementById('fontDecrease');
var fontIncreaseBtn = document.getElementById('fontIncrease');
var fontSizeSpan = document.getElementById('fontSize');
var fontSize = 20;

var widthDecreaseBtn = document.getElementById('widthDecrease');
var widthIncreaseBtn = document.getElementById('widthIncrease');
var containerWidthSpan = document.getElementById('containerWidth');
var containerWidth = 800;

function saveSettings() {
  localStorage.setItem('themeColor', document.querySelector('.color.active').style.backgroundColor);
  localStorage.setItem('fontFamily', document.querySelector('.font.active').getAttribute('data-font'));
  localStorage.setItem('containerWidth', containerWidth);
}

function loadSettings() {
  var themeColor = localStorage.getItem('themeColor');
  if (themeColor === null) {
    themeColor = '';
  }
  for (var i = 0; i < colorOptions.length; i++) {
    if (colorOptions[i].style.backgroundColor === themeColor) {
      colorOptions[i].classList.add('active');
      for (var k = 0; k < containers.length; k++) {
        containers[k].style.backgroundColor = themeColor;
      }
    } else {
      colorOptions[i].classList.remove('active');
    }
  }

  var fontFamily = localStorage.getItem('fontFamily');
  if (fontFamily === null) {
    fontFamily = 'MyFont';
  }
  for (var i = 0; i < fontBtns.length; i++) {
    if (fontBtns[i].getAttribute('data-font') === fontFamily) {
      fontBtns[i].classList.add('active');
      txtContent.style.fontFamily = fontFamily;
    } else {
      fontBtns[i].classList.remove('active');
    }
  }

  containerWidth = parseInt(localStorage.getItem('containerWidth'));
  if (isNaN(containerWidth)) {
    containerWidth = 800;
  }
  txtContent.style.width = containerWidth + 'px';
  pagination[0].style.width = containerWidth + 'px';
  containerWidthSpan.innerHTML = containerWidth;
}

function updateSettings() {
  saveSettings();
  loadSettings();
}

settingsBtn.onclick = function() {
  if (settingsPanel.classList.contains("show")) {
    settingsPanel.classList.remove("show");
  } else {
    settingsPanel.classList.add("show");
  }
}

for (var i = 0; i < colorOptions.length; i++) {
   colorOptions[i].onclick = function() {
      for (var j = 0; j < colorOptions.length; j++) {
         colorOptions[j].classList.remove('active');
      }
      this.classList.add('active');
      for (var k = 0; k < containers.length; k++) {
         containers[k].style.backgroundColor = this.style.backgroundColor;
      }
      updateSettings();
   }
}

for (var i = 0; i < fontBtns.length; i++) {
   fontBtns[i].onclick = function() {
      for (var j = 0; j < fontBtns.length; j++) {
         fontBtns[j].classList.remove('active');
      }
      this.classList.add('active');
      txtContent.style.fontFamily = this.getAttribute('data-font');
      updateSettings();
   }
}

fontDecreaseBtn.onclick = function() {
   if (fontSize > 12) {
      fontSize -= 2;
      Array.from(txtContent.getElementsByTagName('p')).forEach(p => p.style.fontSize = fontSize + 'px');
      Array.from(txtContent.getElementsByTagName('h1')).forEach(h1 => h1.style.fontSize = (fontSize+12) + 'px');
      Array.from(txtContent.getElementsByTagName('h2')).forEach(h2 => h2.style.fontSize = (fontSize+6) + 'px');
      fontSizeSpan.innerHTML = fontSize;
      updateSettings();
   }
}

fontIncreaseBtn.onclick = function() {
   if (fontSize < 48) {
      fontSize += 2;
      Array.from(txtContent.getElementsByTagName('p')).forEach(p => p.style.fontSize = fontSize + 'px');
      Array.from(txtContent.getElementsByTagName('h1')).forEach(h1 => h1.style.fontSize = (fontSize+12) + 'px');
      Array.from(txtContent.getElementsByTagName('h2')).forEach(h2 => h2.style.fontSize = (fontSize+6) + 'px');
      fontSizeSpan.innerHTML = fontSize;
      updateSettings();
   }
}

widthDecreaseBtn.onclick = function() {
   if (containerWidth > 640) {
      containerWidth -= 80;
      txtContent.style.width = containerWidth + 'px';
      pagination[0].style.width = containerWidth + 'px';
      containerWidthSpan.innerHTML = containerWidth;
      updateSettings();
   }
}

widthIncreaseBtn.onclick = function() {
   if (containerWidth < 1280) {
      containerWidth += 80;
      txtContent.style.width = containerWidth + 'px';
      pagination[0].style.width = containerWidth + 'px';
      containerWidthSpan.innerHTML = containerWidth;
      updateSettings();
   }
}

loadSettings();

var colors = document.getElementsByClassName('colors');
var h1Colors = colors[0].getElementsByTagName("h1");
document.getElementById("widthauto").addEventListener("click", function() {
  if (txtContent.style.width === "80%") {
    txtContent.style.width = containerWidth + "px";
    pagination[0].style.width = containerWidth + "px";
    document.querySelectorAll('.fonts, .font, .size button, .width button').forEach(function(e){e.disabled=false})
    for(let i=h1Colors.length-1; i>=0; i--) h1Colors[i].parentNode.removeChild(h1Colors[i]);
    [...document.querySelectorAll('.color')].forEach(e => e.style.display = 'block');
  } else {
    txtContent.style.width = "80%";
    pagination[0].style.width = "80%";
    document.querySelectorAll('.fonts, .font, .size button, .width button').forEach(function(e){e.disabled=true})
    colors[0].insertAdjacentHTML('afterbegin', '<h1>自动调节已开启</h1>');
    [...document.querySelectorAll('.color')].forEach(e => e.style.display = 'none');
  }
});

settingsBtn.addEventListener('click', toggleShadow);

function toggleShadow() {
  if (settingsBtn.style.boxShadow) {
    settingsBtn.style.boxShadow = '';
  } else {
    settingsBtn.style.boxShadow = '3px 3px 20px rgba(0,0,0,0.1)';
  }
}