import { supabase } from '../infra/supabase/client/supabaseClient'

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Erro na conexão:', error)
      return false
    }
    
    console.log('Conexão com Supabase OK!')
    console.log('Sessão atual:', data.session ? 'Ativa' : 'Nenhuma')
    return true
    
  } catch (error) {
    console.error('Erro inesperado:', error)
    return false
  }
}