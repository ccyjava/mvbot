(function () {
    var Message;
    var contextid = "",step = 0;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        function readTextFile(file)
        {
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", file, false);
            var allText = "";
            rawFile.onreadystatechange = function ()
            {
                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {
                        allText = rawFile.responseText;
                        
                    }
                }
            }
            rawFile.send(null);
            return allText;
        };
        function parse_story(txt)
        {
            var story = {};
            lines = txt.split('\n');
            for(var no in lines){
                console.log(lines[no]);
                ele = lines[no].split('\t');
                if(ele != "")
                    story[ele[0]]=ele.slice(1); 
            }
            return story;
        };


        var story = parse_story(readTextFile("res/story.txt"));

        responseMesage = function(text){
            var ret = "hehe";
            if(contextid != "" && step < story[contextid].length){               
                ret = story[contextid][step];
                step++;
                if(step >= story[contextid].length){
                    contextid = "";
                }
            }else{
                for(var key in story){
                    if(text == key){
                        ret =story[key][0];
                        contextid = key;
                        step=1;
                    }
                }
            }
            return ret;
        };

        sendMessage = function (text) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
            return message_side;
        };
        $('.send_message').click(function (e) {
            var msgtxt = getMessageText();
            if(sendMessage(msgtxt) == 'right'){
                setTimeout(function () {
                    return sendMessage(responseMesage(msgtxt));
                }, 1000);
            }
        });


        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                var msgtxt = getMessageText();
                if(sendMessage(msgtxt) == 'right'){
                    setTimeout(function () {
                        return sendMessage(responseMesage(msgtxt));
                    }, 1000);
                }
            }
        });
        $('.popupele').click(function(e) {
            var id = this.id;
            setTimeout(function () {
                return sendMessage(id);
            }, 0);
            return setTimeout(function () {
                return sendMessage('Got it.');
            }, 1000);
            });
        sendMessage('Hello Philip! :)');
        setTimeout(function () {
            return sendMessage('Hi Sandy! How are you?');
        }, 1000);

        setTimeout(function () {
            return sendMessage('I\'m fine, thank you!');
        }, 2000);


        //======
         var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '227.5',
          width: '400',
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
        //==
    });
}.call(this));