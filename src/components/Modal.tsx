import { Provider, atom, createStore, useAtomValue } from "jotai";
import React, { useRef } from "react";

type ModalResponse<T> = { hasResponse: false } | { hasResponse: true; response: T };
type EventProps = {
  onClose: () => void;
  onCancel: () => void;
};
type ModalContentFunction<T> = (
  closeWithResponse: (response: T) => void,
  colseWithoutResponse: () => void,
) => React.ReactNode;
const isOpenAtom = atom(false);
const propsAtom = atom<EventProps>({ onClose: () => null, onCancel: () => null });
const responseAtom = atom<ModalResponse<unknown>>({ hasResponse: false });
const contentAtom = atom<React.ReactNode | undefined>(undefined);
const store = createStore();

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: (event: React.SyntheticEvent<HTMLDialogElement, Event>) => void;
  onCancel?: (event: React.SyntheticEvent<HTMLDialogElement, Event>) => void;
};
const Modal = ({ children, isOpen, onClose, onCancel }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  if (isOpen && ref.current && !ref.current.open) ref.current.showModal();
  if (!isOpen && ref.current && ref.current.open) ref.current.close();
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <dialog ref={ref} className="modal" onClose={onClose} onCancel={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const ModalDialog = () => {
  const isOpen = useAtomValue(isOpenAtom);
  // @ts-ignore
  const content = useAtomValue<React.ReactNode>(contentAtom);
  const props = useAtomValue(propsAtom);
  return (
    <Modal isOpen={isOpen} {...props}>
      {content}
    </Modal>
  );
};

const ModalProvider = () => {
  return (
    <Provider store={store}>
      <ModalDialog />
    </Provider>
  );
};

function showModal<T>(fn: ModalContentFunction<T>): Promise<ModalResponse<T>> {
  const closeWithResponse = (response: T) => {
    store.set(responseAtom, { hasResponse: true, response });
    store.set(isOpenAtom, false);
  };
  const closeWithoutResponse = () => {
    store.set(isOpenAtom, false);
  };
  const content = fn(closeWithResponse, closeWithoutResponse);
  store.set(contentAtom, content);

  return new Promise<ModalResponse<T>>(resolve => {
    const onClose = () => {
      store.set(isOpenAtom, false);
      store.set(propsAtom, { onClose: () => null, onCancel: () => null });
      store.set(contentAtom, undefined);
      resolve(store.get(responseAtom) as ModalResponse<T>);
    };
    store.set(responseAtom, { hasResponse: false });
    store.set(isOpenAtom, true);
    store.set(propsAtom, { onClose, onCancel: onClose });
  });
}

export type { ModalProps, ModalResponse, ModalContentFunction };
export { Modal, showModal, ModalProvider };
