import { writable } from 'svelte/store';

const createModalStore = () => {
    const { subscribe, update } = writable({
        isOpen: false,
        content: null,
    });

    return {
        subscribe,
        open: (content = null) => {
            update(() => ({
                isOpen: true,
                content,
            }));
        },
        close: () => {
            update(() => ({
                isOpen: false,
                content: null,
            }));
        },
    };
};

export const modalStore = createModalStore();