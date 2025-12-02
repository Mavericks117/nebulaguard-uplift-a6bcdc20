import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'user' | 'org_admin' | 'super_admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  organizationId?: string;
}

export const getAuthUser = async (): Promise<AuthUser | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  // Fetch user role from database
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .order('role', { ascending: true }) // super_admin < org_admin < user alphabetically
    .limit(1)
    .maybeSingle();

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', session.user.id)
    .maybeSingle();

  return {
    id: session.user.id,
    email: session.user.email!,
    role: (roleData?.role as UserRole) || 'user',
    organizationId: profile?.organization_id || undefined
  };
};

export const signUp = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email
      }
    }
  });

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPasswordForEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });

  return { data, error };
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  return { data, error };
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
