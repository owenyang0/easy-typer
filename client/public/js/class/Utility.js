define(function () {
   const RECORD_DISPLAY_ACCURACY = 2 // 显示的成绩小数点精度
   /**
    * 数组乱序算法
    * @param arr
    * @return {*}
    */
   function shuffle(arr) {
      let length = arr.length,
         r = length,
         rand = 0;

      while (r) {
         rand = Math.floor(Math.random() * r--);
         [arr[r], arr[rand]] = [arr[rand], arr[r]];
      }
      return arr;
   }

   /**
    * 格式化时间，输出字符串
    * @param   date    要格式化的时间
    * @param   formatString    返回时间的格式：
    * @return  格式化后的时间字符串
    * */
   function dateFormatter (date, formatString) {
      formatString = formatString? formatString : 'yyyy-MM-dd hh:mm:ss';
      let dateRegArray = {
         "M+": date.getMonth() + 1,                      // 月份
         "d+": date.getDate(),                           // 日
         "h+": date.getHours(),                          // 小时
         "m+": date.getMinutes(),                        // 分
         "s+": date.getSeconds(),                        // 秒
         "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
         "S": date.getMilliseconds()                     // 毫秒
      };
      if (/(y+)/.test(formatString)) {
         formatString = formatString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (let section in dateRegArray) {
         if (new RegExp("(" + section + ")").test(formatString)) {
            formatString = formatString.replace(RegExp.$1, (RegExp.$1.length === 1) ? (dateRegArray[section]) : (("00" + dateRegArray[section]).substr(("" + dateRegArray[section]).length)));
         }
      }
      return formatString;
   }
   /**
    * @param：timeLeft 倒计时秒数
    * @return：输出倒计时字符串 时时:分分:秒秒
    **/
   function formatTimeLeft(timeLeft){
      timeLeft = Math.floor(timeLeft / 1000);
      let mins = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      return `${mins.toString().padStart(2,'00')}:${seconds.toString().padStart(2,'00')}`;
   }

   // 抖动 dom 元素
   function shakeDom(dom){
      let animateClass = 'shake';
      dom.classList.add('animated');
      dom.classList.add(animateClass);
      setTimeout(()=>{
         dom.classList.remove('animated')
         dom.classList.remove(animateClass)
      }, 250)
   }

   function parseContent (content) {
      const contentArr = content.split('\n');
      const length = contentArr.length;
      if (length !== 3) {
         console.log('数据错误')
         return {
            title: '数据错误',
            content: '数据错误',
            paragraphNO: 1
         }
      }

      const reg = /^\-{5}第(\d+)?段/;

      const no = reg.test(contentArr[2]) ? contentArr[2].match(reg)[1] : 1
      
      return {
         title: contentArr[0],
         content: contentArr[1],
         paragraphNO: no
      }
   }

   function putGradeToClipboard (result, keyCount) {
      const correctionRatio = ((result.wordCount - keyCount.backspace) / result.wordCount * 100).toFixed(2)
      const grade = `第${result.identity || 1}段 速度${result.speed} 击键${result.hitRate} 码长${result.codeLength} 字数${result.wordCount} 键准${correctionRatio}% 退格${keyCount.backspace} 键数${keyCount.all} 易v0.1`
      console.log(grade)
      navigator.clipboard.writeText(grade);
   }

   return {
      formatTimeLeft, shuffle, dateFormatter, shakeDom, parseContent, putGradeToClipboard,
      RECORD_DISPLAY_ACCURACY
   }
})
