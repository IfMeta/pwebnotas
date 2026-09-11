// Configuração do projeto Supabase
const SUPABASE_URL = "https://duufwdsdrokyraqffvux.supabase.co";

const SUPABASE_KEY = "sb_publishable_zbuZTutRXWn05FTm86uBTA__Lfk8X8K";

// Cria a conexão com o Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
