import * as renderers from './renderers';

export default [
    {
        header: 'No KK',
        field: 'no_kk', 
        type: 'text',
        readOnly: true,
        width: 70,
    },
    {
        header: 'Nama KK',
        field: 'nama_kk', 
        type: 'text',        
        readOnly: true,
        width: 400,
    },
    {
        header: '#Anggota',
        field: 'jumlah_anggota', 
        type: 'numeric',
        width: 100,
    },
    {
        header: 'Lewati?',
        field: 'skip', 
        type: 'text',
        readOnly: true,
        width: 200,
    },
    {
        header: 'Status',
        field: 'status', 
        type: 'text',
        readOnly: true,
        width: 200,
    },
    {
        header: 'Nama Pengisi',
        field: 'nama_pengisi', 
        type: 'text',        
        readOnly: true,
        width: 1400,
    },
    {
        header: 'Username Pengisi',
        field: 'username_pengisi', 
        type: 'text',        
        readOnly: true,
        width: 1400,
    },
    {
        header: 'Waktu Isi',
        field: 'waktu_isi', 
        type: 'text',        
        readOnly: true,
        width: 1400,
    },
    {
        header: 'Pesan',
        field: 'pesan', 
        type: 'text',        
        readOnly: true,
        width: 1400,
    },
];

