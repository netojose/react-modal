import React, { Component, createRef } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'

import { overlay as overlayCSS, modal as modalCSS } from './styles'

class Modal extends Component {
    constructor(props) {
        super(props)
        this.portalNode = document.createElement('div')
        this.portalNode.className = props.portalClassName
        this.modalRef = createRef()
    }
    componentWillUnmount() {
        this._removePortal()
    }

    componentDidUpdate(prevProps) {
        const { isOpen, onAfterOpen, onAfterClose } = this.props
        const { isOpen: prevIsOpen } = prevProps

        if (isOpen && !prevIsOpen) {
            this._setFocus()
            document.addEventListener('keydown', this._watchKeyboard)
            onAfterOpen()
        } else if (!isOpen && prevIsOpen) {
            this._removePortal()
            onAfterClose()
        }
    }

    _removePortal = () => {
        const { parentNode } = this.portalNode
        if (parentNode) {
            parentNode.removeChild(this.portalNode)
        }
        document.removeEventListener('keydown', this._watchKeyboard)
    }

    _watchKeyboard = e => {
        e = e || window.event
        const KEY_TAB = 9
        const KEY_ESC = 27
        const { closeOnEsc } = this.props

        if (e.keyCode === KEY_TAB) {
            this._handleTabNavigation(e)
            return
        }

        if (e.keyCode === KEY_ESC && closeOnEsc) {
            this.props.onRequestClose()
        }
    }

    _handleOverlayClick = e => {
        const { closeOnOverlayClick } = this.props
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            this.props.onRequestClose()
        }
    }

    _setFocus = () => {
        if (!this.props.focusAfterRender) {
            return
        }
        const focusable = this._getFocusable()
        if (focusable.length > 0) {
            focusable[0].focus()
        }
    }

    _getFocusable = () =>
        this.modalRef.current.querySelectorAll(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
        )

    _handleTabNavigation = e => {
        const focusable = this._getFocusable()

        if (focusable.length < 1) {
            e.preventDefault()
            return
        }

        const firstEl = focusable[0]
        const lastEl = focusable[focusable.length - 1]
        const currEl = document.activeElement

        if (e.shiftKey && currEl === firstEl) {
            e.preventDefault()
            lastEl.focus()
            return
        }

        if (!e.shiftKey && currEl === lastEl) {
            e.preventDefault()
            firstEl.focus()
            return
        }

        const isValidEl = Array.from(focusable).find(el => el === currEl)
        if (!isValidEl) {
            e.preventDefault()
            firstEl.focus()
        }
    }

    render() {
        const {
            children,
            isOpen,
            ariaLabelledby,
            ariaDescribedby,
            overlayClassName,
            modalClassName,
            overlayStyles,
            modalStyles,
            container
        } = this.props

        if (!isOpen) {
            return null
        }

        const containerNode = document.querySelector(container)
        if (!containerNode.contains(this.portalNode)) {
            containerNode.appendChild(this.portalNode)
        }

        const styleOverlay = { ...overlayCSS, ...overlayStyles }
        const styleModal = { ...modalCSS, ...modalStyles }

        return ReactDOM.createPortal(
            <div
                style={styleOverlay}
                className={overlayClassName}
                onClick={this._handleOverlayClick}
            >
                <div
                    style={styleModal}
                    className={modalClassName}
                    role="dialog"
                    aria-labelledby={ariaLabelledby}
                    aria-describedby={ariaDescribedby}
                    ref={this.modalRef}
                >
                    {children}
                </div>
            </div>,
            this.portalNode
        )
    }
}

Modal.defaultProps = {
    children: null,
    isOpen: false,
    focusAfterRender: true,
    ariaLabelledby: null,
    ariaDescribedby: null,
    onAfterOpen: () => null,
    onAfterClose: () => null,
    onRequestClose: () => null,
    closeOnOverlayClick: true,
    closeOnEsc: true,
    portalClassName: 'ReactModal__Portal',
    overlayClassName: 'ReactModal__Overlay',
    modalClassName: 'ReactModal__Modal',
    overlayStyles: {},
    modalStyles: {},
    container: 'body'
}

Modal.propTypes = {
    children: propTypes.node,
    isOpen: propTypes.bool,
    focusAfterRender: propTypes.bool,
    ariaLabelledby: propTypes.string,
    ariaDescribedby: propTypes.string,
    onAfterOpen: propTypes.func,
    onAfterClose: propTypes.func,
    onRequestClose: propTypes.func,
    closeOnOverlayClick: propTypes.bool,
    closeOnEsc: propTypes.bool,
    portalClassName: propTypes.string,
    overlayClassName: propTypes.string,
    modalClassName: propTypes.string,
    overlayStyles: propTypes.object,
    modalStyles: propTypes.object,
    container: propTypes.string
}

export default Modal
