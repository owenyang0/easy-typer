import * as crypto from 'crypto'
import axios, { AxiosResponse } from 'axios'
import { LoginState } from '@/store/types'
import { HistoriesResponse, KataOption, KataOptions, NewsResponse } from '@/models/articleModels'
import { wikiTypeMap, wikiTypes } from './constant'

const HASH_KEY = '3198f2e6892d5bdd0630505e20acfc849a12e03c5a1da4c5c41a180c44c67eeb85ef0bc6992d9b0c3926da22ebaa55346bcd76d8556321e044530eff3d868e2636514072'

const axiosInstance = axios.create({
  baseURL: '/',
  responseType: 'json'
})
axiosInstance.interceptors.request.use((config) => {
  const signature = window.etg && window.etg.e(config)

  // 把签名添加到请求头中
  config.headers['X-Etsig'] = signature
  // 返回新的请求配置
  return { ...config, headers: config.headers }
})

axiosInstance.interceptors.response.use(response => {
  const { data } = response

  if (data.code === 0) {
    return data.data
  } else {
    return Promise.reject(new Error(data.msg))
  }
}, error => Promise.reject(error))

axios.defaults.baseURL = '/'
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

// const HASH_KEY = '3198f2e6892d5bdd0630505e20acfc849a12e03c5a1da4c5c41a180c44c67eeb85ef0bc6992d9b0c3926da22ebaa55346bcd76d8556321e044530eff3d868e2636514072'
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

const baseRequest = (api: string) => {
  return fetch(api)
    .then(res => res.json())
    .then(ret => {
      if (ret.code === 0) {
        return ret.data
      }
      throw Error(ret.msg)
    })
}

const getRandomArticle = (): Promise<NewsResponse> => {
  return axiosInstance.get('/api/r/articles/random')
}

const getTodayArticle = (): Promise<NewsResponse> => {
  return axiosInstance.get('/api/r/articles/today')
}

const getWikiByType = (type: keyof typeof wikiTypes): Promise<NewsResponse> => {
  return axiosInstance.get(wikiTypeMap[type].api)
}

const getTodayHistories = (): Promise<HistoriesResponse[]> => {
  return axiosInstance.get('/api/r/histories/today')
}

const getKataList = (): Promise<KataOptions[]> => {
  return axiosInstance.get('/api/r/kata/list')
}

const getKataOptionById = (id: number): Promise<KataOption> => {
  return axiosInstance.get(`/api/r/kata/option/${id}`)
}

const getSingleFront500 = () => {
  return getKataOptionById(44)
}

const getSingleMiddle500 = () => {
  return getKataOptionById(45)
}

const getSingleEnd500 = () => {
  return getKataOptionById(46)
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
  getWikiByType,
  getKataList,
  getTodayHistories,
  getKataOptionById,
  getSingleFront500,
  getSingleMiddle500,
  getSingleEnd500
}

export default eapi
