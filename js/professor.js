// Verifica o acesso do professor
document.addEventListener("DOMContentLoaded", async () => {

    const acesso = await verificarAcesso("professor");

    if (!acesso) return;

    document.getElementById("sair").addEventListener("click", sair);

    document
        .getElementById("formNota")
        .addEventListener("submit", salvarNota);

    carregarAlunos();
});


// Salva ou atualiza a nota do aluno selecionado
async function salvarNota(event) {

    event.preventDefault();

    const alunoId = document.getElementById("aluno").value;
    const nota = Number(document.getElementById("nota").value);
    const mensagem = document.getElementById("mensagem");

    // Valida a nota
    if (nota < 0 || nota > 10) {
        mensagem.textContent = "A nota deve estar entre 0 e 10.";
        mensagem.style.color = "#dc2626";
        return;
    }

    mensagem.textContent = "Salvando...";
    mensagem.style.color = "#2563eb";


    // Atualiza somente a nota do aluno escolhido
    const { error } = await supabaseClient
        .from("alunos")
        .update({
            nota_final: nota
        })
        .eq("id", alunoId);


    if (error) {

        console.error(error);

        mensagem.textContent = "Erro ao salvar a nota.";
        mensagem.style.color = "#dc2626";

        return;
    }


    mensagem.textContent = "Nota salva com sucesso!";
    mensagem.style.color = "#16a34a";

    document.getElementById("formNota").reset();

    carregarAlunos();
}


// Busca todos os alunos
async function carregarAlunos() {

    const { data, error } = await supabaseClient
        .from("alunos")
        .select("id, nome, nota_final")
        .order("nome");


    const lista = document.getElementById("listaAlunos");
    const select = document.getElementById("aluno");


    if (error) {

        console.error(error);

        lista.textContent = "Erro ao carregar alunos.";

        return;
    }


    if (!data.length) {

        lista.textContent = "Nenhum aluno cadastrado.";

        select.innerHTML = `
            <option value="">Nenhum aluno cadastrado</option>
        `;

        return;
    }


    // Preenche a lista de alunos do formulário
    select.innerHTML = `
        <option value="">Selecione um aluno</option>

        ${data.map(aluno => `
            <option value="${aluno.id}">
                ${aluno.nome}
            </option>
        `).join("")}
    `;


    // Mostra os alunos na tabela
    lista.innerHTML = `
        <table class="tabela">

            <tr>
                <th>Aluno</th>
                <th>Nota final</th>
            </tr>

            ${data.map(aluno => `
                <tr>
                    <td>${aluno.nome}</td>

                    <td>
                        ${
                            aluno.nota_final === null
                                ? "Não lançada"
                                : Number(aluno.nota_final).toFixed(2)
                        }
                    </td>
                </tr>
            `).join("")}

        </table>
    `;
}
