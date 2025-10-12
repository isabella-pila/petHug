import { TouchableOpacityProps, TouchableOpacity, Text, View } from 'react-native'
import { styles } from './styles'
import {ReactNode} from 'react'
interface IBInterface extends TouchableOpacityProps {
  title?: string
  type?: 'primary' | 'secondary' | 'third' | 'danger'
  children?: ReactNode
}
export function ButtonInterface({ title, type = 'primary', children, ...rest }: IBInterface) {
  return (
    // <TouchableOpacity style={
    //   type == "primary" ? styles.buttonPrimary :
    //     type == "secondary" ? styles.buttonSecondary :
    //       styles.buttonThird
    // }
    <TouchableOpacity style={[styles.base, styles[type]]}
      {...rest}
    >
      <View style={styles.contentRow}>
        {children ? children : <Text style={styles.text}>{title}</Text>}
      </View>
    </TouchableOpacity>
  )
}

// Implementação do subcomponente
const Icon: React.FC<{children: ReactNode}> = ({ children }) => {
  return <View style={[styles.iconContainer]}>{children}</View>;
};

ButtonInterface.Icon = Icon;