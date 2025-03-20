'use client';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

// Replace your existing select element with this
const FormatSelector = ({ selectedFormat, setSelectedFormat }: FormatSelectorProps) => {
    const outputFormats = ['jpg', 'png', 'gif', 'bmp', 'tiff', 'webp'];

    return (
        <div className="relative w-40">
            <Combobox value={selectedFormat} onChange={setSelectedFormat}>
                <div className="relative mt-1">
                    <div className="flex items-center">
                        <ComboboxInput
                            className="w-full py-2 pl-3 pr-10 text-sm leading-5 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            displayValue={(format: string) => format.toUpperCase()}
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                        </ComboboxButton>
                    </div>
                    <ComboboxOptions className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        {outputFormats.map((format) => (
                            <ComboboxOption
                                key={format}
                                value={format}
                                className={({ active }) =>
                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'text-white bg-orange-500' : 'text-gray-900'
                                    }`
                                }
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {format.toUpperCase()}
                                        </span>
                                        {selected && (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-orange-500'
                                                    }`}
                                            >
                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                </div>
            </Combobox>
        </div>
    );
};

export default FormatSelector;