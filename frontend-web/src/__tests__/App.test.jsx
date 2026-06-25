import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renderiza o título "Get started"', () => {
    render(<App />)
    expect(screen.getByText('Get started')).toBeInTheDocument()
  })

  it('mostra o contador iniciando em 0', () => {
    render(<App />)
    expect(screen.getByText(/Count is 0/i)).toBeInTheDocument()
  })

  it('incrementa o contador ao clicar no botão', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })
    fireEvent.click(button)
    expect(screen.getByText(/Count is 1/i)).toBeInTheDocument()
  })

  it('incrementa múltiplas vezes corretamente', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)
    expect(screen.getByText(/Count is 3/i)).toBeInTheDocument()
  })

  it('renderiza o texto de instrução HMR', () => {
    render(<App />)
    expect(screen.getByText(/Edit/i)).toBeInTheDocument()
  })
})
