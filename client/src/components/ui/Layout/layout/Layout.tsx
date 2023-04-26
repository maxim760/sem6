import { Container, Toolbar } from '@mui/material'
import {FC, PropsWithChildren} from 'react'
import { useTitle } from 'src/utils/hooks/common/useTitle'
import { FCWithChildren } from 'src/utils/types/types'
import { Header } from '../header/Header'

type IProps = {
  hideHeader?: boolean,
  title: string,
  children?: React.ReactNode | React.ReactNode[]
}

export const Layout: FC<IProps> = ({children, hideHeader, title}) => {
  useTitle(title)
  return (
    <>
      {!hideHeader && <Header />}
      <Container maxWidth="xl" component="main" sx={{py: "8px", minHeight: "100%", display: "flex", flexDirection: "column"}}>  
        {!hideHeader && <Toolbar variant='dense' />}
        {children}
      </Container>
    </>
  )
}