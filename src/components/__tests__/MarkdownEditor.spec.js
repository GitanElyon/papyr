import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownEditor from '../MarkdownEditor.vue'

// Mock the Muya import to avoid issues with assets during testing
vi.mock('@muyajs/core', () => ({
  Muya: vi.fn(() => ({
    destroy: vi.fn()
  }))
}))

describe('MarkdownEditor', () => {
  it('renders properly', () => {
    const wrapper = mount(MarkdownEditor)
    expect(wrapper.find('.editor-container').exists()).toBe(true)
    expect(wrapper.find('.editor').exists()).toBe(true)
  })

  it('has correct classes applied', () => {
    const wrapper = mount(MarkdownEditor)
    const container = wrapper.find('.editor-container')
    const editor = wrapper.find('.editor')
    
    expect(container.classes()).toContain('editor-container')
    expect(editor.classes()).toContain('editor')
  })
})