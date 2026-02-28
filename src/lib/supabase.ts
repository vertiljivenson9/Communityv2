import { createClient } from '@supabase/supabase-js';

// Credenciales de Supabase
const supabaseUrl = 'https://nagjdlkxklefnmrxgedz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZ2pkbGt4a2xlZm5tcnhnZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMjQzOTUsImV4cCI6MjA4NzgwMDM5NX0.p4xNpFO46LWSL0DJ1HzT68Wl9X6moXSWSXG5Gl244Yo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cloudinary config
export const cloudinaryConfig = {
  cloudName: 'dcclzhsim',
  apiKey: '829785861124543',
  apiSecret: 'EcCoLjgI7VawfPnY1xbck23G038',
  uploadPreset: 'community_hub_preset',
};

// Helper para subir imágenes a Cloudinary
export async function uploadToCloudinary(
  file: File,
  folder: string = 'community_hub'
): Promise<{ public_id: string; url: string; thumbnail_url?: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Error uploading to Cloudinary');
  }

  const data = await response.json();
  return {
    public_id: data.public_id,
    url: data.secure_url,
    thumbnail_url: data.eager?.[0]?.secure_url || data.secure_url,
  };
}

// Helper para eliminar imágenes de Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await supabase.functions.invoke('delete-cloudinary-image', {
      body: { public_id: publicId },
    });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
}
