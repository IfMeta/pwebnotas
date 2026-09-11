// Verifica se existe um usuário autenticado
async function verificarAcesso(tipoPermitido) {

    const { data: { user } } = await supabaseClient.auth.getUser();

    // Se não estiver logado, volta para o login
    if (!user) {
        window.location.href = "index.html";
        return null;
    }

    // Busca o usuário e seu tipo no banco
    const { data: usuario, error } = await supabaseClient
        .from("usuarios")
        .select("id, nome, tipo")
        .eq("auth_id", user.id)
        .single();

    if (error || !usuario || usuario.tipo !== tipoPermitido) {
        await supabaseClient.auth.signOut();
        window.location.href = "index.html";
        return null;
    }

    return {
        user,
        usuario
    };
}


// Encerra a sessão
async function sair() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}
