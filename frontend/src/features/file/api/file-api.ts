import api from '@/lib/api';

export const uploadFilesApi = async (files: File[], folderPath?: string) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  if (folderPath) {
    formData.append('folderPath', folderPath);
  }

  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getFilesApi = async () => {
  const response = await api.get('/files');
  return response.data;
};

export const deleteFileApi = async (id: string) => {
  const response = await api.post(`/files/${id}/delete`, { id });
  return response.data;
};
