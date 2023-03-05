(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["setting"],{"4ef5":function(e,t,l){"use strict";l.r(t);var o=function(){var e=this,t=e._self._c;e._self._setupProxy;return t("div",[t("el-form",{ref:"settingForm",attrs:{model:e.form,rules:e.rules,"label-suffix":":","label-width":"14rem"}},[t("el-tabs",{attrs:{"tab-position":"left"},model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},[t("el-tab-pane",{attrs:{label:"基本设置",name:"basic"}},[t("el-form-item",{attrs:{label:"自动重新开始"}},[t("el-switch",{model:{value:e.form.retryWhenEmpty,callback:function(t){e.$set(e.form,"retryWhenEmpty",t)},expression:"form.retryWhenEmpty"}})],1),t("el-form-item",{attrs:{label:"结束条件"}},[t("el-select",{model:{value:e.form.finishStrategy,callback:function(t){e.$set(e.form,"finishStrategy",t)},expression:"form.finishStrategy"}},[t("el-option",{attrs:{value:"NO_ERROR",label:"无错字"}}),t("el-option",{attrs:{value:"LENGTH_MATCH",label:"打完"}}),t("el-option",{attrs:{value:"LAST_RIGHT",label:"最后一次上屏无错"}})],1)],1),t("el-form-item",{attrs:{label:"赛文字体"}},[t("el-input",{model:{value:e.form.fontFamily,callback:function(t){e.$set(e.form,"fontFamily",t)},expression:"form.fontFamily"}})],1),t("el-form-item",{attrs:{label:"赛文字号"}},[t("el-input",{model:{value:e.form.fontSize,callback:function(t){e.$set(e.form,"fontSize",t)},expression:"form.fontSize"}})],1),t("el-form-item",{attrs:{label:"文章行数"}},[t("el-input",{attrs:{type:"number"},model:{value:e.form.articleRows,callback:function(t){e.$set(e.form,"articleRows",t)},expression:"form.articleRows"}})],1),t("el-form-item",{attrs:{label:"输入区行数"}},[t("el-input",{attrs:{type:"number"},model:{value:e.form.inputRows,callback:function(t){e.$set(e.form,"inputRows",t)},expression:"form.inputRows"}})],1),t("el-form-item",{attrs:{label:"未打文字颜色"}},[t("el-color-picker",{model:{value:e.form.pending,callback:function(t){e.$set(e.form,"pending",t)},expression:"form.pending"}})],1),t("el-form-item",{attrs:{label:"已打文字颜色"}},[t("el-color-picker",{model:{value:e.form.typed,callback:function(t){e.$set(e.form,"typed",t)},expression:"form.typed"}})],1),t("el-form-item",{attrs:{label:"已打文字颜色[暗黑模式]"}},[t("el-color-picker",{model:{value:e.form.darkTyped,callback:function(t){e.$set(e.form,"darkTyped",t)},expression:"form.darkTyped"}})],1),t("el-form-item",{attrs:{label:"正确背景颜色"}},[t("el-color-picker",{model:{value:e.form.correct,callback:function(t){e.$set(e.form,"correct",t)},expression:"form.correct"}})],1),t("el-form-item",{attrs:{label:"正确背景颜色[暗黑模式]"}},[t("el-color-picker",{model:{value:e.form.darkCorrect,callback:function(t){e.$set(e.form,"darkCorrect",t)},expression:"form.darkCorrect"}})],1),t("el-form-item",{attrs:{label:"错误背景颜色"}},[t("el-color-picker",{model:{value:e.form.error,callback:function(t){e.$set(e.form,"error",t)},expression:"form.error"}})],1)],1),t("el-tab-pane",{attrs:{label:"码表设置"}},[t("el-form-item",{attrs:{label:"码表文件"}},[t("el-upload",{attrs:{drag:"",action:"#",accept:".tsv,.txt","auto-upload":!1,"show-file-list":!1,"on-change":e.loadCodings}},[t("i",{staticClass:"el-icon-upload"}),t("div",{staticClass:"el-upload__text"},[e._v("将文件拖到此处，或"),t("em",[e._v("点击上传")])]),t("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("文本格式文件，UTF8编码，多多格式，即`字 编码`，每行一条记录")]),t("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("点击更新默认编码提示： "),t("el-button",{attrs:{type:"primary",plain:"",size:"mini",icon:"el-icon-download",loading:e.isCodingLoading},on:{click:function(t){return e.handleCodingDownload("tiger")}}},[e._v("『虎码单字』")])],1)])],1)],1),t("el-tab-pane",{attrs:{label:"编码提示设置"}},[t("el-form-item",{attrs:{label:"编码提示"}},[t("el-switch",{model:{value:e.form.hint,callback:function(t){e.$set(e.form,"hint",t)},expression:"form.hint"}})],1),e.form.hint?t("el-form-item",{attrs:{label:"提示选项"}},[t("el-checkbox-group",{model:{value:e.form.hintOptions,callback:function(t){e.$set(e.form,"hintOptions",t)},expression:"form.hintOptions"}},e._l(e.hintOptions,(function(l){return t("el-checkbox-button",{key:l.value,attrs:{label:l.value,disabled:l.disabled}},[e._v(e._s(l.text))])})),1)],1):e._e(),t("el-form-item",{attrs:{label:"禁用单字编码提示"}},[t("el-switch",{model:{value:e.form.disableSingleHint,callback:function(t){e.$set(e.form,"disableSingleHint",t)},expression:"form.disableSingleHint"}})],1),e.selectHintEnabled?t("el-form-item",{attrs:{label:"候选词条数",prop:"pageSize"}},[t("el-input",{attrs:{type:"number",step:"1"},model:{value:e.form.pageSize,callback:function(t){e.$set(e.form,"pageSize",e._n(t))},expression:"form.pageSize"}}),t("span",{staticClass:"el-upload__tip"},[e._v("输入法候选词条数量，需与输入法设置一致")])],1):e._e(),e.form.hint?t("el-form-item",{attrs:{label:"最大候选词位置",prop:"maxIndex"}},[t("el-input",{attrs:{type:"number",step:"1"},model:{value:e.form.maxIndex,callback:function(t){e.$set(e.form,"maxIndex",e._n(t))},expression:"form.maxIndex"}}),t("span",{staticClass:"el-upload__tip"},[e._v("超过该位置的候选词将被丢弃")])],1):e._e(),e.selectHintEnabled?t("el-form-item",{attrs:{label:"翻页提示"}},[t("el-input",{attrs:{size:"1"},model:{value:e.form.nextPage,callback:function(t){e.$set(e.form,"nextPage",t)},expression:"form.nextPage"}}),t("span",{staticClass:"el-upload__tip"},[e._v("下一页候选词条键")])],1):e._e(),e.selectHintEnabled?t("el-form-item",{attrs:{label:"选重提示"}},[t("el-input",{model:{value:e.form.selective,callback:function(t){e.$set(e.form,"selective",t)},expression:"form.selective"}}),t("span",{staticClass:"el-upload__tip"},[e._v("用于选重提示，长度需对应输入法候选词条数量")])],1):e._e(),e.selectHintEnabled?t("el-form-item",{attrs:{label:"非首选键"}},[t("el-input",{model:{value:e.form.altSelectKey,callback:function(t){e.$set(e.form,"altSelectKey",t)},expression:"form.altSelectKey"}}),t("span",{staticClass:"el-upload__tip"},[e._v('选择非首选词条时所用的键，如果使用了";,"作为2，3选时，也需填入')])],1):e._e(),e.selectHintEnabled?t("el-form-item",{attrs:{label:"选重键文本"}},[t("el-input",{model:{value:e.form.selectiveText,callback:function(t){e.$set(e.form,"selectiveText",t)},expression:"form.selectiveText"}}),t("span",{staticClass:"el-upload__tip"},[e._v("在首选字词后出现以上字符时，顶屏将不可用，需要手动选择")])],1):e._e(),e.autoSelectHintEnabled?t("el-form-item",{attrs:{label:"标点顶屏提示"}},[t("el-input",{model:{value:e.form.punctuationAutoSelectHint,callback:function(t){e.$set(e.form,"punctuationAutoSelectHint",t)},expression:"form.punctuationAutoSelectHint"}})],1):e._e(),e.selectHintEnabled?t("el-form-item",{attrs:{label:"四码唯一自动上屏"}},[t("el-switch",{model:{value:e.form.fourthAutoSelect,callback:function(t){e.$set(e.form,"fourthAutoSelect",t)},expression:"form.fourthAutoSelect"}})],1):e._e(),e.selectHintEnabled?t("el-form-item",{attrs:{label:"第五码首选上屏"}},[t("el-switch",{model:{value:e.form.fifthAutoSelect,callback:function(t){e.$set(e.form,"fifthAutoSelect",t)},expression:"form.fifthAutoSelect"}})],1):e._e(),e.showHintColor?t("el-form-item",{attrs:{label:"提示颜色"}},[t("el-color-picker",{model:{value:e.form.hintColor,callback:function(t){e.$set(e.form,"hintColor",t)},expression:"form.hintColor"}})],1):e._e(),e.colorHintEnabled?t("el-form-item",{attrs:{label:"一码颜色"}},[t("el-color-picker",{model:{value:e.form.code1,callback:function(t){e.$set(e.form,"code1",t)},expression:"form.code1"}})],1):e._e(),e.colorHintEnabled?t("el-form-item",{attrs:{label:"二码颜色"}},[t("el-color-picker",{model:{value:e.form.code2,callback:function(t){e.$set(e.form,"code2",t)},expression:"form.code2"}})],1):e._e(),e.colorHintEnabled?t("el-form-item",{attrs:{label:"三码颜色"}},[t("el-color-picker",{model:{value:e.form.code3,callback:function(t){e.$set(e.form,"code3",t)},expression:"form.code3"}})],1):e._e(),e.colorHintEnabled?t("el-form-item",{attrs:{label:"全码颜色"}},[t("el-color-picker",{model:{value:e.form.code4,callback:function(t){e.$set(e.form,"code4",t)},expression:"form.code4"}})],1):e._e()],1),e.form.hint?t("el-tab-pane",{attrs:{label:"标点设置",name:"punctuation"}},[t("el-form-item",{attrs:{label:"标点用于"}},[t("el-switch",{attrs:{"active-text":"码表及顶屏计算","inactive-text":"顶屏计算"},model:{value:e.form.addPunctuationToCodings,callback:function(t){e.$set(e.form,"addPunctuationToCodings",t)},expression:"form.addPunctuationToCodings"}})],1),t("el-form-item",[t("el-table",{ref:"punctuationTable",attrs:{data:e.punctuations,border:"",height:e.punctuationTableHeight,size:"mini"},scopedSlots:e._u([{key:"empty",fn:function(l){return[t("el-button",{attrs:{type:"text",size:"small"},nativeOn:{click:function(t){return t.preventDefault(),e.addPunctuation(l.$index)}}},[e._v("添加")])]}}],null,!1,584107909)},[t("el-table-column",{attrs:{prop:"key",label:"标点"}}),e.form.addPunctuationToCodings?t("el-table-column",{attrs:{prop:"value",label:"编码"}}):e._e(),t("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(l){return[t("el-popconfirm",{attrs:{"confirm-button-text":"好的","cancel-button-text":"不用了",icon:"el-icon-info","icon-color":"red",title:"确定要删除这个标点吗？"},on:{confirm:function(t){return e.deletePunctuation(l.$index,l.row,e.punctuations)}}},[t("el-button",{attrs:{slot:"reference",type:"text",size:"small"},slot:"reference"},[e._v("移除")])],1),t("el-button",{attrs:{type:"text",size:"small"},nativeOn:{click:function(t){return t.preventDefault(),e.addPunctuation(l.$index)}}},[e._v("添加")])]}}],null,!1,3482975119)})],1)],1)],1):e._e(),t("el-tab-pane",{attrs:{label:"成绩设置",name:"result"}},[t("el-form-item",{attrs:{label:"选项"}},[t("el-checkbox",{attrs:{indeterminate:e.isIndeterminate},on:{change:e.handleCheckAllChange},model:{value:e.checkAll,callback:function(t){e.checkAll=t},expression:"checkAll"}},[e._v("全选")]),t("div",{staticStyle:{margin:"15px 0"}}),t("el-checkbox-group",{on:{change:e.handleCheckedResultChange},model:{value:e.form.resultOptions,callback:function(t){e.$set(e.form,"resultOptions",t)},expression:"form.resultOptions"}},e._l(e.resultOptions,(function(l){return t("el-checkbox",{key:l.value,attrs:{label:l.value,disabled:l.disabled}},[e._v(e._s(l.text))])})),1)],1),t("el-form-item",{attrs:{label:"输入法"}},[t("el-switch",{model:{value:e.form.inputMethod,callback:function(t){e.$set(e.form,"inputMethod",t)},expression:"form.inputMethod"}}),e.form.inputMethod?t("el-input",{attrs:{maxlength:"20"},model:{value:e.form.inputMethodName,callback:function(t){e.$set(e.form,"inputMethodName",t)},expression:"form.inputMethodName"}}):e._e()],1),t("el-form-item",{attrs:{label:"个性签名"}},[t("el-switch",{model:{value:e.form.signature,callback:function(t){e.$set(e.form,"signature",t)},expression:"form.signature"}}),e.form.signature?t("el-input",{attrs:{maxlength:"100"},model:{value:e.form.signatureText,callback:function(t){e.$set(e.form,"signatureText",t)},expression:"form.signatureText"}}):e._e()],1)],1),t("el-tab-pane",{attrs:{label:"载文设置",name:"load"}},[t("el-form-item",{attrs:{label:"去除空格"}},[t("el-switch",{model:{value:e.form.replaceSpace,callback:function(t){e.$set(e.form,"replaceSpace",t)},expression:"form.replaceSpace"}})],1)],1)],1),t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("保存")]),t("el-button",{on:{click:e.resetForm}},[e._v("重置")]),t("el-button",{attrs:{type:"danger"},on:{click:e.setToDefault}},[e._v("恢复默认设置")])],1)],1),t("el-dialog",{attrs:{title:"添加标点",visible:e.punctuationFormVisiable}},[t("el-form",{attrs:{model:e.punctuationForm,inline:""}},[t("el-form-item",{attrs:{label:"标点"}},[t("el-input",{model:{value:e.punctuationForm.key,callback:function(t){e.$set(e.punctuationForm,"key",t)},expression:"punctuationForm.key"}})],1),t("el-form-item",{attrs:{label:"编码"}},[t("el-input",{model:{value:e.punctuationForm.value,callback:function(t){e.$set(e.punctuationForm,"value",t)},expression:"punctuationForm.value"}})],1)],1),t("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:function(t){e.punctuationFormVisiable=!1}}},[e._v("取 消")]),t("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.submitPunctuationForm()}}},[e._v("确 定")])],1)],1)],1)},a=[],n=(l("14d9"),l("9ab4")),i=l("1b40"),r=l("b9fd"),s=l("cfc9"),c=l("6011"),u=l("4bb5"),m=l("5c96"),f=l("e7b9");const p=Object(u["e"])("setting"),d=[{value:"phrase",text:"词语",disabled:!0},{value:"color",text:"颜色"},{value:"select",text:"选重"},{value:"autoSelect",text:"顶屏"},{value:"code",text:"编码"}],b=[{value:"identity",text:"标识",disabled:!0},{value:"typeSpeed",text:"速度",disabled:!0},{value:"hitSpeed",text:"击键",disabled:!0},{value:"codeLength",text:"码长",disabled:!0},{value:"idealCodeLength",text:"理想码长"},{value:"contentLength",text:"字数"},{value:"error",text:"错字"},{value:"usedTime",text:"用时"},{value:"pauseTime",text:"暂停时间"},{value:"accuracy",text:"键准"},{value:"balance",text:"键法"},{value:"leftHand",text:"左"},{value:"rightHand",text:"右"},{value:"phrase",text:"打词数"},{value:"phraseRate",text:"打词"},{value:"selective",text:"选重"},{value:"replace",text:"回改"},{value:"keys",text:"键数"},{value:"backspace",text:"退格"},{value:"enter",text:"回车"},{value:"retry",text:"重打"},{value:"hash",text:"哈希码"},{value:"version",text:"版本"},{value:"firstTry",text:"首打等级提示"},{value:"noCodings",text:"词提禁用提示"},{value:"accuracyTip",text:"无敌键准提示"},{value:"errPenaltyTip",text:"错一罚五提示"}];let h=class extends i["c"]{constructor(){super(...arguments),this.hintOptions=d,this.resultOptions=b,this.form=new c["j"],this.checkAll=!1,this.isIndeterminate=!0,this.activeTab="basic",this.punctuationFormVisiable=!1,this.punctuationIndex=-1,this.isCodingLoading=!1,this.punctuationForm={key:"",value:""},this.rules={maxIndex:[{required:!0,type:"number",message:'请输入最大候选词条位置，如不限制，请输入"0"',trigger:"blur"},{type:"number",min:0,message:"最大候选词条位置不得小于0",trigger:"blur"}],pageSize:[{required:!0,type:"number",message:"请输入候每页选词条数",trigger:"blur"},{type:"number",min:1,message:"每页候选词条数不得小于1",trigger:"blur"}]}}get colorHintEnabled(){return this.isHintOptionEnabled("color")}get selectHintEnabled(){return this.isHintOptionEnabled("select")}get autoSelectHintEnabled(){return this.isHintOptionEnabled("autoSelect")}get showHintColor(){return this.selectHintEnabled||this.isHintOptionEnabled("code")||this.autoSelectHintEnabled}get punctuationTableHeight(){return window.innerHeight-300}get punctuations(){const e=[];for(const[t,l]of this.form.punctuations)e.push({key:t,value:l});return e}handleCheckAllChange(e){this.form.resultOptions=e?b.map(e=>e.value):["identity","typeSpeed","hitSpeed","codeLength"],this.isIndeterminate=!e}handleCheckedResultChange(e){const t=e.length;this.checkAll=t===this.resultOptions.length,this.isIndeterminate=t>0&&t<this.resultOptions.length}isHintOptionEnabled(e){const{hint:t,hintOptions:l}=this.form;return t&&l.indexOf(e)>=0}loadCodings(e){const t=m["Loading"].service({lock:!0,text:"正在处理词库，需要一些时间，请耐心等待……",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"}),l=new FileReader;l.onload=()=>{const e=Object(r["b"])(l.result);if(this.form.addToCodings)for(const[t,l]of this.form.punctuations)e.put(t,l,-1);e.sort(),s["a"].configs.put(e.root,"codings").then(()=>{this.updateCodings(e.root),t.close(),this.$message({message:"码表处理完成",type:"success",showClose:!0})})},l.readAsText(e.raw)}deletePunctuation(e,t,l){l.splice(e,1),this.form.punctuations.delete(t.key)}addPunctuation(e){this.punctuationIndex=e,this.punctuationFormVisiable=!0}submitPunctuationForm(){const e=this.$refs.punctuationTable.data;e.splice(this.punctuationIndex+1,0,this.punctuationForm),this.form.punctuations=new Map(e.map(e=>[e.key,e.value])),this.punctuationFormVisiable=!1}submitForm(){this.$refs.settingForm.validate(e=>{if(!e)return this.$message({message:"检验失败",type:"warning",showClose:!0,duration:5e3}),!1;s["a"].configs.put(this.form,"setting").then(()=>{this.$message({message:"保存成功",type:"success",showClose:!0}),this.updateSetting(this.form)})})}setToDefault(){this.form=new c["j"]}resetForm(){Object.assign(this.form,this.setting)}created(){this.resetForm()}handleCodingDownload(e){console.log("coding type: ",e),this.isCodingLoading=!0,fetch("/static/codings.txt").then(e=>e.text()).then(e=>{const t=Object(r["b"])(e);for(const[l,o]of f["a"])t.put(l,o,-1);t.sort(),s["a"].configs.put(t.root,"codings").then(()=>{this.updateCodings(t.root),this.$notify({title:"编码提示加载成功",message:"『虎码单字』编码提示加载成功",type:"success"}),this.isCodingLoading=!1})}).catch(()=>{this.isCodingLoading=!1})}};Object(n["a"])([p.State("loaded")],h.prototype,"loaded",void 0),Object(n["a"])([p.Getter("state")],h.prototype,"setting",void 0),Object(n["a"])([p.Mutation("update")],h.prototype,"updateSetting",void 0),Object(n["a"])([Object(u["a"])("updateCodings")],h.prototype,"updateCodings",void 0),Object(n["a"])([Object(i["d"])("loaded")],h.prototype,"resetForm",null),h=Object(n["a"])([i["a"]],h);var v=h,g=v,x=(l("a0f3"),l("2877")),k=Object(x["a"])(g,o,a,!1,null,null,null);t["default"]=k.exports},a0f3:function(e,t,l){"use strict";l("cbd2")},cbd2:function(e,t,l){}}]);