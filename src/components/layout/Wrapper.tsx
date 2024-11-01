import { ReactNode } from "react"

const Wrapper:React.FC<{children:ReactNode}> = ({children}) => {
  return (
    <div className="p-6 lg:p-0">{children}</div>
  )
}

export default Wrapper