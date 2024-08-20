import { defineStore } from 'pinia'

export interface UserDataProps {
  username?: string
  id?: string
  phoneNumber?: string
  nickName?: string
  description?: string
  updatedAt?: string
  createdAt?: string
  iat?: number
  exp?: number
  picture?: string
  gender?: string
}

export interface UserProps {
  isLogin: boolean
  data: UserDataProps
  token?: string
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserProps => ({
    isLogin: false,
    data: {
      nickName: 'lego',
    },
    token: '',
  }),
  actions: {},
})
