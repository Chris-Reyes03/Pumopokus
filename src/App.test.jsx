import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import './i18n'
import App from './App'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let container
let root

beforeEach(() => {
  window.history.pushState({}, '', '/')
  localStorage.clear()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
})

async function renderApp(path = '/') {
  window.history.pushState({}, '', path)
  await act(async () => {
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )
  })
}

describe('app smoke test', () => {
  it('renders the timer and the study guide', async () => {
    await renderApp()
    expect(container.textContent).toContain('25:00')
    expect(container.textContent).toContain('Pomodoro')
    expect(container.textContent).toContain('Read the study guide')
    expect(container.textContent).toContain('Tasks')
    expect(container.textContent).toContain('No tasks yet')
    expect(container.textContent).toContain('Start a streak today')
    expect(container.textContent).toContain('Study sounds')
    expect(container.textContent).toContain('Rain')
    expect(container.textContent).toContain('Your focus')
    expect(container.textContent).toContain('Reports')
    expect(container.textContent).toContain('Exam countdown')
    expect(container.textContent).toContain('No focus sessions in the last 7 days.')
    expect(container.textContent).toContain('Session history')
    expect(container.textContent).toContain('What is PUMOPOKUS?')
    expect(container.textContent).toContain('Basic features')
    expect(container.textContent).toContain('Coming soon')
    expect(container.textContent).not.toContain('Round 1 of 4')
  })

  it('saves and clears an exam date', async () => {
    await renderApp()
    const input = container.querySelector('#exam-date')
    expect(input).toBeTruthy()

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
      setter.call(input, '2099-01-01')
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })

    expect(container.textContent).toContain('days to go')
    expect(JSON.parse(localStorage.getItem('pumopokus.exam')).data).toEqual({
      date: '2099-01-01',
    })

    const clearButton = [...container.querySelectorAll('button')].find(
      (button) => button.textContent.trim() === 'Clear',
    )
    expect(clearButton).toBeTruthy()
    await act(async () => clearButton.click())
    expect(container.textContent).toContain('Set an exam date to start the countdown.')
  })

  it('opens and closes the settings modal from the header', async () => {
    await renderApp()
    const dialog = container.querySelector('dialog')
    expect(dialog).toBeTruthy()
    expect(dialog.open).toBe(false)

    const openButton = container.querySelector('header button[aria-haspopup="dialog"]')
    expect(openButton).toBeTruthy()
    await act(async () => openButton.click())

    expect(dialog.open).toBe(true)
    expect(dialog.textContent).toContain('Session lengths')
    expect(dialog.textContent).toContain('Long break after')

    const closeButton = dialog.querySelector('button[aria-label="Close settings"]')
    expect(closeButton).toBeTruthy()
    await act(async () => closeButton.click())
    expect(dialog.open).toBe(false)
  })

  it('opens the settings modal from the footer', async () => {
    await renderApp()
    const footerButton = [...container.querySelectorAll('footer nav button')].find(
      (button) => button.textContent.trim() === 'Settings',
    )
    expect(footerButton).toBeTruthy()

    await act(async () => footerButton.click())
    expect(container.querySelector('dialog').open).toBe(true)
  })

  it('redirects the old settings route to the timer', async () => {
    await renderApp('/settings')
    await act(async () => {
      await Promise.resolve()
    })

    expect(window.location.pathname).toBe('/')
    expect(container.textContent).toContain('25:00')
    expect(container.querySelector('dialog').open).toBe(false)
  })
})
