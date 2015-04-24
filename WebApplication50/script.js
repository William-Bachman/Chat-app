var firebaseURL = 'https://chat-app42.firebaseio.com/';
var Chat = function (Username, Recipient, Message) {
    this.Username = Username;
    this.Recipient = Recipient;
    this.Message = Message;
    this.dateTime = Date();
}
var Messages = [];


var sendMessage = function () {
    var Username = $('#inputUserName').val();
    var Recipient = $('#inputRecipient').val();
    var Message = $('#inputMessage').val();
    var myMessage = new Chat(Username, Recipient, Message);
    postMessage(myMessage);

    $('#inputUserName').val('');
    $('#inputRecipient').val('');
    $('#inputMessage').val('');
    $('#myModal').modal('toggle');
}
// inline buttons added via concatnation
var drawMessages = function () {
    $('#DisplayMessages').html = ('');
    var elemString = '';
    for (var i = 0; i < Messages.length; i++) {
        elemString += '<h2>' + Messages[i].Username + '</h2>'
        elemString += '<h3>' + Messages[i].Recipient + '</h3>'
        elemString += '<h4>' + Messages[i].Message + '</h4>'
        elemString += '<h5>' + Messages[i].dateTime + '</h5>'
        elemString += '<button class="btn btn-warning" onclick="editMessage(' + i + ')">Edit Message</button><button class="btn btn-warning" onclick="deleteMessage('+ i +')">Delete</button>'
    }
    $('#DisplayMessages').html(elemString);
}

//Remember to pass in the send Function into this
var postMessage = function (sendMessage) {
    var request = new XMLHttpRequest();
    request.open('POST', firebaseURL + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var response = JSON.parse(this.response);
            //Do not forget line 45 unless you only want to delete from HTML not Firebase it is always send function name.response.name
            sendMessage.key = response.name
            Messages.push(sendMessage);
            drawMessages();

        }
        else {
            console.log(this.response);
        }
    }
    request.send(JSON.stringify(sendMessage));

}

var getMessages = function () {
    var request = new XMLHttpRequest();
    request.open('GET', firebaseURL + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var response = JSON.parse(this.response);
            for (var propName in response) {
                response[propName].key = propName;
                Messages.push(response[propName]);
            }
            drawMessages();
        }
        else {
            console.log(this.response);
        }
    }
    request.send();
}
var putMessage = function (editMessage, i) {
    var key = Messages[i].key;
    var request = new XMLHttpRequest();
    request.open('PUT', firebaseURL + key + '/.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            sendMessage.key = Messages[i].key;
            Messages.splice(i, 1, editMessage);
            drawMessages();
        }
        else {
            console.error(this.response);
        }
    }
    request.send(JSON.stringify(editMessage));
}
var editMessage = function (i) {
    $('#editUserName').val( Messages[i].Username);
    $('#editRecipient').val(Messages[i].Recipient);
    $('#editMessage').val(Messages[i].Message);
    $('#SaveEditButton').html('<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="saveEdit(' + i + ');">Save changes</button>')
    $('#myModal1').modal('toggle');
}
var saveEdit = function (i) {
    var Username = $('#editUserName').val();
    var Recipient = $('#editRecipient').val();
    var Message = $('#editMessage').val();
    this.dateTime = new Date
    var newMessage = new Chat(Username, Recipient, Message);
    putMessage(newMessage, i);
}
var deleteMessage = function (i) {
    var request = new XMLHttpRequest();
    request.open('DELETE',firebaseURL + Messages[i].key + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            Messages.splice(i, 1);
            drawMessages();
            
        }
        else {
            console.error(this.response);
        }

    }
    request.send();
}
getMessages();
//var timer = setInterval(getMessages, 5000);