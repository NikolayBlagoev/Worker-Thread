const client = new WebTorrent()

client.on('error', function (err) {
    alert('ERROR: ' + err.message)
})

// client.add(magnetURI, { path: '/path/to/folder' }, function (torrent) {
//     torrent.on('done', function () {
//       console.log('torrent download finished')
//     })
// })

async function add_torrent(){
    // document.getElementById('fileselector').click()
    const dirHandle = await window.showDirectoryPicker();
    // console.log(await dirHandle.resolve())
    const relativePaths = await FileSystemDirectoryHandle().resolve(dirHandle);
    // const handler = await window.showOpenDialog({properties: ['openDirectory', 'multiSelections']})
    // const folderPath = handler.filePaths[0];
        
   
    // console.log(folderPath)
}
function browseResult(e){
    var fileselector = document.getElementById('fileselector');
    console.log(fileselector.value);
  }