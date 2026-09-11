// Controla o formulário de login
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = "Entrando...";
    mensagem.style.color = "#2563eb";

    // Faz o login usando o Supabase Auth
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        mensagem.textContent = "E-mail ou senha incorretos.";
        mensagem.style.color = "#dc2626";
        return;
    }

    // Busca o tipo do usuário
    const { data: usuario, error: erroUsuario } = await supabaseClient
        .from("usuarios")
        .select("tipo")
        .eq("auth_id", data.user.id)
        .single();

    if (erroUsuario || !usuario) {
        mensagem.textContent = "Usuário não configurado.";
        mensagem.style.color = "#dc2626";

        await supabaseClient.auth.signOut();

        return;
    }

    // Redireciona para o painel correspondente
    if (usuario.tipo === "admin") {
        window.location.href = "admin.html";

    } else if (usuario.tipo === "professor") {
        window.location.href = "professor.html";

    } else if (usuario.tipo === "aluno") {
        window.location.href = "aluno.html";
    }
});
