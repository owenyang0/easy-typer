import dayjs from 'dayjs'
import { KataState } from '../types'
import db from './Database'

const KATA_HISTORY = 'kataHistory'

export type KataHistoryState = KataState & {
  timestamp: string;
  type: string;
  icon: string;
  paragraphCount: number;
  color?: string;
  size?: string;
}

class KataHistory {
  async loadHistoryByTitle (title: string) {
    return db.configs.get(KATA_HISTORY).then((histories) => {
      const his = histories as KataState[] || []

      const currHis = his.find(h => h.articleTitle === title)

      return currHis
    })
  }

  async loadHistoryList () {
    return db.configs.get(KATA_HISTORY).then((histories) => {
      const his = histories as KataHistoryState[] || []
      return his
    })
  }

  insertOrUpdateHistory (state: KataState) {
    const updatedState = {
      ...state,
      type: 'primary',
      icon: 'el-icon-odometer',
      timestamp: dayjs().format('YYYY/MM/DD HH:mm:ss'),
      paragraphCount: state.textType === 2 ? state.articleText.split('\n').length : Math.ceil(state.articleText.length / state.paragraphSize)
    }
    db.configs.get(KATA_HISTORY).then((histories) => {
      const his = histories as KataHistoryState[] || []

      const newHis = [updatedState].concat(his.filter(h => h.articleTitle !== state.articleTitle)).slice(0, 10)

      db.configs.put(newHis, KATA_HISTORY)
    })
  }
}

export const kataHistory = new KataHistory()
