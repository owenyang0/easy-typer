import * as crypto from 'crypto'
import axios, { AxiosResponse } from 'axios'
import { LoginState } from '@/store/types'

axios.defaults.baseURL = 'https://api.xc.cool/api'
axios.defaults.responseType = 'json'
axios.interceptors.response.use(response => {
  const { data } = response
  if (data.success && data.code === 0) {
    return response.data.data
  } else {
    return Promise.reject(new Error(data.msg))
  }
}, error => Promise.reject(error))

export interface Group {
  id: number;
  guid: number;
  name: string;
  role: string;
  member_count: number;
  max_member_count: number;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: number;
  status: number;
  type: number;
  started_at: string;
  limited_at: string;
  ended_at: string;
  mode: number;
  title: string;
  subtitle: string;
  content: string;
  number: string;
  period: string;
  hash: string;
  created_at: string;
  updated_at: string;
}

const updateToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}

const login = (data: { username: string; password: string }): Promise<LoginState> => {
  return axios.post('/login', data)
}

const logout = (): Promise<AxiosResponse> => {
  return axios.post('/logout')
}

const groups = (): Promise<Array<Group>> => {
  return axios.get('/groups').then(response => {
    return (response.data as Array<Group>).filter(v => v.role !== 'unjoined')
  })
}

const matches = (guid: string): Promise<Match> => {
  return axios.get('/matches', {
    params: { guid, status: 1 }
  }).then(response => {
    if (!response || !response.data || response.data.length === 0) {
      return Promise.reject(new Error('没有赛文'))
    }

    return response.data[0]
  })
}

const HASH_KEY = '3198f2e6892d5bdd0630505e20acfc849a12e03c5a1da4c5c41a180c44c67eeb85ef0bc6992d9b0c3926da22ebaa55346bcd76d8556321e044530eff3d868e2636514072'
const HASH_ALG = 'sha1'
const ENCODING = 'hex'

const hashKey = ((): number => {
  const keys = []
  const ivs = []
  const encrypteds = []
  const indices = HASH_KEY.substr(-8).split('').map(s => parseInt(s))
  for (let i = 0; i < indices.length; i++) {
    const s = indices[i]
    const segment = HASH_KEY.substr(i * 16, 16)
    if (s < 4) {
      keys[s] = segment
    } else if (s > 5) {
      encrypteds[s - 6] = segment
    } else {
      ivs[s - 4] = segment
    }
  }

  const decipher = crypto.createDecipheriv('aes-256-cbc',
    Buffer.from(keys.join(''), ENCODING),
    Buffer.from(ivs.join(''), ENCODING))

  decipher.update(encrypteds.join(''), ENCODING)
  const decrypted = decipher.final()

  return decrypted.readInt32BE(0)
})()

const sha1Hmac = (input: string): string => {
  const hmac = crypto.createHmac(HASH_ALG, hashKey.toFixed(0))
  const hash = hmac.update(input).digest(ENCODING)
  return hash.substr(-8)
}

const verify = (content: string, sign: string): boolean => {
  const matched = /^-----第(\d+)段-(\d+)Z-(.+)V--xc.sw.*$/.exec(sign)
  if (!matched) {
    return true
  }

  const id = matched[1]
  const count = matched[2]
  return content.length === parseInt(count) && sha1Hmac(`${content}-${id}`) === matched[3]
}

const getRandomArticle = () => {
  return fetch('/api/r/articles/random')
    .then(res => res.json())
    .then(ret => {
      if (ret.code === 0) {
        return ret.data
      }
      throw Error(ret.msg)
    })
}

const getTodayArticle = () => {
  return fetch('/api/r/articles/today')
    .then(res => res.json())
    .then(ret => {
      if (ret.code === 0) {
        return ret.data
      }
      throw Error(ret.msg)
    })
}

const getTodayNews = () => {
  return fetch('/api/r/news/today')
    .then(res => res.json())
    .then(ret => {
      if (ret.code === 0) {
        return ret.data
      }
      throw Error(ret.msg)
    })
}

const getSingleFront500 = () => {
  return fetch('/static/kata/singleFront500.json')
    .then(res => res.json())
}

const getSingleMiddle500 = () => {
  return fetch('/static/kata/singleMiddle500.json')
    .then(res => res.json())
}

const getSingleEnd500 = () => {
  return fetch('/static/kata/singleEnd500.json')
    .then(res => res.json())
}

export const eapi = {
  updateToken,
  login,
  logout,
  sha1Hmac,
  verify,
  groups,
  matches,
  getRandomArticle,
  getTodayArticle,
  getTodayNews,
  getSingleFront500,
  getSingleMiddle500,
  getSingleEnd500
}

export default eapi
