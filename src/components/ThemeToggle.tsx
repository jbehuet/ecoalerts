import { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') {
            setTheme(stored);
            document.documentElement.setAttribute('data-theme', stored);
        } else {
            const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setTheme(system);
            document.documentElement.setAttribute('data-theme', system);
        }
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
    };

    return (
        <label htmlFor="theme">
            ☀️
            <input style={{marginInlineStart: "0.5em"}} type="checkbox" role="switch" id="theme" name="theme" onChange={toggleTheme} checked={theme === 'dark'} />
            🌙
        </label>
)
    ;
};

export default ThemeToggle;
