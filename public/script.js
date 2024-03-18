var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
  $messages.mCustomScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 100);
});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function scrollToBottom() {
  setTimeout(()=> {
    var objDiv = document.getElementById("messagesDiv");
    objDiv.scrollTo({
      top: objDiv.scrollHeight,
      behavior: 'smooth'
    });
  }, 300)
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  scrollToBottom();

  testMessage("If this question contains an address and is asking about solar please return the address text, or else return 'no'.", msg)
  .then((response) => {
    if (response == "no") {
      chatMessage(msg)
      .then((response) => {
        addResponse(response);
      });
    }
    else {
      // addResponse(`I don't have any information about that.`);

      addResponse(`Let me check that with the solar financial service to calculate the potental for your roof...`);

      fetch("/solar?address=" + encodeURIComponent(response), {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
      })    
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let solarResponse = data["outputParameters"]["output"];

        addResponse(`Based on our calucations, this is the maximum amount of solar panels that your roof could hold:
  * Maximum number of panels: ${solarResponse["maxArrayPanelsCount"]}
  * Maximum hours of sunshine per year: ${solarResponse["maxSunshineHoursPerYear"]}        
  * Total kWh produced per year: ${parseFloat(solarResponse["maxArrayPanelsCount"]) * parseFloat(solarResponse["maxSunshineHoursPerYear"]) + 400}
  * Market value of energy produced per year: $$
  * Average cost to install panels:
`);
        
        addResponse(`Based on that high solar potential, you should break even on the investment in 10-12 years. We can also offer financing for the up-front investment, just click on this link to get a personalized offer. Thank you for using our service!`);
      });

    }
  });

  // setTimeout(function() {
  //   fakeMessage();
  // }, 1000 + (Math.random() * 20) * 100);
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

var Fake = [
  'Hi there, I\'m an expert for energy financing, how can I help you?',
  'Nice to meet you',
  'How are you?',
  'Not too bad, thanks',
  'What do you do?',
  'That\'s awesome',
  'Codepen is a nice place to stay',
  'I think you\'re a nice person',
  'Why do you think that?',
  'Can you explain?',
  'Anyway I\'ve gotta go now',
  'It was a pleasure chat with you',
  'Time to make a new codepen',
  'Bye',
  ':)'
]

function addResponse(text) {
  $('<div class="message loading new"><figure class="avatar"><img src="https://storage.googleapis.com/files313/images/gemini.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  scrollToBottom();
  $('.message.loading').remove();
  $('<div class="message new"><figure class="avatar"><img src="https://storage.googleapis.com/files313/images/gemini.png" /></figure>' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  scrollToBottom();
}

function fakeMessage() {
  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="https://storage.googleapis.com/files313/images/gemini.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
  scrollToBottom();
  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="https://storage.googleapis.com/files313/images/gemini.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
    scrollToBottom();
    i++;
  }, 1000 + (Math.random() * 20) * 100);
}

function testMessage(testQuestion, message) {
  return new Promise((resolve, reject) => {
    fetch("/chat?question=" + encodeURIComponent(testQuestion + " " + message), {
      method: "GET",
      headers: {
        Accept: "text/plain"
      },
    })    
    .then((response) => response.text())
    .then((text) => {
      resolve(text);
    });
  });
}

function chatMessage(message) {
  return new Promise((resolve, reject) => {
    fetch("/chat?question=" + encodeURIComponent(message), {
      method: "GET",
      headers: {
        Accept: "text/plain"
      },
    })    
    .then((response) => response.text())
    .then((text) => {
      resolve(text);
    });
  });
}