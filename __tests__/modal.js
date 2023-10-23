import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event'
import React from 'react'
import Modal from '../src/index'

const mockOnAfterOpen = jest.fn()
const mockOnAfterClose = jest.fn()
const mockOnRequestClose = jest.fn()

afterEach(() => {
    jest.clearAllMocks();
})

test('Not render when isOpen is false', () => {
    render(<Modal isOpen={false}>Modal content</Modal>)

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
})

test('Check for modal content', () => {
    render(<Modal isOpen>Modal content</Modal>)

    expect(screen.queryByText("Modal content")).toBeInTheDocument();
})

test('Check if portal is created', () => {
    render(<Modal isOpen>Modal content</Modal>)

    const overlayElement = screen.getByText('Modal content').parentElement
    const portalElement = overlayElement.parentElement

    expect(portalElement).toBeInTheDocument();
    expect(portalElement).toHaveClass('ReactModal__Portal');
})

test('Check if portal is removed', () => {
    const {unmount} = render(<Modal isOpen={true}>Modal content</Modal>)

    const overlayElement = screen.getByText('Modal content').parentElement
    const portalElement = overlayElement.parentElement

    expect(portalElement).toBeInTheDocument();
    expect(portalElement).toHaveClass('ReactModal__Portal')

    unmount()

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
})

test('Check for onAfterOpen callback', () => {
    const openModal = (isOpen) => (
        <Modal isOpen={isOpen} onAfterOpen={mockOnAfterOpen}>
            Modal content
        </Modal>
    )
    const {rerender} = render(openModal(false))

    expect(mockOnAfterOpen.mock.calls.length).toBe(0)

    rerender(openModal(true))

    expect(mockOnAfterOpen.mock.calls.length).toBe(1)

    rerender(openModal(false))

    expect(mockOnAfterOpen.mock.calls.length).toBe(1)
})

test('Check for onAfterClose callback', () => {
    const openModal = (isOpen) => (
        <Modal isOpen={isOpen} onAfterClose={mockOnAfterClose}>
            Modal content
        </Modal>
    )
    const {rerender} = render(openModal(false))

    expect(mockOnAfterClose.mock.calls.length).toBe(0)

    rerender(openModal(true))

    expect(mockOnAfterClose.mock.calls.length).toBe(0)

    rerender(openModal(false))

    expect(mockOnAfterClose.mock.calls.length).toBe(1)
})

test('Check for onRequestClose callback', async () => {
    const openModal = (isOpen) => (
        <Modal isOpen={isOpen}>
            Modal content
        </Modal>
    )
    const {rerender} = render(openModal(false))

    rerender(openModal(true))

    await act(async () => {
        await userEvent.keyboard('{Escape}');
    });

    rerender(
        <Modal isOpen onRequestClose={mockOnRequestClose}>
            Modal content
        </Modal>
    )

    expect(mockOnRequestClose.mock.calls.length).toBe(0)

    await act(async () => {
        await userEvent.keyboard('{Escape}');
    });

    expect(mockOnRequestClose.mock.calls.length).toBe(1)
})

test('Check onRequestClose on click overlay', async () => {
    const openModal = (isOpen) => (
        <Modal isOpen={isOpen} onRequestClose={mockOnRequestClose}>
            Modal content
        </Modal>
    )
    const {rerender} = render(openModal(false))

    rerender(openModal(true))

    expect(mockOnRequestClose.mock.calls.length).toBe(0)

    const overlayElement = screen.getByText('Modal content').parentElement

    await act(async () => {
        await userEvent.click(overlayElement);
    });

    expect(mockOnRequestClose.mock.calls.length).toBe(1)

    rerender(
        <Modal isOpen onRequestClose={mockOnRequestClose} closeOnOverlayClick={false}>
            Modal content
        </Modal>
    )

    await act(async () => {
        await userEvent.click(overlayElement);
    });

    expect(mockOnRequestClose.mock.calls.length).toBe(1)
})

test('Check onRequestClose on click overlay', async () => {
    const openModal = (isOpen) => (
        <Modal isOpen={isOpen} onRequestClose={mockOnRequestClose}>
            Modal content
        </Modal>
    )
    const {rerender} = render(openModal(false))

    rerender(openModal(true))

    expect(mockOnRequestClose.mock.calls.length).toBe(0)

    const overlayElement = screen.getByText('Modal content').parentElement

    await act(async () => {
        await userEvent.click(overlayElement);
    });

    expect(mockOnRequestClose.mock.calls.length).toBe(1)

    rerender(
        <Modal isOpen onRequestClose={mockOnRequestClose} closeOnOverlayClick={false}>
            Modal content
        </Modal>
    )

    await act(async () => {
        await userEvent.click(overlayElement);
    });

    expect(mockOnRequestClose.mock.calls.length).toBe(1)
})

test('Check onRequestClose on click overlay', async () => {
    const openModal = (isOpen) => (
        <Modal isOpen={isOpen} onRequestClose={mockOnRequestClose}>
            Modal content
        </Modal>
    )
    const {rerender} = render(openModal(false))

    rerender(openModal(true))

    expect(mockOnRequestClose.mock.calls.length).toBe(0)

    const overlayElement = screen.getByText('Modal content').parentElement

    await act(async () => {
        await userEvent.click(overlayElement);
    });

    expect(mockOnRequestClose.mock.calls.length).toBe(1)

    rerender(
        <Modal isOpen onRequestClose={mockOnRequestClose} closeOnOverlayClick={false}>
            Modal content
        </Modal>
    )

    await act(async () => {
        await userEvent.click(overlayElement);
    });

    expect(mockOnRequestClose.mock.calls.length).toBe(1)
})

test('Check autofocus after open modal', () => {
    const openModal = (isOpen) => (
        <Modal isOpen={isOpen}>
            <input id="input" />
        </Modal>
    )
    const noFocusAfterRenderOpenModal = (isOpen) => (
        <Modal isOpen={isOpen} focusAfterRender={false}>
            <input id="input" />
        </Modal>
    )
    const {rerender} = render(openModal(false))

    rerender(openModal(true))

    const inputElement = screen.getByRole('textbox', {name: ''})

    expect(inputElement).toHaveFocus()

    rerender(noFocusAfterRenderOpenModal(false))

    rerender(noFocusAfterRenderOpenModal(true))

    expect(inputElement).not.toHaveFocus()
})

test('Not allow tab navigation while modal is opened', async () => {
    const openModal = (isOpen) => (
        <Modal isOpen={isOpen} focusAfterRender={false}>
            <input id="input" />
        </Modal>
    )
    const {rerender} = render(openModal(false))

    rerender(openModal(true))

    const inputElement = screen.getByRole('textbox', {name: ''})

    expect(inputElement).not.toHaveFocus()

    await act(async () => {
        await userEvent.tab();
    });

    expect(inputElement).toHaveFocus()
})

test('Not allow tab navigation while modal is opened even when modal has no focusable element', async () => {
    const openModal = (isOpen) => (
        <Modal isOpen={isOpen} focusAfterRender={false}>
            Hello
        </Modal>
    )
    const {rerender} = render(openModal(false))

    rerender(openModal(true))

    const element = screen.getByText('Hello')

    expect(element).not.toHaveFocus()

    await act(async () => {
        await userEvent.tab();
    });

    expect(element).not.toHaveFocus()
})
