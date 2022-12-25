(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{e4bb:function(n,t,e){"use strict";e.r(t);var s=function(){var n=this,t=n._self._c;n._self._setupProxy;return t("div",{attrs:{id:"home"}},[t("el-container",[t("el-aside",{attrs:{width:"200px"}},[t("IndicatorSimple")],1),t("el-main",{style:n.styles,attrs:{id:"home-main"}},[t("div",[t("el-row",[t("el-col",{attrs:{span:24}},[t("Achievements")],1)],1)],1)])],1)],1)},a=[],o=e("9ab4"),i=e("1b40"),c=function(){var n=this,t=n._self._c;n._self._setupProxy;return t("div",{attrs:{id:"indicator"}},[t("el-card",{attrs:{shadow:"never"}},[t("div",{staticClass:"key-value"},[t("span",[n._v("今日字数")]),t("span",[n._v(n._s(n.todayWords))])]),t("div",{staticClass:"key-value"},[t("span",[n._v("总字数")]),t("span",[n._v(n._s(n.totalWords))])]),t("div",{staticClass:"key-value"},[t("span",[n._v("连续天数")]),t("span",[n._v(n._s(n.consecutiveDays))])]),t("div",{staticClass:"key-value"},[t("span",[n._v("总天数")]),t("span",[n._v(n._s(n.consecutiveDays))])])])],1)},r=[],l=e("4bb5");const d=Object(l["d"])("summary");let p=class extends i["c"]{get version(){return"0.0.1"}};Object(o["a"])([d.Getter("todayWords")],p.prototype,"todayWords",void 0),Object(o["a"])([d.Getter("totalWords")],p.prototype,"totalWords",void 0),Object(o["a"])([d.Getter("consecutiveDays")],p.prototype,"consecutiveDays",void 0),Object(o["a"])([d.Getter("totalDays")],p.prototype,"totalDays",void 0),p=Object(o["a"])([i["a"]],p);var u=p,v=u,h=e("2877"),m=Object(h["a"])(v,c,r,!1,null,null,null),b=m.exports,y=e("4c64");let _=class extends i["c"]{};_=Object(o["a"])([Object(i["a"])({components:{IndicatorSimple:b,Achievements:y["a"]}})],_);var x=_,w=x,g=Object(h["a"])(w,s,a,!1,null,null,null);t["default"]=g.exports},f820:function(n,t,e){"use strict";e.r(t);var s=function(){var n=this,t=n._self._c;n._self._setupProxy;return t("div",{staticClass:"markdown-body",domProps:{innerHTML:n._s(n.html)}})},a=[],o=e("9ab4"),i=e("1b40"),c="# 木易跟打器 {{ version }}\n\n自己是个五笔爱好者，也一直在使用五笔，曾经(差不多10年前了)也做过Windows平台的跟打器[易跟打](https://github.com/owenyang0/FollowTyperAndSender)；从 `Windows` 转到 `Mac` 之后，没有可用的跟打器，一直想有个能在 `macOS` 上运行的跟打器。\n偶然看到了[QT](https://gitee.com/hotleave/quick-typing)基于他们的代码做一个`macOS`上可用的跟打器，然后便有了这个项目。\n\n\n程序设计上借鉴了以下产品，在此表示感谢（排名不分先后）：\n\n- [长流跟打器](https://cl.tyu.wiki/)\n- [玫枫跟打器](https://kylebing.cn/tools/typepad/)\n- [三码郑码](https://www.yuque.com/smzm/zhengma/el4l0a)\n\n## Contributing\n\n- 有问题，提个[Issue](https://gitee.com/hotleave/quick-typing/issues)\n- 有想法，提个[Issue](https://gitee.com/hotleave/quick-typing/issues)\n- 或[QQ联系我](tencent://Message/?Uin=81493192&websiteName=hotleave.gitee.io&Menu=yes)\n- 有能力，提个[PR](https://gitee.com/hotleave/quick-typing/pulls)\n\n## 声明\n\n1. 本程序系私人用途，非商业产品，即不提供相应的服务\n1. 本程序所有数据均保存在用户浏览器的[IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)中，**不会上传到任何服务器**\n1. 如果有侵权行为，请联系：hotleave@gmail.com，会在看到后第一时间取消\n1. 用户使用本程序所引发的一切问题，由用户自己承担，本程序概不负责\n1. **使用本程序则旨在接受本条及以上条款**\n\n## 主要功能\n\n- [x] 赛文跟打\n- [x] 词语提示\n- [x] 小拆账号登录及群赛文加载\n- [ ] 内置常用字及文章\n- [ ] 文件载文\n- [ ] 速度练习\n- [ ] 词库练习\n- [ ] 看打模式\n\n## 浏览器要求\n\n> 在`Chrome`及`Safari`最新版本下测试通过，`Edge`未经过测试\n> **不支持`IE`**\n\n- 支持[IndexedDB](https://caniuse.com/indexeddb)\n- 支持[clipboard.writeText](https://caniuse.com/mdn-api_clipboard_writetext)\n- 支持[clipboard.readText](https://caniuse.com/mdn-api_clipboard_readtext)\n\n## 快速上手\n\n- 复制要打的文字\n- 到主页面粘贴\n- 开始打字\n\n## 操作说明\n\n### 快捷键\n\n- `Ctrl` + `v`：从剪切板载文（Mac下为`Cmd` + `v`，与粘贴快捷键一致）\n- `F3`：重打\n- `Esc`：暂停\n- `Enter`: 继续\n\n### 小拆账号登录\n\n账号是 QQ 号，在有小拆的群内发过言，或和小拆私聊过，均会在机器人小拆（接口）里创建账号。\n\n密码可以通过私聊小拆发送「密码xxx」设置，长度需要在 8 位以上。虽然可以，但是我们不建议你使用常见密码。\n\n登录状态会保存，直到主动退出登录。\n\n> 不登录只会影响在线载文功能，不影响其他任何功能\n\n### 载文\n\n#### 在线载文\n\n登录小拆帐号后，会显示登录账号已加入的打字群，选择其中一个即可自动加载该群的今日赛文\n\n> 小拆目前还不支持在线上传成绩，因此打完赛文后仍需要手动去群里发送成绩\n\n#### 赛文\n\n从QQ群使用指令获取赛文，然后将收到的赛文**整体**复制到剪切板，然后到主页粘贴即可\n\n#### 普通文本\n\n将要打的文本复制到剪切板，然后到主页粘贴即可\n\n### 打文\n\n载文后，下方的输入框自动获取焦点，当按下任**意键**时，开始计时。\n\n打文过程中可以使用`Esc`暂停。暂停后，使用`Enter`继续，按下`Enter`后，输入框自动获取焦点，并立即继续计时。\n\n如果打的过程中，或完成后，对结果不满意，可以按`F3`重新开始。计时会清零，并等待第一个键按下后，再次开始计时。\n\n如果赛文较长，而对照文本区域无法完全显示，那么在打文过程中，对照文本会自动根据输入进度移动滚动条，方便跟打。\n\n如果在打文时输入错误的字词，会以指定颜色的背景（默认是红色）显示。\n\n跟打时，必须将赛文**全部输入正确**才会停止计时，如果发现打完最后一个字时，并没有提示完成，计时还在继续，则需要到对照文本中查找被标成错误背景的字词并加以修正，直至全部正确。\n\n#### 词语提示\n\n程序提供词语提示功能，方便前期掌握词库中的词语。\n\n在词语提示功能打开时，程序会将赛文中的词语去词库中匹配，并计算出**码长最短**的一个组合，这个码长就是理论码长。\n\n开始输入后，如果没按词语提示的内容输入，那么提示的内容会同时进行调整，提示从当前位置开始的码长最短的组合。\n\n基础的词语提示以间隔加粗的方式展示，如：“这个**码长**短”。在此基础上，还提供：\n\n- 码长提示：用不同的颜色（不是背景颜色）来区分1，2，3，4码的字词。\n- 选重提示：在需要选重的字词下方增加下划线，并在下划线下方显示选重键。如果某个字词不需要选重，则下方什么都不显示。\n- 编码提示：在字词下方显示该字词的编码（不含选重键）。除了该方式外，界面右上角也有编码及选重键的提示。\n- 标点顶屏：在可以使用标点顶屏的字词下显示顶屏提示（默认是“顶”字），如果某个首选字词后是标点，则可以利用标点直接将首选上屏，这样可以减少1码。\n\n> 词语提示需要上传码表后才可以使用，具体见设置中的相关内容\n\n### 发送成绩\n\n输入结束后，成绩会**自动**复制到系统剪切板，到获取赛文的QQ群粘贴发送即可\n\n### 查看理想编码\n\n程序能根据词库中的词条计算出理想码长，也可以计算出该码长对应的编码。点击左侧面板中的`理想`二字，即可查看理想编码对应的编码。\n\n### 查看录入的编码\n\n程序会记录打文过程中按下的每一个按键，点击左侧面板中的`码长`二字，即可查看打文过程中按下的所有按键。\n\n## 设置\b\n\n> 设置中的变更，除了上传码表文件会自动保存外，其余的变动均需手动点击下方的”保存按钮进行保存\n\n- `保存`: 将变更写入数据库\n- `重置`：恢复设置到数据库中的状态\n- `恢复默认`: 将所有设置恢复到默认状态\n\n### 基础设置\n\n- `自动重新开始`：当删除输入的所有文字后自动重新开始\n- `结束条件`: 赛文结束的条件，默认为赛文中所有的字及标点都正确时结束。`打完`则比较赛文和输入的长度，一致就认为结束。但在结束时如果输入的内容中有错字，则每错一个字罚5个字，会导致速度降低\n\n### 词提设置\n\n- `词语提示`: 总开关，关闭时不会进行词语提示，默认关闭\n- `码表文件`: 输入法使用的码表文件，文件使用`多多格式`，`UTF-8`编码，如：\n\n  ```tsv\n  五  pf\n  五笔    pfr\n  笔  rkq\n  ```\n\n- `提示选项`：选择提示内容，`词语`是必选的。\n- `候选词条数`: 输入法每页候选词条数，对于需要翻页的字词，会的选重提示上增加`翻页键`。默认：9\n- `最大候选词位置`：为避免某些生僻词位置过去靠后，可以通过设置该值，将位置过于靠后的词略掉，拆成位置更靠前一些的短词或单字。该设置可能会影响码长。默认：0\n- `翻页键`：指定的词条位置比较靠后，需要翻页才能选择时，会在选重码提示上增加该符号。只需要指定提示的符号，方便自己识别，即使输入法设置了多组翻页键。默认：+\n- `选重键`：提示时展示的选重键。每个字符表示一个选重键，字符数不得少于`候选词条数`。默认：`␣23456789`\n- `选重键文本`：选重键对应的文本，当这些字符出现在字词后面时，**必须**手动选择词条。默认：` 234567890;+'＋；’`\n- `标点顶屏提示`: 顶屏提示符号\n- `四码唯一自动上屏`：如题\n- `第五码首选上屏`：如题\n\n### 成绩设置\n\n- 标识：赛文标识，如`第999段`\n- 速度：每分钟输入的字数，数值越大说明打字的速度越快\n- 击键：每秒钟敲击按键的次数\n- 码长：平均每个字（含标点符号）所需要的按键次数\n- 理想码长：程序计算出的最短码长\n- 字数：文章总字数\n- 错字：结束时输入的错字数\n- 用时：总时间，单位秒\n- 暂停：打文时暂停的次数和总暂停时长\n- 键准：按键准确率，退格数及回改数作为失误按键来源，算法：`(总按键数 - 退格数 - 回改数 * 平均码长) / 总按键数`\n- 键法：左手与右手按键数的均衡性，算法：`(1 - abs(左 - 右) / (左 + 右)) * 100`\n- 左：左手按键次数\n- 右：右手按键次数\n- 打词：有多少字是通过词组的方式输入的\n- 打词率：打词数占总字数的比率\n- 选重：要输入的字词不在首选位置的次数\n- 回改：输入错误被删除的字数\n- 键数：总按键次数\n- 退格：退格键被按次数\n- 回车：回车键被按次数\n- 重打：重新打的次数\n- 版本：版本信息\n- 输入法：所使用的输入法名称\n- 个性签名：想立的Flag\n- 哈希码: [小拆][xiaochai]的哈希码，用于获取小拆积分\n\n### 标点设置\n\n- `标点用于`\n  - 顶屏计算：仅用于顶屏计算，不将标点加入码表\n  - 码表及顶屏计算：将标点加入码表，防止码表中的标点码长过长\n\n> 如果需要将标点加入码表，则需要重新导入词库文件\n\n### 载文设置\n\n- `去除空格`: 移除文章中的所有空白字符，包括：空格、回车、换行、制表符等\n\n[xiaochai]: https://xc.cool/\n",r=e("339e"),l=e.n(r);const d=new l.a.Converter;d.setOption("tables",!0),d.setOption("tasklists",!0);let p=class extends i["c"]{constructor(){super(...arguments),this.version="0.0.1"}get html(){return d.makeHtml(c.replace("{{ version }}",this.version))}};p=Object(o["a"])([i["a"]],p);var u=p,v=u,h=e("2877"),m=Object(h["a"])(v,s,a,!1,null,null,null);t["default"]=m.exports}}]);