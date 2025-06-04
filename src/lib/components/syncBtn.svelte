<script>
    import { Notyf } from 'notyf';
    import 'notyf/notyf.min.css';
    import Modal from '$lib/components/modal.svelte';
    import { modalStore } from '$lib/stores/modalStore';

    const { user } = $props();
    let isSynchronized= $state(!!user);
    let email = $state('');
    let emailError = $state()
    let loading = $state(false);

    const toggleModal = () => {
        modalStore.open();
    }

    const onValidate = async () => {
        if (!isSynchronized){
            emailError= !email.trim() || !/\S+@\S+\.\S+/.test(email);
            if (emailError) return;
            await login();
        } else {
            await fetch('/api/auth/logout', { method: 'POST' });
            location.reload();
        }
        email = '';
        emailError = null;
        modalStore.close();
    }


    async function login() {
        const notyf = new Notyf();
        loading = true;
        try {
            const res = await fetch('/api/auth/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (!res.ok) {
                error = data?.error || 'Erreur inconnue';
                notyf.error('Erreur lors de synchronisation');
            } else {
                notyf.success("Magic link envoyé !");
            }
        } catch (err) {
            notyf.error('Erreur lors de synchronisation')
        } finally {
            loading = false;
        }
    }
</script>

<button class="link-style item-center" onclick={toggleModal}>
    {#if isSynchronized}
        <img src="/icons/stop-sync.png" alt="icone deconnecter" width="32"/>Déconnecter
    {:else}
        <img  class={loading ? 'rotating' : ''} src="/icons/sync.png" alt="icone syncrhroniser" width="32"/>Synchroniser
    {/if}
</button>

<Modal title={isSynchronized ? "Se déconnecter": "Synchronisez vos favoris"} validModal={onValidate}>
    {#if isSynchronized}
        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
    {:else}
        <p>En synchronisant vos villes favorites, vous pourrez les retrouver sur tous vos appareils.
        Vous pouvez aussi recevoir par email les conditions de vos villes favorites.</p>
        <input type="email" name="email" placeholder="Votre email" aria-label="email" bind:value={email} aria-invalid={emailError} />
        <!-- <small><input type="checkbox"/>M'envoyer quotidiennement les conditions de mes villes suivies.</small>-->
    {/if}
</Modal>