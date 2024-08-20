import { mapValues, without } from 'lodash-es'

export interface CommonComponentProps {
  actionType: string
  url: string

  height: string
  width: string
  paddingLeft: string
  paddingRight: string
  paddingTop: string
  paddingBottom: string

  borderStyle: string
  borderColor: string
  borderWidth: string
  borderRadius: string

  boxShadow: string
  opacity: string

  position: string
  left: string
  top: string
  right: string
}

export interface TextComponentProps extends CommonComponentProps {
  text: string
  fontSize: string
  fontFamily: string
  fontWeight: string
  fontStyle: string
  textDecoration: string
  lineHeight: string
  textAlign: string
  color: string
  backgroundColor: string
}

export interface ImageComponentProps extends CommonComponentProps {
  src: string
}

export interface ShapeComponentProps extends CommonComponentProps {
  backgroundColor: string
}

export type AllComponentProps = TextComponentProps &
  ImageComponentProps &
  ShapeComponentProps &
  CommonComponentProps

export const commonDefaultProps: CommonComponentProps = {
  actionType: '',
  url: '',

  height: '',
  width: '373px',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',

  borderStyle: 'none',
  borderColor: '#000000',
  borderWidth: '0',
  borderRadius: '0',

  boxShadow: '0 0 0 #000000',
  opacity: '1',

  position: 'absolute',
  left: '120px',
  top: '240px',
  right: '0',
}

export const textDefaultProps: TextComponentProps = {
  text: '正文内容',
  fontSize: '14px',
  fontFamily: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'center',
  color: '#000000',
  backgroundColor: '',
  ...commonDefaultProps,
}

export const imageDefaultProps: ImageComponentProps = {
  src: '',
  ...commonDefaultProps,
}

export const shapeDefaultProps: ShapeComponentProps = {
  backgroundColor: '',
  ...commonDefaultProps,
}

export const isEditingProp = {
  isEditing: {
    type: Boolean,
    default: false,
  },
}

// _.without(array, [values]) 创建一个剔除所有给定值的新数组
// eg:
// _.without([2, 1, 2, 3], 1, 2);
// => [3]
export const textStylePropNames = without(
  Object.keys(textDefaultProps),
  'actionType',
  'url',
  'text',
)

export const imageStylePropsNames = without(
  Object.keys(imageDefaultProps),
  'src',
)

export const shapeStylePropsNames = without(
  Object.keys(shapeDefaultProps),
  'actionType',
  'url',
)

// _.mapValues(object, [iteratee=_.identity])
// 创建一个对象，这个对象的key与object对象相同，值是通过 iteratee 运行 object 中每个自身可枚举属性名字符串产生的。 iteratee调用三个参数： (value, key, object)。
// eg:
// var users = {
//   'fred':    { 'user': 'fred',    'age': 40 },
//   'pebbles': { 'user': 'pebbles', 'age': 1 }
// };
// _.mapValues(users, function(o) { return o.age; });
// => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
export function transformToComponentProps<T extends object>(props: T) {
  const mapProps = mapValues(props, (item) => {
    return {
      type: (item as any).constructor as StringConstructor,
      default: item,
    }
  })
  return { ...mapProps, ...isEditingProp }
}

export const textComponentProps = transformToComponentProps(textDefaultProps)

export const imageComponentProps = transformToComponentProps(imageDefaultProps)

export const shapeComponentProps = transformToComponentProps(shapeDefaultProps)
