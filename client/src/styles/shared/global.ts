import { createGlobalStyle, ThemeProps } from 'styled-components'

export interface GlobalProps {
  theme: ThemeProps<any>
}

export default createGlobalStyle<GlobalProps>`

    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #root{
        margin: 0;
        padding: 0;
    }

    body{
        font-size: 1rem;
        font-weight: 400;
				margin: 0;
				padding: 0;
    }

    img{
        max-width: 100%;
    }
`
