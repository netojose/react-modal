import { mount } from 'enzyme'
import React from 'react'
import Modal from '../src/index'

test('Not render when isOpen is false', () => {
    const wrapper = mount(<Modal isOpen={false}>Modal content</Modal>)
    expect(wrapper.html()).toBeNull()
    wrapper.unmount()
})

test('Check for modal content', () => {
    const modalContent = 'Modal content'
    const wrapper = mount(<Modal isOpen={true}>{modalContent}</Modal>)
    expect(wrapper.find('div[role="dialog"]').text()).toEqual(modalContent)
    wrapper.unmount()
})

test('Check if portal is created', () => {
    const wrapper = mount(<Modal isOpen={true}>Modal content</Modal>)
    const hasPortal =
        document.body.getElementsByClassName('ReactModal__Portal').length === 1
    expect(hasPortal).toBeTruthy()
    wrapper.unmount()
})

test('Check if portal is removed', () => {
    const wrapper = mount(<Modal isOpen={true}>Modal content</Modal>)
    expect(
        document.body.getElementsByClassName('ReactModal__Portal').length === 1
    ).toBeTruthy()

    wrapper.unmount()

    expect(
        document.body.getElementsByClassName('ReactModal__Portal').length === 0
    ).toBeTruthy()
})

test('Check for onAfterOpen callback', () => {
    const mockOnAfterOpen = jest.fn()
    const wrapper = mount(
        <Modal isOpen={false} onAfterOpen={mockOnAfterOpen}>
            Modal content
        </Modal>
    )

    expect(mockOnAfterOpen.mock.calls.length).toBe(0)
    wrapper.setProps({ isOpen: true })
    expect(mockOnAfterOpen.mock.calls.length).toBe(1)
    wrapper.setProps({ isOpen: false })
    expect(mockOnAfterOpen.mock.calls.length).toBe(1)

    wrapper.unmount()
})

test('Check for onAfterClose callback', () => {
    const mockOnAfterClose = jest.fn()
    const wrapper = mount(
        <Modal isOpen={false} onAfterClose={mockOnAfterClose}>
            Modal content
        </Modal>
    )

    expect(mockOnAfterClose.mock.calls.length).toBe(0)
    wrapper.setProps({ isOpen: true })
    expect(mockOnAfterClose.mock.calls.length).toBe(0)
    wrapper.setProps({ isOpen: false })
    expect(mockOnAfterClose.mock.calls.length).toBe(1)

    wrapper.unmount()
})

test('Check for onRequestClose callback', () => {
    const wrapper = mount(<Modal isOpen={false}>Modal content</Modal>)

    wrapper.setProps({ isOpen: true })
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))

    const mockOnRequestClose = jest.fn()

    wrapper.setProps({ onRequestClose: mockOnRequestClose })
    expect(mockOnRequestClose.mock.calls.length).toBe(0)
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
    expect(mockOnRequestClose.mock.calls.length).toBe(1)

    wrapper.unmount()
})

test('Check onRequestClose on click overlay', () => {
    const mockOnRequestClose = jest.fn()
    const wrapper = mount(
        <Modal isOpen={false} onRequestClose={mockOnRequestClose}>
            Modal content
        </Modal>
    )

    wrapper.setProps({ isOpen: true })
    expect(mockOnRequestClose.mock.calls.length).toBe(0)
    wrapper.find('.ReactModal__Overlay').simulate('click')
    expect(mockOnRequestClose.mock.calls.length).toBe(1)
    wrapper.setProps({ closeOnOverlayClick: false })
    wrapper.find('.ReactModal__Overlay').simulate('click')
    expect(mockOnRequestClose.mock.calls.length).toBe(1)

    wrapper.unmount()
})

test('Check autofocus after open modal', () => {
    const wrapper = mount(
        <Modal isOpen={false}>
            <input id="input" />
        </Modal>
    )

    wrapper.setProps({ isOpen: true })
    expect(document.activeElement.id).toEqual('input')
    wrapper.setProps({ isOpen: false, focusAfterRender: false })
    wrapper.setProps({ isOpen: true })
    expect(document.activeElement.id).toEqual('')

    wrapper.unmount()
})

test('Not allow tab navigation while modal is opened', () => {
    const wrapper = mount(
        <Modal isOpen={false} focusAfterRender={false}>
            <input id="input" />
        </Modal>
    )
    wrapper.setProps({ isOpen: true })
    expect(document.activeElement.id).toEqual('')
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 }))
    expect(document.activeElement.id).toEqual('input')
    wrapper.unmount()
})

test('Not allow tab navigation while modal is opened even when modal has no focusable element', () => {
    const wrapper = mount(
        <Modal isOpen={false} focusAfterRender={false}>
            Hello
        </Modal>
    )
    wrapper.setProps({ isOpen: true })
    expect(document.activeElement.id).toEqual('')
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 }))
    expect(document.activeElement.id).toEqual('')
    wrapper.unmount()
})
