(function(console, debug, commonColor){
    if(!debug){return;}

    if(!console){
        console = window.console = {};
        console.log = function(){};
    }
    var hasInit = false;
    var clog = console.log;

    var panel, list;
    var tempConsoleStorage = [];

    var debugLog = function(){
            Function.prototype.apply.call(clog, console, arguments);
        },
        logError = function(e, filename, lineNo, colno, errObj, caller){
            log('#f00', [
                e.message || e.error || (e.toString ? e.toString() : e)
                ]);
            log('#f00', [
                '[error]',
                (filename || e.filename), 
                (lineNo || e.lineno || '-') + ':' + (colno || e.colno || '-')
                ]);
        }

    var errFunc = function(e, filename, lineNo, colno, errObj){
        if(!hasInit){
            alert(e.message || e + 'from:' + (arguments.callee.caller && arguments.callee.caller.toString()));
        }
        logError(e, filename, lineNo, colno, errObj, arguments.callee.caller);
    }
    window.onerror ? window.addEventListener('error', errFunc) : (window.onerror = errFunc);

    console.log = function(){
        tempConsoleStorage.push(arguments);
        debugLog.apply(null, arguments);
    }
    var bindFunc = function(){
        initPanel();

        tempConsoleStorage.forEach(function(args){
            log(commonColor, args);
        });

        console.log = function(){
            log(commonColor, arguments);
            debugLog.apply(null, arguments);
        }
        hasInit = true;
    };
    (document.readyState === 'interactive' || document.readyState === 'complete') ?
        bindFunc() :
        document.addEventListener('DOMContentLoaded', bindFunc);


    function log(color, args){
        if(!panel){return;}
        var msg = [].map.call(args, function(arg){
            return (arg && arg.toString) ? arg.toString() : arg;
        }).join(' | ');
        var li = document.createElement('li');
        li.style.cssText = [
            'text-align:right',
            'display:block',
            'padding:5px 0px 5px 12px',
            'border-bottom:1px solid #ccc',
            'background:rgba(255,255,255,.4)',
            'color:'+color,
            'font-size:12px',
            'font-size:10px',
            'line-height:1.2',
            'clear:both',
            'word-break:break-all'
            ].join(';');
        li.textContent = msg;
        li.innerHTML = '<span>' + li.innerHTML + '</span>' + ' \t<span style="color:#aaa;pointer-events:auto;white-space:nowrap;">' + new Date().toLocaleTimeString('ca', {hour12:false}) + '</span>';
        list.insertBefore(li, list.firstChild);
    }
    function initPanel(){
        if(!document.body){return;}
        panel = document.createElement('div');
        panel.style.cssText = [
            'position:fixed',
            'top:0',
            'right:0',
            'bottom:0',
            'max-height:100%',
            'overflow-y:auto',
            'z-index:999999',
            'opacity:.4',
            'pointer-events:none'
        ].join(';');

        panel.innerHTML = [
            '<ul style="clear:none;margin:0;padding:0;">',
                '<li></li>',
            '</ul>'
        ].join('');
        list = panel.firstChild;
        document.body.appendChild(panel);
    }

})(window.console, true, '#00f');
