import { imageDefaultProps } from '@/components/Lego/defaultProps'

const defaultImageTemplates = [
  {
    src: 'http://static.imooc-lego.com/upload-files/logo-white-735536.png',
    width: '150px',
  },
  {
    src: 'http://static.imooc-lego.com/upload-files/logo-black-049885.png',
    width: '150px',
  },
  {
    src: 'http://static.imooc-lego.com/upload-files/528w-0ilmEQMomZ8-108048.png',
    width: '150px',
  },
  {
    src: 'http://static.imooc-lego.com/upload-files/frame-096161.png',
    width: '150px',
  },
  {
    src: 'http://static.imooc-lego.com/upload-files/text-449964.png',
    width: '150px',
  },
  {
    src: 'http://static.imooc-lego.com/upload-files/text2-288504.png',
    width: '150px',
  },
  {
    src: 'http://static.imooc-lego.com/upload-files/money-664239.png',
    width: '150px',
  },
  {
    src: 'http://static.imooc-lego.com/upload-files/bag-904186.png',
    width: '150px',
  },
  {
    src: 'http://static.imooc-lego.com/upload-files/text3-086652.png',
    width: '150px',
  },
  {
    src: 'http://static.imooc-lego.com/upload-files/text4-145592.png',
    width: '150px',
  },
]

export default defaultImageTemplates.map(template => ({
  ...imageDefaultProps,
  ...template,
}))
