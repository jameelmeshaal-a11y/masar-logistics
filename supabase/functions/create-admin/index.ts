import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const email = 'ceo@salasah.sa'
  const password = 'admin@2030'

  // Check if user exists
  const { data: users } = await supabase.auth.admin.listUsers()
  const existing = users?.users?.find(u => u.email === email)

  if (existing) {
    // Update password
    await supabase.auth.admin.updateUserById(existing.id, { password })
    // Ensure admin role
    const { data: role } = await supabase.from('user_roles').select().eq('user_id', existing.id).single()
    if (!role) {
      await supabase.from('user_roles').insert({ user_id: existing.id, role: 'admin' })
    }
    return new Response(JSON.stringify({ message: 'Admin password updated', user_id: existing.id }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Create user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'مدير النظام' }
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  // Add admin role
  await supabase.from('user_roles').insert({ user_id: data.user.id, role: 'admin' })

  return new Response(JSON.stringify({ message: 'Admin created', user_id: data.user.id }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
