# A lightweight dialog component for React

## Demo

https://codesandbox.io/s/react-modal-example-3km0w

## Install

```
npm i @netojose/react-modal
```

or

```
yarn add @netojose/react-modal
```

## Basic usage

```js
import React, { useState, useCallback } from 'react'
import Modal from '@netojose/react-modal'

function App() {
    const [isOpen, setIsOpen] = useState(false)
    const openModal = useCallback(() => setIsOpen(true), [])
    const closeModal = useCallback(() => setIsOpen(false), [])
    return (
        <div>
            <input type="button" value="Open modal" onClick={openModal} />
            <Modal isOpen={isOpen} onRequestClose={closeModal}>
                <p>This is the modal content</p>
                <input type="button" value="Close modal" onClick={closeModal} />
            </Modal>
        </div>
    )
}

export default App
```

## API

| prop                | Description                                     | type     | default value         | required |
| ------------------- | ----------------------------------------------- | -------- | --------------------- | -------- |
| isOpen              | Flag to render or not the modal                 | boolean  | false                 | Yes      |
| ariaLabelledby      | `aria-labelledby` modal attribute               | string   | null                  | No       |
| ariaDescribedby     | `aria-describedby` modal attribute              | string   | null                  | No       |
| onAfterOpen         | Callback after modal open                       | function | () => null            | No       |
| onAfterClose        | Callback after modal close                      | function | () => null            | No       |
| onRequestClose      | Callback when a close modal action is triggered | function | () => null            | No       |
| closeOnOverlayClick | Flag to request close modal on overlay click    | boolean  | true                  | No       |
| closeOnEsc          | Flag to request close modal on press esc key    | boolean  | true                  | No       |
| focusAfterRender    | Flag to modal should be focused after render    | boolean  | true                  | No       |
| portalClassName     | Portal div class name                           | string   | ReactModal\_\_Portal  | No       |
| overlayClassName    | Overlay div class name                          | string   | ReactModal\_\_Overlay | No       |
| modalClassName      | Modal div class name                            | string   | ReactModal\_\_Modal   | No       |
| overlayStyles       | Extra overlay styles                            | object   | {}                    | No       |
| modalStyles         | Extra modal styles                              | object   | {}                    | No       |
| container           | Query selector to append portal                 | string   | body                  | No       |
