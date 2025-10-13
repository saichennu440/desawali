import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../../components/ui/Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Loading button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText('Loading button')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    render(<Button variant="outline">Outline button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-primary-600')
  })

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Disabled button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})