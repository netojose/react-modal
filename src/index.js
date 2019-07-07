import React from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'

import { overlay as overlayCSS, modal as modalCSS } from './styles'

class Modal extends React.Component {
    constructor(props) {
        super(props)
        this.portalNode = document.createElement('div')
        this.portalNode.className = props.portalClassName
    }
    componentWillUnmount() {
        this._removePortal()
    }

    componentDidUpdate(prevProps) {
        const { isOpen, onAfterOpen, onAfterClose } = this.props
        const { isOpen: prevIsOpen } = prevProps

        if (isOpen && !prevIsOpen) {
            onAfterOpen()
        } else if (!isOpen && prevIsOpen) {
            onAfterClose()
        }
    }

    _removePortal = () => {
        const { parentNode } = this.portalNode
        if (parentNode) {
            parentNode.removeChild(this.portalNode)
        }
        document.removeEventListener('keydown', this._handleEsc)
    }

    _handleEsc = e => {
        e = e || window.event
        const { closeOnEsc } = this.props
        if (closeOnEsc && e.keyCode === 27) {
            this.props.onRequestClose()
        }
    }

    _handleOverlayClick = e => {
        const { closeOnOverlayClick } = this.props
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            this.props.onRequestClose()
        }
    }

    render() {
        const {
            isOpen,
            children,
            overlayClassName,
            modalClassName,
            overlayStyles,
            modalStyles,
            container
        } = this.props
        if (!isOpen) {
            this._removePortal()
            return null
        }

        const containerNode = document.querySelector(container)
        if (!containerNode.contains(this.portalNode)) {
            containerNode.appendChild(this.portalNode)
            document.addEventListener('keydown', this._handleEsc)
        }

        const styleOverlay = { ...overlayCSS, ...overlayStyles }
        const styleModal = { ...modalCSS, ...modalStyles }

        return ReactDOM.createPortal(
            <div
                style={styleOverlay}
                className={overlayClassName}
                onClick={this._handleOverlayClick}
            >
                <div style={styleModal} className={modalClassName}>
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
