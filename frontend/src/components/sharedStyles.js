import styled from 'styled-components'

export const colors = {
  charcoalBrown: '#363732',
  skyAqua: '#53d8fb',
  mayaBlue: '#66c3ff',
  aliceBlue: '#dce1e9',
  softBlossom: '#d4afb9',
}

export const Button = styled.button`
  background: ${colors.skyAqua};
  color: ${colors.charcoalBrown};
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  padding: 0.55rem 1rem;

  &:hover {
    background: ${colors.mayaBlue};
  }
`

export const Input = styled.input`
  background: #fff;
  border: 2px solid ${colors.aliceBlue};
  border-radius: 0.7rem;
  color: ${colors.charcoalBrown};
  font: inherit;
  margin-top: 0.35rem;
  padding: 0.75rem;
  width: min(100%, 22rem);

  &:focus {
    border-color: ${colors.skyAqua};
    outline: none;
  }
`
