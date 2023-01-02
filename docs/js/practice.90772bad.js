(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["practice"],{"3b32":function(t,e,s){"use strict";s.r(e);var o=function(){var t=this,e=t._self._c;t._self._setupProxy;return e("div",{attrs:{id:"practice"}},[e("el-container",[e("el-aside",[e("div",{attrs:{id:"indicator"}},[e("el-card",{staticClass:"time",attrs:{shadow:"never"}},[e("el-progress",{attrs:{type:"dashboard",percentage:t.percentage,width:200}})],1),e("el-card",{attrs:{shadow:"never"}},[e("el-row",[e("el-col",{staticClass:"speed",attrs:{span:24}},[t._v(t._s(t.typeSpeed))])],1),e("el-row",[e("el-col",{attrs:{span:8}},[e("div",{staticClass:"hint-block"},[e("span",{staticClass:"number"},[t._v(t._s(t.lastTypeSpeed.toFixed(2)))]),e("span",{staticClass:"desc"},[e("el-button",{attrs:{type:"text"}},[t._v("瞬速度")])],1)])]),e("el-col",{attrs:{span:8}},[e("div",{staticClass:"hint-block"},[e("span",{staticClass:"number"},[t._v(t._s(t.lastHitSpeed.toFixed(2)))]),e("span",{staticClass:"desc"},[e("el-button",{attrs:{type:"text"}},[t._v("瞬击键")])],1)])]),e("el-col",{attrs:{span:8}},[e("div",{staticClass:"hint-block"},[e("span",{staticClass:"number"},[t._v(t._s(t.hitSpeed))]),e("span",{staticClass:"desc"},[e("el-button",{attrs:{type:"text"}},[t._v("总击键")])],1)])])],1)],1),e("el-card",{attrs:{shadow:"never"}},[e("div",{staticClass:"key-value"},[e("span",[t._v("已打")]),e("span",[t._v(t._s(t.current)+" / "+t._s(t.phrases.length))])]),e("div",{staticClass:"key-value"},[e("span",[t._v("已掌握")]),e("span",[t._v(t._s(t.option.removed)+" / "+t._s(t.option.total))])])]),e("el-card",{staticClass:"code-hint",attrs:{shadow:"never"}},t._l(t.wordsHint,(function(s){return e("div",{key:s.text},[e("span",{attrs:{type:"info"}},[t._v(t._s(s.text)+"：")]),t._l(s.codings,(function(s){return e("span",{key:s.code},[t._v(t._s(s.code+t.getSelectChar(s.index,s.length)))])}))],2)})),0)],1)]),e("el-main",[e("el-row",[e("el-col",{staticClass:"toolbar",attrs:{span:24}},[e("el-button-group",[e("el-button",{attrs:{icon:"el-icon-odometer"},on:{click:t.reset}},[t._v("重置")]),e("el-button",{attrs:{icon:"el-icon-refresh"},on:{click:function(e){return t.shuffleAndSave(!0)}}},[t._v("乱序")]),e("el-button",{attrs:{icon:"el-icon-upload"},on:{click:t.save}},[t._v("保存进度")]),e("el-button",{attrs:{icon:"el-icon-set-up"},on:{click:function(e){t.drawer=!0}}},[t._v("设置")])],1)],1)],1),e("el-row",{staticClass:"stage"},[t.phrases.length>t.current?e("el-col",{staticClass:"phrase active",attrs:{span:6,offset:3}},[t._v(t._s(t.phrases[t.current].text))]):t._e(),t.phrases.length>t.current+1?e("el-col",{staticClass:"phrase",attrs:{span:6}},[t._v(t._s(t.phrases[t.current+1].text))]):t._e(),t.phrases.length>t.current+2?e("el-col",{staticClass:"phrase",attrs:{span:6}},[t._v(t._s(t.phrases[t.current+2].text))]):t._e()],1),e("el-row",[e("el-col",{attrs:{span:6,offset:9}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.input,expression:"input"}],staticClass:"input el-input__inner",attrs:{placeholder:t.placeholder,disabled:t.phrases.length<=0},domProps:{value:t.input},on:{input:[function(e){e.target.composing||(t.input=e.target.value)},t.checkInput],keydown:t.keydown,focus:function(e){t.start=Date.now()},blur:function(e){t.start=-1}}})])],1)],1)],1),e("el-drawer",{attrs:{title:"词库抽取",visible:t.drawer,"with-header":!1},on:{"update:visible":function(e){t.drawer=e}}},[e("el-form",{attrs:{"label-width":"160px","label-suffix":"："}},[e("el-form-item",{attrs:{label:"编码长度"}},[e("div",{staticClass:"slider-container"},[e("el-slider",{attrs:{range:"",max:4,min:1,"show-stops":"","format-tooltip":t.codeLengthFormatter},model:{value:t.option.codeRange,callback:function(e){t.$set(t.option,"codeRange",e)},expression:"option.codeRange"}})],1)]),e("el-form-item",{attrs:{label:"字词长度"}},[e("div",{staticClass:"slider-container"},[e("el-slider",{attrs:{range:"",max:20,min:1,"show-stops":""},model:{value:t.option.phraseRange,callback:function(e){t.$set(t.option,"phraseRange",e)},expression:"option.phraseRange"}})],1)]),e("el-form-item",{attrs:{label:"词条位置"}},[e("div",{staticClass:"slider-container"},[e("el-slider",{attrs:{range:"",max:30,min:1,"show-stops":""},model:{value:t.option.positionRange,callback:function(e){t.$set(t.option,"positionRange",e)},expression:"option.positionRange"}})],1)]),e("el-form-item",{attrs:{label:"乱序"}},[e("el-switch",{model:{value:t.option.random,callback:function(e){t.$set(t.option,"random",e)},expression:"option.random"}})],1),e("el-form-item",{attrs:{label:"自动移除"}},[e("el-switch",{model:{value:t.option.autoRemove,callback:function(e){t.$set(t.option,"autoRemove",e)},expression:"option.autoRemove"}})],1),t.option.autoRemove?e("el-form-item",{attrs:{label:"移除条件"}},[e("el-row",[e("el-col",{attrs:{span:4}},[t._v(" 击键大于 ")]),e("el-col",{attrs:{span:6}},[e("el-input",{attrs:{type:"number"},model:{value:t.option.targetHitSpeed,callback:function(e){t.$set(t.option,"targetHitSpeed",e)},expression:"option.targetHitSpeed"}})],1),e("el-col",{attrs:{span:4}},[e("el-select",{model:{value:t.option.logic,callback:function(e){t.$set(t.option,"logic",e)},expression:"option.logic"}},[e("el-option",{attrs:{value:"and",label:"且"}}),e("el-option",{attrs:{value:"or",label:"或"}})],1)],1),e("el-col",{attrs:{span:4}},[t._v(" 速度大于 ")]),e("el-col",{attrs:{span:6}},[e("el-input",{attrs:{type:"number"},model:{value:t.option.targetTypeSpeed,callback:function(e){t.$set(t.option,"targetTypeSpeed",e)},expression:"option.targetTypeSpeed"}})],1)],1)],1):t._e(),e("el-form-item",[e("el-button",{on:{click:t.chooseFromCodings}},[t._v("确定")])],1)],1)],1)],1)},i=[],n=(s("14d9"),s("9ab4")),a=s("6011"),r=s("cfc9"),l=s("1b40"),c=s("4bb5");const p=["一简","二简","三简","全码"],h="practice.option",d="practice.progress",u=Object(c["d"])("setting"),g=t=>{let e,s,o=t.length;while(0!==o)s=Math.floor(Math.random()*o--),e=t[o],t[o]=t[s],t[s]=e};class v{constructor(){this.codeRange=[1,2],this.phraseRange=[2,10],this.positionRange=[1,3],this.random=!0,this.total=0,this.removed=0,this.autoRemove=!1,this.logic="and",this.targetHitSpeed=5,this.targetTypeSpeed=0}}let m=class extends l["c"]{constructor(){super(...arguments),this.option=new v,this.phrases=[],this.drawer=!1,this.input="",this.typed=0,this.start=-1,this.usedTime=0,this.typedWordCount=0,this.keyCount=0,this.lastTypeSpeed=0,this.lastHitSpeed=0,this.lastKeyCount=0}get percentage(){const t=this.phrases.length;return t<1?0:parseFloat((this.current/t*100).toFixed(2))}get current(){const{removed:t}=this.option;return this.typed-t}get wordsHint(){const{current:t,phrases:e}=this,s=e[t];return s?[new a["i"](t,s.text,"",!1,"",s.codings)]:[]}get placeholder(){const{current:t,phrases:e}=this;return e&&e[t]&&e[t].codings[0].code}get typeSpeed(){return(this.typedWordCount/(this.usedTime||1)*1e3*60).toFixed(2)}get hitSpeed(){return(this.keyCount/(this.usedTime||1)*1e3).toFixed(2)}chooseFromCodings(){this.codings&&this.codings.children?(this.phrases=[],this.filter(this.codings),this.option.total=this.phrases.length,this.option.removed=0,this.shuffleAndSave(this.option.random)):this.$alert("词库练习需要先导入码表文件","提示",{type:"error"}),this.drawer=!1}shuffleAndSave(t){const{phrases:e}=this;t&&(g(e),e.splice(0,0)),this.reset(),this.save()}save(){localStorage.setItem(h,JSON.stringify(this.option)),localStorage.setItem(d,this.typed.toFixed(0)),r["a"].configs.put(this.phrases,"practice")}codeLengthFormatter(t){return p[t-1]}checkCodeLength(t){const[e,s]=this.option.codeRange;return t>=e&&t<=s}checkTextLength(t){const[e,s]=this.option.phraseRange;return t>=e&&t<=s}checkTextUnicode(t){const e=t.charCodeAt(0);return e>=19968&&e<=40943}checkPosition(t){const[e,s]=this.option.positionRange;return t>=e&&t<=s}filter(t){const{value:e,children:s}=t;if(e){const{text:t,codings:s}=e;if(this.checkTextUnicode(t)&&this.checkTextLength(t.length)){const t=s.slice().filter(t=>this.checkCodeLength(t.code.length)&&this.checkPosition(t.index+1)).sort((t,e)=>t.code.length-e.code.length);t.length>0&&this.phrases.push(e)}}s&&s.forEach(t=>this.filter(t))}checkInput(){const{current:t,phrases:e,option:s}=this;if(e[t].text===this.input){const t=Date.now(),e=t-this.start,s=this.input.length;this.removePhraseByTarget(s,e/1e3),this.input="",this.start=t,this.usedTime+=e,this.typedWordCount+=s,this.lastKeyCount=0,this.typed++}this.current>=e.length&&this.$confirm("词语已全部打完，是否重新开始？","提示").then(()=>{this.shuffleAndSave(s.random),this.start=Date.now()}).catch(()=>{})}removePhraseByTarget(t,e){if(this.lastTypeSpeed=t/e*60,this.lastHitSpeed=this.lastKeyCount/e,this.option.autoRemove){const{targetHitSpeed:t,targetTypeSpeed:e,logic:s}=this.option,o=this.lastHitSpeed>t,i=this.lastTypeSpeed>e;if("and"===s?o&&i:o||i){const t=this.phrases.splice(this.current,1);this.$notify.success({title:"提示",message:`词语/字 “${t[0].text}” 已掌握，已从练习队列中移除`,duration:1500,position:"bottom-right"}),this.option.removed++,this.save()}}}keydown(){this.keyCount++,this.lastKeyCount++}reset(){this.typed=this.option.removed,this.usedTime=0,this.keyCount=0,this.typedWordCount=0,this.lastTypeSpeed=0,this.lastHitSpeed=0,this.lastKeyCount=0,this.start=-1,this.input=""}mounted(){const t=localStorage.getItem(h);t&&Object.assign(this.option,JSON.parse(t));const e=localStorage.getItem(d);e&&(this.typed=parseInt(e)),r["a"].configs.get("practice").then(t=>{t?this.phrases=t:this.drawer=!0})}beforeDestroy(){this.save()}};Object(n["a"])([Object(c["c"])("codings")],m.prototype,"codings",void 0),Object(n["a"])([u.Getter("getSelectChar")],m.prototype,"getSelectChar",void 0),m=Object(n["a"])([l["a"]],m);var f=m,b=f,y=(s("508d"),s("2877")),_=Object(y["a"])(b,o,i,!1,null,null,null);e["default"]=_.exports},"508d":function(t,e,s){"use strict";s("c325")},c325:function(t,e,s){}}]);