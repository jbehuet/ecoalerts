<script>
    import { onMount } from 'svelte';

    let theme;
    onMount(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') {
            theme = stored;
            document.documentElement.setAttribute('data-theme', stored);
        } else {
            const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            theme = system;
            document.documentElement.setAttribute('data-theme', system);
        }
    });

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        theme = next;
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
    };
</script>
<label for="theme">
    ☀️
    <input style={"margin-inline-start:0.5em"} type="checkbox" role="switch" id="theme" name="theme"
           on:change={toggleTheme} checked={theme === 'dark'} />
    🌙
</label>