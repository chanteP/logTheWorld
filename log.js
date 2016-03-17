(function(console, debug, commonColor){
    if(!console){
        console = window.console = {};
        console.log = function(){};
    }
    window.addEventListener('error', function(e, filename, lineNo){
        console.log(e, e.message, 'filename:' + filename, 'lineNo:' + lineNo);
    });
    if(!debug){return;}
    var clog = console.log;
    var debugLog = function(){
        Function.prototype.apply.call(clog, console, arguments);
    }
    var tempConsoleStorage = [];
    console.log = function(){
        tempConsoleStorage.push(arguments);
        Function.prototype.apply.call(clog, console, arguments);
    }
    var bindFunc = function(){
        var panel = document.createElement('div');
        panel.style.cssText = "position:fixed;top:0;right:0;max-height:100%;overflow:hidden;z-index:999999;opacity:.4;pointer-events:none;";
        panel.innerHTML = [
            '<ul style="margin:0;padding:0;">',
                '<li></li>',
            '</ul>'
        ].join('');
        document.body.appendChild(panel);

        var list = panel.children[panel.children.length-1];
        var log = function(color, args){
            var msg = [].map.call(args, function(arg){
                return (arg && arg.toString) ? arg.toString() : arg;
            }).join(' | ');
            var li = document.createElement('li');
            li.style.cssText = 'text-align:right;display:block;padding:5px 12px;border-bottom:1px solid #ccc;background:rgba(255,255,255,.4);color:'+color+';font-size:12px;line-height:1.2;clear:both;word-break:break-all;';
            li.textContent = msg;
            list.insertBefore(li, list.firstChild);
        }
        tempConsoleStorage.forEach(function(args){
            log(commonColor, args);
        });

        console.log = function(){
            log(commonColor, arguments);
            Function.prototype.apply.call(clog, console, arguments);
        }
    };
    (document.readystate === 'interactive' || document.readystate === 'complete') ?
        bindFunc() :
        document.addEventListener('DOMContentLoaded', bindFunc);

})(window.console, true, '#00f');
