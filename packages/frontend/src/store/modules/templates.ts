import { defineStore } from 'pinia'
import type { PageData } from './editor'

export type TemplateProps = Required<Omit<PageData, 'props' | 'setting'>>

export interface TemplatesProps {
  data: TemplateProps[]
  totalTemplates: number
  works: TemplateProps[]
  totalWorks: number
}

export const useTemplatesStore = defineStore({
  id: 'templates',
  state: (): TemplatesProps => ({
    data: [],
    totalTemplates: 0,
    works: [],
    totalWorks: 0,
  }),
})
