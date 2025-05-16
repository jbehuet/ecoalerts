export default function Conseil({ conseil }: { conseil: string }) {
    return (
        <blockquote>
            <cite>{conseil ?? 'Chargement...'}</cite>
        </blockquote>
    );
}