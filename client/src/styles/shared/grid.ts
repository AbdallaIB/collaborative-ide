import styled from 'styled-components'

const media = {
  xs: (styles: any) => `
		@media only screen and (min-width: 0) {
			${styles}
		}
	`,
  sm: (styles: any) => `
		@media only screen and (min-width: 480) {
			${styles}
		}
	`,
  md: (styles: any) => `
		@media only screen and (min-width: 720) {
			${styles}
		}
	`,
  lg: (styles: any) => `
		@media only screen and (min-width: 960) {
			${styles}
		}
	`,
  xl: (styles: any) => `
		@media only screen and (min-width: 1200) {
			${styles}
		}
	`,
}

export interface RowProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
}

export interface ColProps {
  size: number
  collapse?: string
}

export const Grid = styled.div``
export const Row = styled.div<RowProps>`
  display: flex;
  flex-direction: ${(props) => (props.direction ? props.direction : 'row')};
`
export const Col = styled.div<ColProps>`
  flex: ${(props) => props.size};
  ${(props) =>
    props.collapse &&
    media[props.collapse as keyof typeof media](`
		display: none;
	`)}
`
