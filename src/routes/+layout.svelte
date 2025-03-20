<script>
    import '../app.css';
    let {children} = $props();
    const version = import.meta.env.PACKAGE_VERSION;
</script>

<svelte:head>
    <title>Dashboard {version}</title>
</svelte:head>

{@render children()}
