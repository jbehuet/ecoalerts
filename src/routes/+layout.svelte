<script>
    import '$styles/globals.scss';
    import { onMount } from 'svelte';
    import SyncBtn from '$lib/components/syncBtn.svelte';
    import ThemeToggle from '$lib/components/themeToggle.svelte';

    export let data;
    let menuOpen = false;
    let isMounted = false;

    onMount(() => {
        isMounted = true;
    });

    $: if (isMounted) {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
</script>
<header class="container">
    <div class="header-wrapper">
        <hgroup>
            <a href="/">
                <img src="/img/logo_light.png" alt="logo light EcoAlerts" width="200" height="65" class="logo light" />
                <img src="/img/logo_dark.png" alt="logo dark EcoAlerts" width="200" height="65" class="logo dark" />
            </a>
            <p>Suivez les conditions environnementales près de chez vous</p>
        </hgroup>

        <!-- Burger button for mobile -->
        <button
                class="burger"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onclick={() => (menuOpen = !menuOpen)}
        >
            {menuOpen ? '✕' : '☰'}
        </button>

        <!-- Fullscreen nav overlay -->
        <nav class="nav-overlay {menuOpen ? 'active' : ''}">
            <SyncBtn user={data.user} />
        </nav>
    </div>
</header>
<main class="container">
    <slot />
</main>
<footer class="container">
    <div class="no-flex-on-mobile" style="justify-content: space-between; align-items: center" >
        <div><small>Made with ❤ ©2025 - v0.0.4</small></div>
        <small>📨 <a href="	https://github.com/jbehuet/ecoalerts/issues/new?labels=feedback">Une suggestion ? Un bug ?</a></small>
        <ThemeToggle />
    </div>
</footer>