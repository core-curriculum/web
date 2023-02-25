import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { MdClose } from "react-icons/md";

type Props = {
  content: string | ReactNode;
  title?: string;
  show: boolean;
  choises?: string[];
  primary?: string;
  onClose: (res: string) => void;
};

const Title = ({ title, onClose }: { title: string; onClose: () => void }) => {
  return (
    <div className="flex">
      <Dialog.Title as="h3" className="flex-1 text-lg font-medium leading-6 text-gray-900">
        {title}
      </Dialog.Title>
      <MdClose className="flex-none cursor-pointer" onClick={onClose} />
    </div>
  );
};

const ConfirmDialog = ({ show, title, content, onClose, choises, primary }: Props) => {
  title ??= "";
  choises ??= [];
  primary ??= "";
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => onClose("")}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md overflow-hidden rounded-2xl
                  bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <Title title={title} onClose={() => onClose("")} />
                  <div className="mt-2">{content}</div>

                  <div className="mt-4 flex justify-end gap-1">
                    {choises.map(key => {
                      return key === primary ? (
                        <button
                          type="button"
                          key={key}
                          className="inline-flex justify-center rounded-md border border-transparent
                      bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                      focus-visible:ring-offset-2"
                          onClick={() => onClose(key)}
                        >
                          {key}
                        </button>
                      ) : (
                        <button
                          type="button"
                          key={key}
                          className="inline-flex justify-center rounded-md border border-transparent
                        px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                        focus-visible:ring-offset-2"
                          onClick={() => onClose(key)}
                        >
                          {key}
                        </button>
                      );
                    })}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export { ConfirmDialog };
export type { Props as ConfirmDialogProps };
