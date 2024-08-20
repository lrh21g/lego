import { computed } from 'vue'
import { pick } from 'lodash-es'

import type { AllComponentProps } from '@/components/Lego/defaultProps'

// _.pick(object, [props]) 创建一个从 object 中选中的属性的对象。
// eg:
// var object = { 'a': 1, 'b': '2', 'c': 3 };
// _.pick(object, ['a', 'c']);
// => { 'a': 1, 'c': 3 }

// Partial<Type>返回一个新类型，将参数类型 Type 的所有属性变为可选属性。
// Readonly<Type>返回一个新类型，将参数类型 Type 的所有属性变为只读属性。

/**
 * 提取组件的特定属性
 *
 * @param props 组件属性对象，包含 AllComponentProps 和 isEditing 属性
 * @param picks 需要被提取的属性名数组
 * @returns 返回一个组件特定属性和 handleClick 属性的对象
 */
function useComponentCommon(
  props: Readonly<Partial<AllComponentProps & { isEditing: boolean }>>,
  picks: string[],
) {
  const styleProps = computed(() => pick(props, picks))
  const handleClick = () => {
    if (props.actionType === 'url' && props.url)
      window.location.href = props.url
  }

  return { styleProps, handleClick }
}

export default useComponentCommon
