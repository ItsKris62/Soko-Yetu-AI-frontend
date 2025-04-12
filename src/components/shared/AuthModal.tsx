'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useModalStore } from '@/store/modalStore'
import LoginForm from '../forms/LoginForm'
import SignupForm from '../forms/SignupForm'
import PasswordResetForm from '../forms/PasswordResetForm'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'

export default function AuthModal() {
  const { isOpen, view, closeModal, setView } = useModalStore()
  const [counties, setCounties] = useState([])
  const [subCounties, setSubCounties] = useState([])

  useEffect(() => {
    if (!isOpen) return
    fetch('http://localhost:8000/api/locations/counties').then(r => r.json()).then(setCounties)
    fetch('http://localhost:8000/api/locations/subcounties').then(r => r.json()).then(setSubCounties)
  }, [isOpen])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold text-center mb-6">
                  {view === 'login' ? 'Welcome Back 👋' : view === 'register' ? 'Join SokoYetu AI' : 'Reset Password'}
                </Dialog.Title>

                {/* Tabs */}
                <Tab.Group selectedIndex={['login', 'register', 'reset'].indexOf(view)} onChange={(i) => setView(['login', 'register', 'reset'][i] as any)}>
                  <Tab.List className="flex space-x-2 mb-4 justify-center">
                    {['Login', 'Register', 'Reset'].map((label, i) => (
                      <Tab
                        key={label}
                        className={({ selected }) =>
                          clsx(
                            'px-3 py-1.5 text-sm rounded-md font-medium',
                            selected ? 'bg-primary text-dark' : 'text-gray-500 hover:text-primary'
                          )
                        }
                      >
                        {label}
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel><LoginForm modal /></Tab.Panel>
                    <Tab.Panel><SignupForm modal counties={counties} subCounties={subCounties} /></Tab.Panel>
                    <Tab.Panel><PasswordResetForm modal /></Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>

                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                >
                  &times;
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
