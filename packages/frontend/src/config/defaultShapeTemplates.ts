import { shapeDefaultProps } from '@/components/Lego/defaultProps'

const defaultShapeTemplates = [
  {
    backgroundColor: 'rgb(239, 239, 239)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgb(204, 204, 204)',
    height: '50px',
    width: '100px',
  },
  {
    backgroundColor: 'rgb(239, 239, 239)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgb(204, 204, 204)',
    borderRadius: '100px',
    height: '100px',
    width: '100px',
  },
  {
    backgroundColor: 'rgb(239, 239, 239)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgb(204, 204, 204)',
    height: '100px',
    width: '100px',
  },
  {
    backgroundColor: 'rgb(54, 207, 201)',
    borderWidth: '0px',
    borderStyle: 'solid',
    borderColor: 'rgb(204, 204, 204)',
    height: '50px',
    width: '100px',
  },
  {
    backgroundColor: 'rgb(64, 169, 255)',
    borderWidth: '0px',
    borderStyle: 'solid',
    borderColor: 'rgb(0, 0, 0)',
    borderRadius: '100px',
    height: '100px',
    width: '100px',
  },
  {
    backgroundColor: 'rgb(146, 84, 222)',
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: 'rgb(204, 204, 204)',
    height: '100px',
    width: '100px',
  },
]

export default defaultShapeTemplates.map(template => ({
  ...shapeDefaultProps,
  ...template,
}))
