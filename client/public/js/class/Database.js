const OBJECT_NAME = 'TypingRecord';
const SPEED_GAP   = 30;             // 速度阶梯，每30新增一个颜色

define(['Utility', 'ArticleType'], function (Utility, ArticleType) {
   /**
    * IndexedDB 数据库
    */
   class Database {
      constructor() {
         // INDEX DB
         let request = window.indexedDB.open(DBName);
         request.onsuccess = e =>{
            if (e.returnValue){
               this.db = request.result;
            } else {
            }
         }

         request.onerror = e => {
            console.log(e);
         }

         request.onupgradeneeded = e => {
            if (this.db){
            } else {
               this.db = request.result;
            }
            let objectStore = this.db.createObjectStore(OBJECT_NAME, { keyPath: 'id' });
         }
      }
      // 添加数据
      insert(record, config){
         // 记录当前跟打的重复值，避免 config 被修改，导致产出的记录值不对
         let lastRepeatCount = config.repeatCountCurrent
         let articleName =
             config.isAutoRepeat ?
             config.articleName + ' : ' + config.repeatCountCurrent :
             config.articleName;
         let request = this.db.transaction([OBJECT_NAME], 'readwrite')
            .objectStore(OBJECT_NAME)
            .add({
               id                : config.IDBIndex,
               identity          : record.identity,
               speed             : record.speed,
               codeLength        : record.codeLength,
               hitRate           : record.hitRate,
               backspace         : record.backspace,
               wordCount         : record.wordCount,
               articleIdentifier : config.articleIdentifier,
               articleName       : articleName,
               timeStart         : record.timeStart,
               duration          : record.duration,
               articleType       : config.articleType,
            });
         request.onsuccess = e => {
            console.log('insert data success');
            // 插入最后的数据到顶部
            let tr = document.createElement('tr');
            tr.innerHTML = record.getHtml(config, lastRepeatCount);
            let tbody = $('tbody');
            tbody.insertBefore(tr, tbody.firstChild);

            // RECORD LIST
            let div = document.createElement('div');
            div.classList.add('record-item')
            div.innerHTML = record.getHtmlForRecord(config);
            let recordContainer = $('.record-container');
            recordContainer.insertBefore(div, recordContainer.firstChild);

            // id ++
            config.IDBIndex = config.IDBIndex + 1; config.save();
         }

         request.onerror = e => {
            console.log(e);
            console.log('insert data error')
         }
      }

      // 获取所有数据
      fetchAll(){
         let request = window.indexedDB.open(DBName);
         request.onsuccess = e => {
            if (e.returnValue) {
               let result = request.result;
               let objectStore = this.db.transaction([OBJECT_NAME], 'readwrite').objectStore(OBJECT_NAME);
               let htmlTable = '';
               let htmlRecordList = '';
               let currentCursor = objectStore.openCursor(IDBKeyRange.upperBound(9999), "prev").onsuccess = e => {
                  let cursor = e.target.result;
                  if (cursor) {
                     htmlTable = htmlTable + this.getHtmlWithCursor(cursor);
                     document.querySelector('tbody').innerHTML = htmlTable;

                     // RECORD LIST
                     htmlRecordList = htmlRecordList + this.getHtmlForRecordWithCursor(cursor);
                     document.querySelector('.record-container').innerHTML = htmlRecordList;

                     cursor.continue(); // 移到下一个位置
                  }
               }
            } else {
            }
         };

         request.onerror = e => {
            console.log(e);
         }
      }

      getHtmlWithCursor(cursor){
         let level = Math.floor(cursor.value.speed/SPEED_GAP);
         level = level > 6 ? 6 : level;
         let articleTypeName = ArticleType.getTypeNameWith(cursor.value.articleType);
         let textClass = ArticleType.getTextClassNameOf(cursor.value.articleType)
         return `<tr>  
              <td class="text-center">${cursor.key}</td>
              <td class="text-center">第${cursor.value.identity || 1}段</td>
              <td class="bold galvji speed text-right lv-${level}">${cursor.value.speed.toFixed(Utility.RECORD_DISPLAY_ACCURACY)}</td>
              <td class="hidden-sm">${cursor.value.hitRate.toFixed(Utility.RECORD_DISPLAY_ACCURACY)}</td>
              <td class="hidden-sm">${cursor.value.codeLength.toFixed(Utility.RECORD_DISPLAY_ACCURACY)}</td>
              <td class="hidden-sm">${cursor.value.backspace}</td>
              <td>${cursor.value.wordCount}</td>
              <td class="time">${Utility.formatTimeLeft(cursor.value.duration)}</td>
              <td class="text-center ${textClass}">${articleTypeName}</td>
              <td>${cursor.value.articleName ? cursor.value.articleName : ''}</td>
              <td class="hidden-sm time">${Utility.dateFormatter(new Date(cursor.value.timeStart))}</td>
              <td><button class="btn btn-danger btn-sm" onclick="engine.delete(${cursor.key}, this)" type="button">删除</button></td>
            </tr>`;
      }


      getHtmlForRecordWithCursor(cursor){
         let level = Math.floor(cursor.value.speed/SPEED_GAP);
         level = level > 6 ? 6 : level;
         let articleType = ArticleType.getTypeNameWith(cursor.value.articleType);
         let textClass = ArticleType.getTextClassNameOf(articleType)
         return `<div class="record-item">
               <div class="speed lv-${level}">${cursor.value.speed}</div>
               <div class="meta">
                  <div class="hit-rate">${cursor.value.hitRate}</div>
                  <div class="code-length">${cursor.value.codeLength}</div>
               </div>
            </div>`;
      }


      // 删除一条数据
      delete(id, sender){
         let objectStore = this.db.transaction([OBJECT_NAME], 'readwrite').objectStore(OBJECT_NAME);
         objectStore.delete(id).onsuccess = e => {
            console.log(`delete data ${id} success`);
            sender.parentElement.parentElement.remove();
         };
      }

      getRecordById (id) {
         const objectStore = this.db.transaction([OBJECT_NAME], 'readwrite').objectStore(OBJECT_NAME);
         const objectStoreRequest = objectStore.get(id);
         objectStoreRequest.onsuccess = e => {
            console.log(`get record of ${id} success`);

            const result = objectStoreRequest.result;
            console.log(`${result}`);
{/* <td class="text-center">${config.IDBIndex}</td>                               <! --id-->
              <td class="text-center">第${this.identity}段</td>                               <! --段号-->
              <td class="bold galvji speed text-right lv-${level}">${this.speed.toFixed(Utility.RECORD_DISPLAY_ACCURACY)}</td>       <! --速度-->
              <td class="hidden-sm">${this.hitRate.toFixed(Utility.RECORD_DISPLAY_ACCURACY)}</td>                                    <! --击键-->
              <td class="hidden-sm">${this.codeLength.toFixed(Utility.RECORD_DISPLAY_ACCURACY)}</td>                                 <! --码长-->
              <td class="hidden-sm">${this.backspace}</td>                                  <! --回退-->
              <td>${this.wordCount}</td>                                                    <! --字数-->
              <td class="time">${Utility.formatTimeLeft(this.duration)}</td>                <! --用时-->
              <td class="text-center ${textClass}">${articleTypeName}</td>                  <! --文章类型-->
              <td>${articleName}</td>                                                       <! --文章名称-->
              <td class="hidden-sm">${Utility.dateFormatter(new Date(this.timeStart))}</td> <! --开始时间-->
              <td><button class="btn btn-danger btn-sm" onclick="engine.delete(${config.IDBIndex}, this)" type="button">删除</button>
              <button class="btn btn-danger btn-sm" onclick="engine.getRecordById(${config.IDBIndex}, this)" type="button">复制</button>
              </td> */}
            // 第27476段 速度0.00/426.91 击键14.30 码长2.01 字数97 错字96 用时00:13.633 暂停0次0.000秒 键准74.84% 键法144.93% 左100 右69 理论码长2.97 打词27.84% 选重0 回改6 键数195 退格0 回车0 重打0 哈希d069730d 极速打字通v2.1.4
            Utility.putGradeToClipboard(result);
         }
      }

      // 清除记录
      clear(config){
         let objectStore = this.db.transaction([OBJECT_NAME], 'readwrite').objectStore(OBJECT_NAME);
         let that = this;
         objectStore.clear().onsuccess = e => {
            config.IDBIndex = 1;config.save();
            that.fetchAll();
            location.reload();
         };
      }
   }

   return Database;

})
