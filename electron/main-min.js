(()=>{var e={797:(e,r)=>{function t(){var e=this.value[this.index];switch(e){case"{":return r.ArrayParser.call(this);case'"':return r.StringParser.call(this);case"a":if("alias"==this.value.substring(this.index,this.index+5))return r.AliasParser.call(this);break;case"«":if("«data"==this.value.substring(this.index,this.index+5))return r.DataParser.call(this)}return isNaN(e)?r.UndefinedParser.call(this):r.NumberParser.call(this)}r.parse=function(e){if(0!=e.length)return t.call({value:e,index:0})},r.AliasParser=function(){return this.index+=6,"/Volumes/"+r.StringParser.call(this).replace(/:/g,"/")},r.ArrayParser=function(){for(var e=[],r=this.value[++this.index];"}"!=r;)e.push(t.call(this)),","==this.value[this.index]&&(this.index+=2),r=this.value[this.index];return this.index++,e},r.DataParser=function(){var e=r.UndefinedParser.call(this),t=(e=e.substring(6,e.length-1)).substring(0,4);e=e.substring(4,e.length);for(var n=new Buffer(e.length/2),s=0,i=0,o=e.length;i<o;i+=2)n[s++]=parseInt(e[i]+e[i+1],16);return n.type=t,n},r.NumberParser=function(){return Number(r.UndefinedParser.call(this))},r.StringParser=function(e){for(var r="",t=++this.index,n=this.value[t++];'"'!=n;)"\\"==n&&(r+=this.value.substring(this.index,t-1),this.index=t++),n=this.value[t++];return r+=this.value.substring(this.index,t-1),this.index=t,r};var n=/}|,|\n/;r.UndefinedParser=function(){for(var e=this.index,r=this.value[e++];!n.test(r);)r=this.value[e++];var t=this.value.substring(this.index,e-1);return this.index=e-1,t}},819:(e,r,t)=>{var n=t(81).spawn;r.Parsers=t(797);var s=r.Parsers.parse;function i(e,t,i){var a=!1;Array.isArray(t)||(i=t,t=[],a=!0),t.push("-ss"),a||t.push(e);var l=n(r.osascript,t);o(l.stdout),o(l.stderr),l.on("exit",(function(r){var t,n=s(l.stdout.body);r&&((t=new Error(l.stderr.body)).appleScript=e,t.exitCode=r),i&&i(t,n,l.stderr.body)})),a&&(l.stdin.write(e),l.stdin.end())}function o(e){e.body="",e.setEncoding("utf8"),e.on("data",(function(r){e.body+=r}))}r.osascript="osascript",r.execFile=function(e,r,t){return Array.isArray(r)||(t=r,r=[]),i(e,r,t)},r.execString=function(e,r){return i(e,r)}},81:e=>{"use strict";e.exports=require("child_process")},298:e=>{"use strict";e.exports=require("electron")},17:e=>{"use strict";e.exports=require("path")}},r={};function t(n){var s=r[n];if(void 0!==s)return s.exports;var i=r[n]={exports:{}};return e[n](i,i.exports,t),i.exports}(()=>{const{app:e,globalShortcut:r,ipcMain:n,BrowserWindow:s,clipboard:i,Notification:o}=t(298),a=t(17),l=t(819),d=`tell application "QQ" to activate --QQ\ntell application "System Events"\n  tell process "QQ"\n    do shell script "${__dirname}/bin/cliclick c:."\n    keystroke "a" using command down\n    keystroke "c" using command down\n    delay 0.1\n  end tell\nend tell\n`;function c(e="",r="木易跟打器"){new o({title:r,body:e}).show()}const u=()=>{const r=new s({width:940,height:820,webPreferences:{preload:a.join(__dirname,"preload.js"),devTools:!e.isPackaged}});return"darwin"===process.platform&&e.dock.setIcon(a.join(__dirname,"../public/img/icons/logo-large.png")),n.on("set-grade",((r,t)=>{console.log(t),l.execString('\ntell application "QQ" to activate\ntell application "System Events" to tell application process "QQ"\n    keystroke tab\n    keystroke "a" using command down\n    click menu item "粘贴" of menu "编辑" of menu bar item "编辑" of menu bar 1\n    delay 0.1\n    key code 36\nend tell\n',(r=>{r&&(console.error("sendingScript err",r),c(r?.message||"Fail","发送成绩失败")),e.focus({steal:!0})}))})),r.loadURL("https://typer.owenyang.top"),r.webContents.setWindowOpenHandler((({url:e})=>{if(e)return{action:"allow",overrideBrowserWindowOptions:{width:900,height:800,webPreferences:{preload:a.join(__dirname,"preload.js")}}}})),r};e.whenReady().then((()=>{const t=u();e.on("activate",(()=>{0===s.getAllWindows().length&&u()})),r.register("F4",(()=>{console.log("F4 is pressed"),l.execString(d,(r=>{if(e.focus({steal:!0}),r){const e="暂时无法获取QQ赛文！！！请参考『帮助-关于-快速开始』完成初始设置：在『系统偏好设置-安全性与隐私-辅助功能』中，允许『木易跟打器』控制电脑；2.按下F4快捷键直接载文，即刻开始你的跟打之旅~";return c(r.message,"获取文本失败"),void t.webContents.send("update-paste",e)}t.webContents.send("update-paste",i.readText())}))}))||console.log("registration failed"),console.log("is F4 registered: "+r.isRegistered("F4"))})),e.on("window-all-closed",(()=>{"darwin"!==process.platform&&e.quit()})),e.on("will-quit",(()=>{r.unregister("F1"),r.unregisterAll()})),e.isPackaged&&(e.on("browser-window-focus",(function(){r.register("CommandOrControl+R",(()=>{console.log("CommandOrControl+R is pressed: Shortcut Disabled")})),r.register("CommandOrControl+Shift+R",(()=>{console.log("CommandOrControl+Shift+R is pressed: Shortcut Disabled")})),r.register("F5",(()=>{console.log("F5 is pressed: Shortcut Disabled")}))})),e.on("browser-window-blur",(function(){r.unregister("CommandOrControl+R"),r.unregister("CommandOrControl+Shift+R"),r.unregister("F5")})))})()})();