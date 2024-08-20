import { defineStore } from 'pinia'

export interface GlobalState {
  opNames: { [key: string]: boolean }
  requestNumber: number
  error: {
    status: boolean
    message?: string
  }
}

export const useGlobalStore = defineStore({
  id: 'global',
  state: (): GlobalState => ({
    opNames: {},
    requestNumber: 0,
    error: {
      status: false,
    },
  }),
  getters: {
    isLoading(state): boolean {
      return state.requestNumber > 0
    },
    isOpLoading:
      state =>
        (opName: string): boolean => {
          return state.opNames[opName]
        },
  },
  actions: {
    startLoading(state: GlobalState, { opName }: { opName: string }): void {
      state.requestNumber++
      if (opName)
        state.opNames[opName] = true
    },
    finishLoading(state: GlobalState, { opName }: { opName: string }): void {
      setTimeout(() => {
        state.requestNumber--
        delete state.opNames[opName]
      }, 1000)
    },
    setError(state: GlobalState, e: any): void {
      state.error = e
    },
  },
})
