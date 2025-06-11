import {createNote} from '../endPoints/createNotes';

export const postNotesApi = async body => {
  return createNote(body).then(response => response?.data);
};
