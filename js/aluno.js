// Verifica se o usuário é aluno
document.addEventListener("DOMContentLoaded", async () => {

    const acesso = await verificarAcesso("aluno");

    if (!acesso) return;

    document.getElementById("sair").addEventListener("click", sair);

    carregarNota(acesso.usuario.id);
});


// Busca somente a nota do aluno logado
async function carregarNota(usuarioId) {

    const resultado = document.getElementById("resultado");

    const { data, error } = await supabaseClient
        .from("alunos")
        .select("nome, nota_final")
        .eq("usuario_id", usuarioId)
        .maybeSingle();

    if (error) {
        resultado.textContent = "Erro ao consultar a nota.";
        return;
    }

    if (!data) {
        resultado.textContent = "Nota ainda não cadastrada.";
        return;
    }

    // Verifica se o professor ainda não lançou a nota
    if (data.nota_final === null) {
        resultado.innerHTML = `
        <p>${data.nome}</p>
        <strong>Nota ainda não cadastrada.</strong>
    `;
        return;
    }

    resultado.innerHTML = `
    <p>${data.nome}</p>
    <strong>${Number(data.nota_final).toFixed(2)}</strong>
`;

}
