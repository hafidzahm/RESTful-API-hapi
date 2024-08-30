const { nanoid } = require('nanoid');
const notes = require('./notes');
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  // Lalu, bagaimana menentukan apakah newNote sudah masuk ke dalam array notes?
  //Mudah saja! Kita bisa memanfaatkan method filter() berdasarkan id catatan untuk mengetahuinya

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  //kita gunakan isSuccess untuk menentukan respons yang diberikan server.
  //Jika isSuccess bernilai true, maka beri response berhasil. Jika false, maka beri response gagal.

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  //Setelah mendapatkan nilai id, dapatkan objek note dengan id tersebut dari objek array notes. 
  //Manfaatkan method array filter() untuk mendapatkan objeknya.

  const note = notes.filter((n) => n.id === id[0]);
  //Kita kembalikan fungsi handler dengan data beserta objek note di dalamnya. 
  //Namun sebelum itu, pastikan dulu objek note tidak bernilai undefined. 
  //Bila undefined, kembalikan dengan respons 
  
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    }
  }

    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan'
    });
    response.code(404);
    return response


  
};

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler };