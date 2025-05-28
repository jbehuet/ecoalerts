<script>
    import '$styles/globals.scss';
    import ThemeToggle from '$lib/components/themeToggle.svelte';
</script>
<header class="container">
    <div class="no-flex-on-mobile" style="justify-content: space-between; align-items: center">
        <hgroup>
            <a href="/">
                <img src="/img/logo_light.png" alt="logo light EcoAlerts" width={200} height={65} class="logo light" />
                <img src="/img/logo_dark.png" alt="logo dark EcoAlerts" width={200} height={65} class="logo dark" />
            </a>
            <p>Suivez les conditions environnementales près de chez vous</p>
        </hgroup>
    </div>
</header>
<main class="container">
    <slot />
</main>
<footer class="container">
    <div class="no-flex-on-mobile" style="justify-content: space-between; align-items: center" >
        <div><small>Made with ❤ ©2025 - v0.0.2</small></div>
        <small>📨 <a href="	https://github.com/jbehuet/ecoalerts/issues/new?labels=feedback">Une suggestion ? Un bug ?</a></small>
        <ThemeToggle />
    </div>
</footer>