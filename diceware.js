var wordList;

function randomLoaded() {
    var passwordElement = document.getElementById('password');
    var rawResponse = this.responseText;

    var lines = rawResponse.split("\n");
    var randomNumbers = [];

    for (var i = 0; i < lines.length; i ++) {
        if (lines[i] !== "") {
            randomNumbers[i] = lines[i].split("\t").join("");
        }
    }

    if (wordList) {
        var password = [];
        for (var i = 0; i < randomNumbers.length; i ++) {
            password.push(wordList[randomNumbers[i]]);
        }
        passwordElement.textContent = password.join(" ");
        document.getElementById("password-header").style.display = 'inherit';
        passwordElement.style.display = "inline-block";

        if (!isElementInViewport(passwordElement)) {
            smoothScroll(findPos(passwordElement));
        }
    }
    else {
        getWordList();
    }
}

function getWordList() {
    var wordListRequest = new XMLHttpRequest();
    wordListRequest.addEventListener("load", wordListLoaded);
//         wordListRequest.open("GET", "https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt");
    wordListRequest.open("GET", "eff_large_wordlist.txt");

    wordListRequest.send();
}

function wordListLoaded() {
    wordList = {};
    rawResponse = this.responseText;

    lines = rawResponse.split("\n");
    for (var i = 0; i < lines.length; i ++) {
        line = lines[i].split("\t");
        key = line[0];
        word = line[1];

        wordList[key] = word;
    }
    generatePassword();
}

function getRandomNumbers(count) {
    if (wordList === undefined) {
        getWordList();
        return;
    }
    var randomRequest = new XMLHttpRequest();
    randomRequest.addEventListener("load", randomLoaded);
    requestURL = "https://www.random.org/integers/?format=plain&min=1&max=6&base=10&col=5";
    requestURL += "&num=" + count;
    randomRequest.open("GET", requestURL);
    randomRequest.send();
}

function generatePassword() {
    var countField = document.getElementById("count");
    var count = parseInt(countField.value);
    if (isNaN(count)) {
        count = 4;
    }
    getRandomNumbers(count * 5);
    ga('send', 'event', 'Passphrase', 'generated');
}

function arrowClicked(event) {
    var countField = document.getElementById("count");
    if (event.target.className.includes('up')) {
        countField.value = parseInt(countField.value) + 1;
    }
    else {
        countField.value = parseInt(countField.value) - 1;
    }

}

var generateButton = document.getElementById("generate");
generateButton.addEventListener("click", generatePassword);

var arrows = document.getElementsByClassName("arrow");
for (var i = 0; i < arrows.length; i ++) {
    arrows[i].addEventListener("click", arrowClicked);
}

// Smooth scrolling
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}

function smoothScroll(y) {
    var currentY = document.body.scrollTop;
    var scrollInterval = setInterval(function() {
        if (currentY < y) {
            window.scroll(0, currentY);
            currentY += 5;
        }
        else {
            clearInterval(scrollInterval);
        }
    },1);
}

function isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
