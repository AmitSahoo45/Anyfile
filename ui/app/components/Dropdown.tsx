'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
    ArchiveBoxXMarkIcon,
    ChevronDownIcon,
    Square2StackIcon,
    TrashIcon,
    PhotoIcon
} from '@heroicons/react/16/solid'
import Link from 'next/link';

const NestedDropdown: React.FC = () => {
    return (
        <div className="">
            <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md sm:py-1.5 pr-0 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[open]:text-orange-500 data-[focus]:outline-1 data-[focus]:outline-white cursor-pointer">
                    Actions
                    <ChevronDownIcon className="size-4 fill-white/60" />
                </MenuButton>

                <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/15 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50"
                >
                    <MenuItem>
                        <Link href="/image-converter" className="w-full">
                            <div className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 cursor-pointer data-[focus]:bg-white/10 hover:bg-white/20 transition">
                                <PhotoIcon className="size-4 fill-white/30" />
                                <p>Play with Images</p>
                            </div>
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            <Square2StackIcon className="size-4 fill-white/30" />
                            Duplicate
                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                        </button>
                    </MenuItem>
                    <div className="my-1 h-px bg-white/5" />
                    <MenuItem>
                        <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
                            Archive
                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘A</kbd>
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            <TrashIcon className="size-4 fill-white/30" />
                            Delete
                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    )
};

export default NestedDropdown;