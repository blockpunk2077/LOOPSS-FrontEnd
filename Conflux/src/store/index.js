import Vue from 'vue'
import Vuex from 'vuex'
import storage from 'store'
import router from '@/router'
import config from '@/config'
import Api from '@/apis'
import { Web3js } from 'assets/js/web3'
import { loadLanguageAsync } from '@/locales'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Web3js,
    user: '',
    menu: [],
    curLang: config.lang, //中zh-CN 英en-US
    clientWidth: document.documentElement.clientWidth,
    clientHeight: document.documentElement.clientHeight,
    globalLoading: false,
    globalLoadingTip: ''
  },
  mutations: {
    SET_USER: (state, address) => {
      state.user = address
    },
    SET_LANG: (state, lang) => {
      state.curLang = lang
    },
    SET_MENU: (state, menu) => {
      state.menu.splice(0, state.menu.length, ...menu)
    },
    SET_LOADING(state, option = {}) {
      state.globalLoading = option.isShow
      state.globalLoadingTip = option.tip
    },
    SET_SCREEN(state, screenObj){
      state.clientWidth = screenObj.width
      state.clientHeight = screenObj.height
    }
  },
  actions: {
    SetMenu({ commit }, menu){
      commit('SET_MENU', menu)
    },
    //开启全局loading
    ShowLoading({ commit }, tip){
      commit('SET_LOADING', {
        isShow: true,
        tip
      })
    },
    //关闭全局loading
    HideLoading({ commit }){
      commit('SET_LOADING', { isShow: false })
    },
    // 登录
    Login ({ commit }, params) {
      const time = 24 * 60 * 60 * 1000
      const redirect = decodeURIComponent(router.currentRoute.query.redirect || router.currentRoute.path)
      return Api.login()
      .then(res => {
        storage.set('user', res, time)
        commit('SET_USER', res)
        router.push(redirect)
      })
    },
    // 登出
    Logout ({ commit, state }) {
      this.dispatch('ShowLoading')
      return Api.logout()
      .finally(() => {
        commit('SET_USER', '')
        storage.remove('user')
        this.dispatch('HideLoading')
        router.push('/')
      })
    },
    SetScreen({ commit }, screenObj){
      commit('SET_SCREEN', screenObj)
    },
    SetLang({ commit }, lang){
      return new Promise((resolve, reject) => {
        commit('SET_LANG', lang)
        loadLanguageAsync(lang)
      })
    },
  }
})
