// Verifica se o usuário é administrador
document.addEventListener("DOMContentLoaded", async () => {

    const acesso = await verificarAcesso("admin");

    if (!acesso) return;

    document.getElementById("sair").addEventListener("click", sair);

    document
    .getElementById("formUsuario")
    .addEventListener("submit", cadastrarUsuario);

    carregarUsuarios();
    carregarAlunos();
});


// Lista os usuários do sistema
async function carregarUsuarios() {

    const { data, error } = await supabaseClient
        .from("usuarios")
        .select("nome, usuario, tipo")
        .order("nome");

    const lista = document.getElementById("listaUsuarios");

    if (error) {
        lista.textContent = "Erro ao carregar usuários.";
        return;
    }

    lista.innerHTML = `
        <table class="tabela">

            <tr>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Tipo</th>
            </tr>

            ${data.map(usuario => `
                <tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.tipo}</td>
                </tr>
            `).join("")}

        </table>
    `;
}


// Lista alunos e suas notas
async function carregarAlunos() {

    const { data, error } = await supabaseClient
        .from("alunos")
        .select("id, nome, nota_final")
        .order("nome");

    const lista = document.getElementById("listaAlunos");

    if (error) {
        lista.textContent = "Erro ao carregar alunos.";
        return;
    }

    if (!data.length) {
        lista.textContent = "Nenhum aluno cadastrado.";
        return;
    }

    lista.innerHTML = `
        <table class="tabela">

            <tr>
                <th>Aluno</th>
                <th>Nota final</th>
            </tr>

            ${data.map(aluno => `
                <tr>
                    <td>${aluno.nome}</td>
                    <td>${aluno.nota_final}</td>
                </tr>
            `).join("")}

        </table>
    `;
}
// Cria um novo aluno ou professor
async function cadastrarUsuario(event) {

    event.preventDefault();

    const nome = document.getElementById("nomeUsuario").value.trim();
    const email = document.getElementById("emailUsuario").value.trim();
    const senha = document.getElementById("senhaUsuario").value;
    const tipo = document.getElementById("tipoUsuario").value;
    const mensagem = document.getElementById("mensagemUsuario");

    mensagem.textContent = "Cadastrando...";
    mensagem.style.color = "#2563eb";


    const { data: { session } } =
        await supabaseClient.auth.getSession();


    const resposta = await fetch(
        `${SUPABASE_URL}/functions/v1/criar-usuario`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`,
                "apikey": SUPABASE_KEY
            },

            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha,
                tipo: tipo
            })
        }
    );


    const resultado = await resposta.json();


    if (!resposta.ok) {

        mensagem.textContent =
            resultado.erro || "Erro ao cadastrar usuário.";

        mensagem.style.color = "#dc2626";

        return;
    }


    mensagem.textContent =
        "Usuário cadastrado com sucesso!";

    mensagem.style.color = "#16a34a";


    document.getElementById("formUsuario").reset();

    carregarUsuarios();
}
