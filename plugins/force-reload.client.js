export default defineNuxtPlugin((nuxtApp) =>{
    const CURRENT_PATH = '1.0.5'
    const savedPath = localStorage.getItem('app_installed_path');
    if (savedPath !== CURRENT_PATH) {
        localStorage.setItem('app_installed_path', CURRENT_PATH);
        sessionStorage.removeItem('hotfix_reloaded');
    }
    nuxtApp.hook('app:error', () => {
        if (!sessionStorage.getItem('hotfix_reloaded')) {
            sessionStorage.setItem('hotfix_reloaded', true);
            window.location.reload();
        }
    })
})
