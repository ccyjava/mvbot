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

        String.format = function(src){
            if (arguments.length == 0) return null;
            var args = Array.prototype.slice.call(arguments, 1);
            return src.replace(/\{(\d+)\}/g, function(m, i){
                return args[i];
            });
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
            var ret = "Got it";
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
            if(ret.indexOf("(")!=-1 && ret.indexOf(")")!=-1){
                uid=ret.slice(ret.indexOf("(")+1,ret.indexOf(")"));
                ret=ret.slice(0,ret.indexOf("("));
                changeSongById(uid);
            }
            if(ret.indexOf("[")!=-1 && ret.indexOf("]")!=-1){
                suggest_txt=ret.slice(ret.indexOf("[")+1,ret.indexOf("]"));
                ret=ret.slice(0,ret.indexOf("["));
                var suggests = suggest_txt.split("|");
                appendSuggestion(suggests);
            }else{
                var origintxt = '<span class = "popupele"><img src="./res/image/emoji-excit.png"></img>give me more suggestion</span>\
                <span class = "popupele"><img src="./res/image/emoji-happy.png"></img>great</span>\
                <span class = "popupele"><img src="./res/image/emoji-indifferent.png"></img>not my type</span>';
                $(".popup").empty();
                $(".popup").append(origintxt);
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
        // $('.popupele').click(function(e) {
        //     var txt = $(this).text();
        //     setTimeout(function () {
        //         return sendMessage(txt);
        //     }, 0);
        //     return setTimeout(function () {
        //         return sendMessage(responseMesage(txt));
        //     }, 1000);
        // });

        $(document).on('click', '.popupele', function(){
            // what you want to happen when mouseover and mouseout 
            // occurs on elements that match '.dosomething'
            
            var txt = $(this).text();
            setTimeout(function () {
                return sendMessage(txt);
            }, 0);

            
            return setTimeout(function () {
                return sendMessage(responseMesage(txt));
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
          player = new YT.Player('_ytplayer1610', {
            events: {
              'onStateChange': onPlayerStateChange
            }
          });
        }

        function changeSong(url) {
            
            $("#_ytplayer1610").attr('src',url);
        }

        function changeSongById(uid){
            template = "https://www.youtube.com/embed/{0}?autoplay=1&amp;enablejsapi=1&amp;origin=https://www.bing.com&amp;rel=0&amp;showinfo=0&amp;controls=0"
            url = String.format(template,uid);
            changeSong(url);
        }

        function genSuggest(txt) {
            
            return String.format('<span class = "popupele">{0}</span>',txt);
        }

        function appendSuggestion(arr) {
            
            $("#suggest_res").empty();
            for(k in arr){
                $("#suggest_res").append(genSuggest(arr[k]));
            }
        }


        $('.controlpause').click(function (e) {
            
            $("#suggest_res").empty();
            $("#suggest_res").append(genSuggest("yes1"));
            $("#suggest_res").append(genSuggest("yes2"));
        });


        //==
    });
}.call(this));