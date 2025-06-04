<script>
    import { modalStore } from '$lib/stores/modalStore';
    import { onMount, onDestroy } from 'svelte';

    const { title, validModal } = $props();
    let dialogEl;
    let unsubscribe;

    onMount(() => {
        unsubscribe = modalStore.subscribe(({ isOpen }) => {
            if (dialogEl) {
                if (isOpen && !dialogEl.open) {
                    dialogEl.showModal();
                } else if (!isOpen && dialogEl.open) {
                    dialogEl.close();
                }
            }
        });
    });

    onDestroy(() => {
        unsubscribe?.();
    });

    const closeModal = () => {
        modalStore.close();
    }
</script>

<dialog bind:this={dialogEl}>
    <article>
        <header>
            <a href="#close" class="close" aria-label="Fermer" onclick={closeModal}></a>
            <h3>{title}</h3>
        </header>
        <slot />
        <footer>
            <button class="green-inverse" onclick={closeModal}>Annuler</button>
            {#if validModal}
                <button class="green" onclick={validModal}>Valider</button>
            {/if}
        </footer>
    </article>
</dialog>